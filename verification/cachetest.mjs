import OpenAI from "openai";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const key = (env.match(/OPENAI_API_KEY=([^\n]+)/) || [])[1].trim();
const cfg = JSON.parse(fs.readFileSync("lib/gpt35Config.json", "utf8"));
const client = new OpenAI({ apiKey: key });

async function call(userMsg, label) {
  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    stream_options: { include_usage: true },
    messages: [
      { role: "system", content: cfg.systemPrompt },
      { role: "user", content: userMsg },
    ],
  });
  let usage = null;
  let textLen = 0;
  for await (const part of stream) {
    if (part.usage) usage = part.usage;
    const d = part.choices?.[0]?.delta?.content;
    if (d) textLen += d.length;
  }
  console.log(`${label}: chars=${textLen} usage=${usage ? JSON.stringify(usage) : "NULL — no usage chunk"}`);
}

await call("Briefly tell me about the moon.", "call 1 (cold)");
await new Promise((r) => setTimeout(r, 1500));
await call("Briefly tell me about Mars.", "call 2 (same system prefix -> expect cached_tokens > 0)");
