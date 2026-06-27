"use client";

import { ReactNode, useState } from "react";
import { useStore } from "@/lib/store";
import Overlay from "./Overlay";
import { Wordmark } from "@/lib/logo";
import { BeakerIcon, WarningIcon, ChatIcon, HelpIcon } from "@/lib/icons";

const STEPS: { heading: string; cards: { icon: ReactNode; text: string }[] }[] = [
  {
    heading: "This is a free research preview.",
    cards: [
      { icon: <BeakerIcon width={20} height={20} />, text: "Our goal is to get external feedback in order to improve our systems and make them safer." },
      {
        icon: <WarningIcon width={20} height={20} />,
        text: "While we have safeguards in place, the system may occasionally generate incorrect or misleading information and produce offensive or biased content. It is not intended to give advice.",
      },
    ],
  },
  {
    heading: "How we collect data.",
    cards: [
      { icon: <ChatIcon width={20} height={20} />, text: "Conversations may be reviewed to improve our systems. Please don't share any sensitive information in your conversations." },
      { icon: <HelpIcon width={20} height={20} />, text: "This system is optimized for dialogue. Let us know if a particular response was good or unhelpful with the thumbs up/down buttons." },
    ],
  },
];

export default function OnboardingModal() {
  const setOnboarded = useStore((s) => s.setOnboarded);
  const [step, setStep] = useState(0);
  const cur = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <Overlay>
      <div className="rounded-md p-6" style={{ background: "var(--main-bg)", color: "var(--text)" }}>
        <h2 className="mb-1 text-2xl font-bold">
          <Wordmark />
        </h2>
        <h3 className="mb-5 text-lg font-bold">{cur.heading}</h3>
        <div className="space-y-3">
          {cur.cards.map((c, i) => (
            <div key={i} className="flex items-start gap-3 rounded-md p-3" style={{ background: "var(--card-bg)" }}>
              <span className="mt-0.5 shrink-0" style={{ color: "var(--text-secondary)" }}>
                {c.icon}
              </span>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {c.text}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: i === step ? "var(--green)" : "var(--row-border)" }} />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="rounded border px-4 py-1.5 text-sm" style={{ borderColor: "var(--row-border)" }}>
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => (last ? setOnboarded(true) : setStep(step + 1))}
              className="rounded border px-4 py-1.5 text-sm"
              style={{ borderColor: "var(--row-border)" }}
            >
              {last ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
