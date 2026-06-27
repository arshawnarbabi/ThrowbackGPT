"use client";

import { useStore } from "@/lib/store";
import { ThrowbackMark } from "@/lib/logo";

export default function LoginSplash() {
  const setLoggedIn = useStore((s) => s.setLoggedIn);
  return (
    <div className="flex h-screen flex-col items-center justify-center px-6 text-center" style={{ background: "var(--assistant-bg)" }}>
      <div className="mb-6">
        <ThrowbackMark size={56} />
      </div>
      <h1 className="mb-2 text-2xl" style={{ color: "var(--text)" }}>
        Welcome to ThrowbackGPT
      </h1>
      <p className="mb-7 text-base" style={{ color: "var(--text-secondary)" }}>
        Log in to continue
      </p>
      <div className="flex gap-3">
        <button type="button" onClick={() => setLoggedIn(true)} className="rounded px-7 py-2 text-white transition-colors" style={{ background: "var(--green)" }}>
          Log in
        </button>
        <button type="button" onClick={() => setLoggedIn(true)} className="rounded px-7 py-2 text-white transition-colors" style={{ background: "var(--green)" }}>
          Sign up
        </button>
      </div>
      <p className="mt-12 text-xs" style={{ color: "var(--text-faint)" }}>
        An independent nostalgia recreation · not affiliated with OpenAI
      </p>
    </div>
  );
}
