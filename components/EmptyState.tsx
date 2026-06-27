"use client";

import { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { Wordmark } from "@/lib/logo";
import { SunIcon, BoltIcon, WarningIcon } from "@/lib/icons";

const EXAMPLES = [
  '"Explain quantum computing in simple terms" →',
  "\"Got any creative ideas for a 10 year old’s birthday?\" →",
  '"How do I make an HTTP request in Javascript?" →',
];
const CAPABILITIES = [
  "Remembers what user said earlier in the conversation",
  "Allows user to provide follow-up corrections",
  "Trained to decline inappropriate requests",
];
const LIMITATIONS = [
  "May occasionally generate incorrect information",
  "May occasionally produce harmful instructions or biased content",
  "Limited knowledge of world and events after 2021",
];

function Column({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-3">
        <div style={{ color: "var(--text)" }}>{icon}</div>
        <div className="text-lg" style={{ color: "var(--text)" }}>
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

function Card({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="w-full rounded-md px-3 py-3 text-center text-sm transition-colors"
      style={{
        background: "var(--card-bg)",
        color: "var(--text)",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.background = "var(--card-hover)")}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.background = "var(--card-bg)")}
    >
      {children}
    </button>
  );
}

export default function EmptyState() {
  const sendMessage = useStore((s) => s.sendMessage);
  const send = (ex: string) => {
    const text = ex.replace(/^"/, "").replace(/"\s*→\s*$/, "").trim();
    sendMessage(text);
  };

  return (
    <div className="tbgpt-scroll flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-10 pt-10">
        <h1 className="mb-12 mt-10 text-4xl font-semibold" style={{ color: "var(--text)" }}>
          <Wordmark />
        </h1>
        <div className="grid w-full gap-7 md:grid-cols-3">
          <Column icon={<SunIcon width={24} height={24} />} title="Examples">
            {EXAMPLES.map((e) => (
              <Card key={e} onClick={() => send(e)}>
                {e}
              </Card>
            ))}
          </Column>
          <Column icon={<BoltIcon width={24} height={24} />} title="Capabilities">
            {CAPABILITIES.map((e) => (
              <Card key={e}>{e}</Card>
            ))}
          </Column>
          <Column icon={<WarningIcon width={24} height={24} />} title="Limitations">
            {LIMITATIONS.map((e) => (
              <Card key={e}>{e}</Card>
            ))}
          </Column>
        </div>
      </div>
    </div>
  );
}
