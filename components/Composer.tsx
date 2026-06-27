"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { SendIcon, RefreshIcon } from "@/lib/icons";

export default function Composer() {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = useStore((s) => s.sendMessage);
  const regenerate = useStore((s) => s.regenerate);
  const stop = useStore((s) => s.stop);
  const isStreaming = useStore((s) => s.isStreaming);
  const hasMessages = useStore(
    (s) => ((s.conversations.find((c) => c.id === s.activeId)?.messages.length ?? 0) > 0),
  );

  const grow = () => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  };
  const submit = () => {
    const v = value.trim();
    if (!v || isStreaming) return;
    sendMessage(v);
    setValue("");
    requestAnimationFrame(() => {
      if (taRef.current) taRef.current.style.height = "auto";
    });
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const active = value.trim().length > 0 && !isStreaming;

  return (
    <div className="shrink-0 pb-2 pt-2">
      <div className="flex justify-center pb-2" style={{ minHeight: 36 }}>
        {isStreaming ? (
          <button type="button" onClick={stop} className="action-pill">
            <RefreshIcon width={16} height={16} /> Stop generating
          </button>
        ) : hasMessages ? (
          <button type="button" onClick={() => regenerate()} className="action-pill">
            <RefreshIcon width={16} height={16} /> Regenerate response
          </button>
        ) : null}
      </div>

      <div className="mx-auto max-w-3xl px-4">
        <div
          className="relative flex items-end rounded-md"
          style={{
            background: "var(--composer-bg)",
            border: "1px solid var(--composer-border)",
            boxShadow: "0 0 10px rgba(0,0,0,0.10)",
          }}
        >
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              grow();
            }}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder=""
            className="max-h-[200px] flex-1 resize-none bg-transparent py-3 pl-4 pr-12 leading-6 outline-none"
            style={{ color: "var(--text)" }}
          />
          <button
            type="button"
            onClick={submit}
            disabled={!active}
            className="absolute bottom-2.5 right-2.5 rounded p-1 transition-colors"
            style={{ color: active ? "var(--green)" : "var(--send-icon)", cursor: active ? "pointer" : "default" }}
            aria-label="Send message"
          >
            <SendIcon width={18} height={18} />
          </button>
        </div>

      </div>

      <div className="px-4 pb-3 pt-3 text-center text-xs leading-5" style={{ color: "var(--text-faint)" }}>
        <a href="#" onClick={(e) => e.preventDefault()} className="underline">
          ThrowbackGPT Dec 15 Version
        </a>
        . Free Research Preview. Our goal is to make AI systems more natural and safe to interact with. Your
        feedback will help us improve.
        <div className="mt-0.5 text-[11px] opacity-80">
          Independent nostalgia project · not affiliated with OpenAI.
        </div>
      </div>
    </div>
  );
}
