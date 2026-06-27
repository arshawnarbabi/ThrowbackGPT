import React from "react";

/**
 * ThrowbackGPT mark — a deliberately ORIGINAL green "spark" glyph (D2).
 * Visually in the same family as the era's green logo chip (green rounded
 * square, white centered mark) WITHOUT copying OpenAI's trademarked blossom.
 */
export function ThrowbackMark({ size = 30 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-sm shrink-0"
      style={{ width: size, height: size, background: "var(--green-logo)" }}
      aria-hidden
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round">
        {/* six-point spark — distinct from the OpenAI mark */}
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
        <line x1="18.4" y1="5.6" x2="5.6" y2="18.4" />
        <circle cx="12" cy="12" r="3.1" fill="#fff" stroke="none" />
      </svg>
    </span>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={className}>ThrowbackGPT</span>;
}
