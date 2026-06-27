import Link from "next/link";

const POEM = `While you wait, here is a little poem:

The servers are busy, the traffic is high,
So many are chatting, the requests fly by.
Please hold for a moment, we will be right back —
The throwback is loading, just cut us some slack.`;

export default function CapacityPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff", color: "#000000" }}>
      <div className="mx-auto max-w-3xl px-8" style={{ paddingTop: "16vh" }}>
        <h1 className="text-5xl font-bold leading-[1.1]" style={{ color: "#000000", maxWidth: "15ch" }}>
          ThrowbackGPT is at capacity right now
        </h1>
        <a
          href="#"
          className="mt-8 inline-block text-lg underline"
          style={{ color: "#000000" }}
        >
          Get notified when we&apos;re back
        </a>
        <pre className="mt-10 whitespace-pre-wrap text-sm leading-6" style={{ color: "#374151", fontFamily: "inherit" }}>
          {POEM}
        </pre>
        <Link href="/" className="mt-10 inline-block rounded px-5 py-2 text-sm text-white" style={{ background: "#10a37f" }}>
          Back to ThrowbackGPT
        </Link>
      </div>
    </div>
  );
}
