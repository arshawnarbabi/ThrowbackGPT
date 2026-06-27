"use client";

import { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui";
import Overlay from "./Overlay";
import { CloseIcon } from "@/lib/icons";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}

export default function SettingsDialog() {
  const open = useUI((s) => s.settingsOpen);
  const close = useUI((s) => s.closeSettings);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const clearAll = useStore((s) => s.clearAll);
  if (!open) return null;

  return (
    <Overlay onClose={close}>
      <div className="rounded-2xl" style={{ background: "var(--main-bg)", color: "var(--text)" }}>
        <div className="flex items-center justify-between px-6 pb-2 pt-5">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button type="button" onClick={close} aria-label="Close" style={{ color: "var(--text-secondary)" }}>
            <CloseIcon />
          </button>
        </div>
        <div className="space-y-5 px-6 pb-6 pt-2">
          <Row label="Theme">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value === "dark" ? "dark" : "light")}
              className="rounded border px-2 py-1 text-sm"
              style={{ borderColor: "var(--row-border)", background: "var(--main-bg)", color: "var(--text)" }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </Row>
          <Row label="Clear conversations">
            <button
              type="button"
              onClick={() => {
                clearAll();
                close();
              }}
              className="rounded border px-3 py-1.5 text-sm"
              style={{ borderColor: "#ef4146", color: "#ef4146", background: "transparent" }}
            >
              Clear
            </button>
          </Row>
        </div>
      </div>
    </Overlay>
  );
}
