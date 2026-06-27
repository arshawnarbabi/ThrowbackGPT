"use client";

import { ReactNode, useState } from "react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui";
import {
  PlusIcon,
  TrashIcon,
  MoonIcon,
  SunIcon,
  DiscordIcon,
  ExternalLinkIcon,
  LogoutIcon,
  PencilIcon,
  GearIcon,
  CloseIcon,
} from "@/lib/icons";

const ChatBubble = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
const Check = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ROW = "flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm text-[color:var(--sidebar-text)] transition-colors hover:bg-[#2a2b32]";

function MenuButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={ROW}>
      {icon}
      <span className="flex-1">{label}</span>
    </button>
  );
}
function MenuLink({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <a href="#" onClick={(e) => e.preventDefault()} className={ROW}>
      {icon}
      <span className="flex-1">{label}</span>
      <ExternalLinkIcon width={14} height={14} />
    </a>
  );
}

export default function Sidebar() {
  const conversations = useStore((s) => s.conversations);
  const activeId = useStore((s) => s.activeId);
  const newConversation = useStore((s) => s.newConversation);
  const selectConversation = useStore((s) => s.selectConversation);
  const deleteConversation = useStore((s) => s.deleteConversation);
  const renameConversation = useStore((s) => s.renameConversation);
  const clearAll = useStore((s) => s.clearAll);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const setLoggedIn = useStore((s) => s.setLoggedIn);

  const openSettings = useUI((s) => s.openSettings);
  const sidebarOpen = useUI((s) => s.sidebarOpen);
  const setSidebar = useUI((s) => s.setSidebar);

  const [clearConfirm, setClearConfirm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const commitEdit = () => {
    if (editingId) renameConversation(editingId, editValue);
    setEditingId(null);
  };

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebar(false)} />
      )}
      <aside
        className={
          "sidebar-scroll fixed inset-y-0 left-0 z-40 flex h-full w-[260px] flex-col transition-transform md:static md:translate-x-0 " +
          (sidebarOpen ? "translate-x-0" : "-translate-x-full")
        }
        style={{ background: "var(--sidebar-bg)" }}
      >
        {/* New chat */}
        <div className="p-2">
          <button
            type="button"
            onClick={() => {
              newConversation();
              setSidebar(false);
            }}
            className="flex w-full items-center gap-3 rounded-md border px-3 py-3 text-left text-sm text-[color:var(--sidebar-text)] transition-colors hover:bg-[#2a2b32]"
            style={{ borderColor: "var(--sidebar-border)" }}
          >
            <PlusIcon /> <span>New chat</span>
          </button>
        </div>

        {/* Conversation history */}
        <div className="sidebar-scroll flex-1 overflow-y-auto px-2">
          {conversations.map((c) => {
            const active = c.id === activeId;
            const editing = editingId === c.id;
            const confirming = deleteId === c.id;
            return (
              <div
                key={c.id}
                className="group relative my-0.5 flex items-center gap-2 rounded-md px-3 py-3 text-sm text-[color:var(--sidebar-text)] transition-colors hover:bg-[#2a2b32]"
                style={{ background: active ? "var(--sidebar-hover)" : "transparent", cursor: "pointer" }}
                onClick={() => {
                  if (!editing && !confirming) {
                    selectConversation(c.id);
                    setSidebar(false);
                  }
                }}
              >
                <ChatBubble />
                {editing ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="min-w-0 flex-1 border border-[color:var(--green)] bg-transparent px-1 text-sm outline-none"
                  />
                ) : (
                  <span className="min-w-0 flex-1 truncate">{c.title}</span>
                )}

                {/* row actions */}
                <span
                  className={
                    "flex items-center gap-1 " + (active || confirming || editing ? "flex" : "hidden group-hover:flex")
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  {confirming ? (
                    <>
                      <button type="button" aria-label="Confirm delete" className="opacity-70 hover:opacity-100" onClick={() => { deleteConversation(c.id); setDeleteId(null); }}>
                        <Check />
                      </button>
                      <button type="button" aria-label="Cancel" className="opacity-70 hover:opacity-100" onClick={() => setDeleteId(null)}>
                        <CloseIcon width={16} height={16} />
                      </button>
                    </>
                  ) : editing ? (
                    <>
                      <button type="button" aria-label="Save" className="opacity-70 hover:opacity-100" onClick={commitEdit}>
                        <Check />
                      </button>
                      <button type="button" aria-label="Cancel" className="opacity-70 hover:opacity-100" onClick={() => setEditingId(null)}>
                        <CloseIcon width={16} height={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" aria-label="Rename" className="opacity-70 hover:opacity-100" onClick={() => { setEditingId(c.id); setEditValue(c.title); }}>
                        <PencilIcon width={16} height={16} />
                      </button>
                      <button type="button" aria-label="Delete" className="opacity-70 hover:opacity-100" onClick={() => setDeleteId(c.id)}>
                        <TrashIcon width={16} height={16} />
                      </button>
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom menu */}
        <div className="border-t p-2" style={{ borderColor: "var(--sidebar-border)" }}>
          {clearConfirm ? (
            <div className={ROW + " justify-between"}>
              <span className="flex items-center gap-3">
                <TrashIcon /> Are you sure?
              </span>
              <span className="flex items-center gap-2">
                <button type="button" aria-label="Confirm clear" className="opacity-70 hover:opacity-100" onClick={() => { clearAll(); setClearConfirm(false); }}>
                  <Check />
                </button>
                <button type="button" aria-label="Cancel" className="opacity-70 hover:opacity-100" onClick={() => setClearConfirm(false)}>
                  <CloseIcon width={16} height={16} />
                </button>
              </span>
            </div>
          ) : (
            <MenuButton icon={<TrashIcon />} label="Clear conversations" onClick={() => setClearConfirm(true)} />
          )}
          <MenuButton
            icon={theme === "light" ? <MoonIcon /> : <SunIcon />}
            label={theme === "light" ? "Dark mode" : "Light mode"}
            onClick={toggleTheme}
          />
          <MenuLink icon={<DiscordIcon />} label="Discord" />
          <MenuLink icon={<ExternalLinkIcon />} label="Updates & FAQ" />
          <MenuButton icon={<GearIcon />} label="Settings" onClick={openSettings} />
          <MenuButton icon={<LogoutIcon />} label="Log out" onClick={() => setLoggedIn(false)} />
        </div>
      </aside>
    </>
  );
}
