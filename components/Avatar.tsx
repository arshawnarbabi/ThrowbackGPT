import { ThrowbackMark } from "@/lib/logo";

export function AssistantAvatar() {
  return <ThrowbackMark size={30} />;
}

export function UserAvatar({ initials = "U" }: { initials?: string }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-sm shrink-0 text-white"
      style={{ width: 30, height: 30, background: "#5436da", fontSize: 12, fontWeight: 500 }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
