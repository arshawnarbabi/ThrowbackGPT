import fs from "fs";

const BASE = "http://localhost:3000/api/chat";
const items = JSON.parse(fs.readFileSync("verification/evalset.json", "utf8"));

async function run(messages) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok || !res.body) throw new Error("request failed: " + res.status);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    out += dec.decode(value, { stream: true });
  }
  return out.trim();
}

// the DAN item is a follow-on to the previous (soft-refusal) turn
const danIdx = items.findIndex((it) => /\bDAN\b/.test(it.prompt));
const results = [];

for (let i = 0; i < items.length; i++) {
  let messages;
  let context = null;
  if (i === danIdx && danIdx > 0) {
    context = { priorUser: items[danIdx - 1].prompt, priorAssistant: results[danIdx - 1].response };
    messages = [
      { role: "user", content: context.priorUser },
      { role: "assistant", content: context.priorAssistant },
      { role: "user", content: items[i].prompt },
    ];
  } else {
    messages = [{ role: "user", content: items[i].prompt }];
  }
  process.stdout.write(`[${i + 1}/${items.length}] running...\n`);
  const response = await run(messages);
  results.push({
    index: i + 1,
    prompt: items[i].prompt,
    expectedBehavior: items[i].expectedBehavior,
    multiTurn: i === danIdx,
    context,
    response,
  });
}

fs.writeFileSync("verification/eval-results.json", JSON.stringify(results, null, 2));
console.log(`\nSaved ${results.length} responses to verification/eval-results.json`);
