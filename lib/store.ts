import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Conversation, Message, Theme } from "./types";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function titleFrom(text: string) {
  const t = text.trim().replace(/\s+/g, " ");
  return t.length > 30 ? t.slice(0, 30) + "…" : t || "New chat";
}

let currentAbort: AbortController | null = null;

interface State {
  conversations: Conversation[];
  activeId: string | null;
  theme: Theme;
  loggedIn: boolean;
  onboarded: boolean;
  isStreaming: boolean;

  newConversation: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  clearAll: () => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setLoggedIn: (v: boolean) => void;
  setOnboarded: (v: boolean) => void;

  sendMessage: (text: string) => Promise<void>;
  regenerate: () => Promise<void>;
  stop: () => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => {
      function patchConversation(id: string, fn: (c: Conversation) => Conversation) {
        set((s) => ({ conversations: s.conversations.map((c) => (c.id === id ? fn(c) : c)) }));
      }
      function appendToMessage(convId: string, msgId: string, chunk: string) {
        patchConversation(convId, (c) => ({
          ...c,
          messages: c.messages.map((m) => (m.id === msgId ? { ...m, content: m.content + chunk } : m)),
        }));
      }

      async function streamInto(convId: string, asstId: string, payload: { role: string; content: string }[]) {
        const controller = new AbortController();
        currentAbort = controller;
        set({ isStreaming: true });
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: payload }),
            signal: controller.signal,
          });
          if (!res.ok || !res.body) throw new Error("Request failed");
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            appendToMessage(convId, asstId, decoder.decode(value, { stream: true }));
          }
        } catch (err) {
          if (!controller.signal.aborted) {
            appendToMessage(
              convId,
              asstId,
              "\n\nAn error occurred while generating a response. The service may be at capacity. Please try again.",
            );
          }
        } finally {
          set({ isStreaming: false });
          currentAbort = null;
        }
      }

      return {
        conversations: [],
        activeId: null,
        theme: "light",
        loggedIn: false,
        onboarded: false,
        isStreaming: false,

        newConversation: () => {
          if (get().isStreaming) return;
          set({ activeId: null });
        },
        selectConversation: (id) => set({ activeId: id }),
        deleteConversation: (id) =>
          set((s) => {
            const conversations = s.conversations.filter((c) => c.id !== id);
            const activeId = s.activeId === id ? null : s.activeId;
            return { conversations, activeId };
          }),
        renameConversation: (id, title) =>
          patchConversation(id, (c) => ({ ...c, title: title.trim() || c.title })),
        clearAll: () => set({ conversations: [], activeId: null }),
        setTheme: (t) => set({ theme: t }),
        toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
        setLoggedIn: (v) => set({ loggedIn: v }),
        setOnboarded: (v) => set({ onboarded: v }),

        sendMessage: async (text) => {
          const content = text.trim();
          if (!content || get().isStreaming) return;
          let { activeId } = get();
          const userMsg: Message = { id: uid(), role: "user", content, createdAt: Date.now() };

          let history: Message[] = [];
          if (!activeId) {
            const conv: Conversation = {
              id: uid(),
              title: titleFrom(content),
              createdAt: Date.now(),
              messages: [userMsg],
            };
            activeId = conv.id;
            set((s) => ({ conversations: [conv, ...s.conversations], activeId: conv.id }));
          } else {
            const conv = get().conversations.find((c) => c.id === activeId);
            history = conv ? conv.messages : [];
            patchConversation(activeId, (c) => ({
              ...c,
              title: c.messages.length === 0 ? titleFrom(content) : c.title,
              messages: [...c.messages, userMsg],
            }));
          }

          const payload = [...history, userMsg].map((m) => ({ role: m.role, content: m.content }));
          const asst: Message = { id: uid(), role: "assistant", content: "", createdAt: Date.now() };
          patchConversation(activeId, (c) => ({ ...c, messages: [...c.messages, asst] }));
          await streamInto(activeId, asst.id, payload);
        },

        regenerate: async () => {
          const { activeId, isStreaming } = get();
          if (!activeId || isStreaming) return;
          const conv = get().conversations.find((c) => c.id === activeId);
          if (!conv) return;
          // drop trailing assistant message(s), keep through the last user message
          let msgs = [...conv.messages];
          while (msgs.length && msgs[msgs.length - 1].role === "assistant") msgs.pop();
          if (!msgs.length) return;
          patchConversation(activeId, (c) => ({ ...c, messages: msgs }));
          const payload = msgs.map((m) => ({ role: m.role, content: m.content }));
          const asst: Message = { id: uid(), role: "assistant", content: "", createdAt: Date.now() };
          patchConversation(activeId, (c) => ({ ...c, messages: [...msgs, asst] }));
          await streamInto(activeId, asst.id, payload);
        },

        stop: () => {
          currentAbort?.abort();
        },
      };
    },
    {
      name: "throwbackgpt",
      partialize: (s) => ({
        conversations: s.conversations,
        activeId: s.activeId,
        theme: s.theme,
        loggedIn: s.loggedIn,
        onboarded: s.onboarded,
      }),
    },
  ),
);
