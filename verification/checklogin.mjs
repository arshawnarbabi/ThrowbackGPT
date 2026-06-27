import { chromium } from "playwright";

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 2 });
const p = await ctx.newPage(); // fresh, empty localStorage

await p.goto("http://localhost:3000", { waitUntil: "networkidle" });
await p.waitForTimeout(1000);

const hasLogin = await p.getByText("Welcome to ThrowbackGPT").count();
const hasNewChat = await p.getByRole("button", { name: "New chat" }).count();
await p.screenshot({ path: "verification/actual/00-fresh-load.png" });
console.log("login splash present:", hasLogin > 0, "| chat sidebar (New chat) present:", hasNewChat > 0);

// dismiss onboarding modal if it appears, then capture clean chat
try {
  await p.getByRole("button", { name: "Next" }).click();
  await p.waitForTimeout(200);
  await p.getByRole("button", { name: "Done" }).click();
  await p.waitForTimeout(300);
} catch {}
await p.screenshot({ path: "verification/actual/00-chat-direct.png" });

await b.close();
