import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThrowbackGPT",
  description:
    "A nostalgia recreation of the original November 2022 ChatGPT interface. An independent project, not affiliated with OpenAI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
