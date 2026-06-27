"use client";

import { useState } from "react";
import { useUI } from "@/lib/ui";
import Overlay from "./Overlay";

const OPTIONS = ["This is harmful / unsafe", "This isn't true", "This isn't helpful"];

export default function FeedbackModal() {
  const open = useUI((s) => s.feedbackOpen);
  const close = useUI((s) => s.closeFeedback);
  const [text, setText] = useState("");
  if (!open) return null;

  return (
    <Overlay onClose={close}>
      <div className="rounded-md p-5" style={{ background: "var(--main-bg)", color: "var(--text)" }}>
        <h2 className="mb-4 text-lg font-medium">Provide additional feedback</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What was the issue with the response? How could it be improved?"
          className="h-24 w-full rounded border p-2 text-sm outline-none"
          style={{ borderColor: "var(--row-border)", background: "var(--main-bg)", color: "var(--text)" }}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {OPTIONS.map((o) => (
            <span key={o} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--row-border)", color: "var(--text-secondary)" }}>
              {o}
            </span>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setText("");
              close();
            }}
            className="rounded px-4 py-2 text-sm text-white"
            style={{ background: "var(--green)" }}
          >
            Submit feedback
          </button>
        </div>
      </div>
    </Overlay>
  );
}
