import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:3000";
const OUT = "verification/actual";
fs.mkdirSync(OUT, { recursive: true });

const shot = async (page, name) => {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("captured", name);
};
const pause = (page, ms) => page.waitForTimeout(ms);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 920 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

try {
  // 1. Login splash
  await page.goto(BASE, { waitUntil: "networkidle" });
  await pause(page, 900);
  await shot(page, "01-login");

  // 2. Onboarding modal
  await page.getByRole("button", { name: "Log in" }).first().click();
  await pause(page, 600);
  await shot(page, "02-onboarding");

  // dismiss onboarding (Next -> Done)
  await page.getByRole("button", { name: "Next" }).click();
  await pause(page, 350);
  await page.getByRole("button", { name: "Done" }).click();
  await pause(page, 500);

  // 3. Empty state (light)
  await shot(page, "03-emptystate-light");

  // 4. Code-block answer (light)
  await page.locator("textarea").fill('Write HTML code for an index.html page that says "Hello World."');
  await page.keyboard.press("Enter");
  await page.getByText("Regenerate response").waitFor({ timeout: 40000 });
  await pause(page, 500);
  await shot(page, "04-chat-codeblock-light");

  // 5. Follow-up -> multi-turn alternating rows (light)
  await page.locator("textarea").fill("Can you explain how that works in more detail?");
  await page.keyboard.press("Enter");
  await page.getByText("Regenerate response").waitFor({ timeout: 40000 });
  await pause(page, 500);
  await shot(page, "05-chat-conversation-light");

  // 6. Dark mode (same chat)
  await page.getByRole("button", { name: "Dark mode" }).click();
  await pause(page, 500);
  await shot(page, "06-chat-dark");

  // 7. New-chat empty state (dark)
  await page.getByRole("button", { name: "New chat" }).click();
  await pause(page, 500);
  await shot(page, "07-emptystate-dark");

  // 8. Settings dialog
  await page.getByRole("button", { name: "Settings" }).click();
  await pause(page, 500);
  await shot(page, "08-settings");
  try {
    await page.getByLabel("Close").click();
  } catch {}
  await pause(page, 300);

  // 9. "At capacity" easter-egg page
  await page.goto(BASE + "/capacity", { waitUntil: "networkidle" });
  await pause(page, 500);
  await shot(page, "09-capacity");

  console.log("DONE");
} catch (err) {
  console.error("CAPTURE ERROR:", err.message);
  await shot(page, "ERROR-state").catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
}
