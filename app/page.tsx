"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui";
import Sidebar from "@/components/Sidebar";
import EmptyState from "@/components/EmptyState";
import ChatView from "@/components/ChatView";
import Composer from "@/components/Composer";
import OnboardingModal from "@/components/OnboardingModal";
import SettingsDialog from "@/components/SettingsDialog";
import FeedbackModal from "@/components/FeedbackModal";
import { MenuIcon } from "@/lib/icons";
import { Wordmark } from "@/lib/logo";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const theme = useStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const onboarded = useStore((s) => s.onboarded);
  const hasMessages = useStore(
    (s) => ((s.conversations.find((c) => c.id === s.activeId)?.messages.length ?? 0) > 0),
  );
  const toggleSidebar = useUI((s) => s.toggleSidebar);

  // avoid hydration mismatch with persisted (localStorage) state
  if (!mounted) return <div style={{ height: "100vh", background: "var(--main-bg)" }} />;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--main-bg)" }}>
      <Sidebar />
      <main className="flex h-full min-w-0 flex-1 flex-col">
        <div
          className="flex items-center gap-3 border-b px-3 py-2 md:hidden"
          style={{ borderColor: "var(--row-border)", color: "var(--text)" }}
        >
          <button type="button" onClick={toggleSidebar} aria-label="Open menu">
            <MenuIcon />
          </button>
          <span className="flex-1 text-center text-sm font-medium">
            <Wordmark />
          </span>
          <span className="w-5" />
        </div>
        {hasMessages ? <ChatView /> : <EmptyState />}
        <Composer />
      </main>
      {!onboarded && <OnboardingModal />}
      <SettingsDialog />
      <FeedbackModal />
    </div>
  );
}
