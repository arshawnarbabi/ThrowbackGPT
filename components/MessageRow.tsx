"use client";

import Markdown from "./Markdown";
import { AssistantAvatar, UserAvatar } from "./Avatar";
import { PencilIcon, ThumbUpIcon, ThumbDownIcon } from "@/lib/icons";
import { useUI } from "@/lib/ui";
import type { Message } from "@/lib/types";

export default function MessageRow({ message, streaming }: { message: Message; streaming: boolean }) {
  const isAssistant = message.role === "assistant";
  const openFeedback = useUI((s) => s.openFeedback);

  return (
    <div style={{ background: isAssistant ? "var(--assistant-bg)" : "var(--user-bg)", borderBottom: "1px solid var(--row-border)" }}>
      <div className="mx-auto flex gap-4 px-4 py-6 md:gap-6 md:px-6" style={{ maxWidth: 820 }}>
        <div className="pt-0.5">{isAssistant ? <AssistantAvatar /> : <UserAvatar />}</div>
        <div className="min-w-0 flex-1 text-[16px]" style={{ color: "var(--text)" }}>
          {isAssistant ? (
            <>
              <Markdown content={message.content} />
              {streaming && <span className="stream-cursor" />}
            </>
          ) : (
            <div className="whitespace-pre-wrap leading-7">{message.content}</div>
          )}
        </div>
        <div className="flex items-start gap-2 pt-1" style={{ color: "var(--text-faint)" }}>
          {isAssistant ? (
            <>
              <button type="button" className="transition-colors hover:text-[color:var(--text-secondary)]" aria-label="Good response">
                <ThumbUpIcon />
              </button>
              <button type="button" onClick={openFeedback} className="transition-colors hover:text-[color:var(--text-secondary)]" aria-label="Bad response">
                <ThumbDownIcon />
              </button>
            </>
          ) : (
            <button type="button" className="transition-colors hover:text-[color:var(--text-secondary)]" aria-label="Edit message">
              <PencilIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
