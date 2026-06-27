"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import MessageRow from "./MessageRow";

export default function ChatView() {
  const conversation = useStore((s) => s.conversations.find((c) => c.id === s.activeId) || null);
  const isStreaming = useStore((s) => s.isStreaming);
  const ref = useRef<HTMLDivElement>(null);
  const messages = conversation?.messages ?? [];
  const lastContent = messages[messages.length - 1]?.content ?? "";

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, lastContent]);

  return (
    <div ref={ref} className="tbgpt-scroll flex-1 overflow-y-auto">
      {messages.map((m, i) => (
        <MessageRow
          key={m.id}
          message={m}
          streaming={isStreaming && i === messages.length - 1 && m.role === "assistant"}
        />
      ))}
    </div>
  );
}
