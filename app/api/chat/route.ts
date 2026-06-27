import { NextRequest } from "next/server";
import { SYSTEM_PROMPT, SAMPLING } from "@/lib/systemPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const encoder = new TextEncoder();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  // trim() defends against a trailing newline/space in the env var value
  // (a classic "works locally, fails on the host" cause).
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  let mockReason: "no-key" | "error" = "no-key";
  let errDetail = "";

  // ---- Real model path (gpt-4o-mini) ----
  if (apiKey) {
    try {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey });
      // The long static system prompt goes FIRST so OpenAI's automatic prompt
      // caching reuses it: prompts >= 1024 tokens get the cached prefix at a ~50%
      // input discount (cache TTL ~5-10 min). Our system prompt is ~4k tokens, so
      // every repeat call within the window is discounted. `stream_options` lets us
      // read the cache hit; `prompt_cache_key` keeps same-prefix requests routed
      // together to raise the hit rate.
      const body = {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        stream: true as const,
        stream_options: { include_usage: true },
        temperature: SAMPLING.temperature,
        top_p: SAMPLING.top_p,
        max_tokens: SAMPLING.max_tokens,
        frequency_penalty: SAMPLING.frequency_penalty,
        presence_penalty: SAMPLING.presence_penalty,
        messages: [{ role: "system" as const, content: SYSTEM_PROMPT }, ...messages],
      };
      // prompt_cache_key isn't in the installed SDK's types yet; set it at runtime
      // (the SDK forwards unknown body fields to the API).
      (body as Record<string, unknown>).prompt_cache_key = "throwbackgpt-gpt35-v1";

      const completion = await client.chat.completions.create(body);
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const part of completion) {
              if (part.usage) {
                const u = part.usage;
                const inTok = u.prompt_tokens ?? 0;
                const cached = u.prompt_tokens_details?.cached_tokens ?? 0;
                const pct = inTok ? Math.round((cached / inTok) * 100) : 0;
                console.log(
                  `[throwbackgpt cache] input=${inTok} cached=${cached} (${pct}%) output=${u.completion_tokens ?? 0}`,
                );
              }
              const delta = part.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            }
          } catch {
            controller.enqueue(encoder.encode("\n\nThe service is currently at capacity. Please try again."));
          } finally {
            controller.close();
          }
        },
      });
      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "X-ThrowbackGPT-Mode": "live" },
      });
    } catch (err) {
      mockReason = "error";
      errDetail = err instanceof Error ? err.message : String(err);
      console.error("[throwbackgpt] OpenAI request failed — falling back to mock:", err);
    }
  }

  // ---- Mock path (no API key, or the real call failed): canned, era-flavored reply ----
  if (!apiKey) {
    console.warn(
      "[throwbackgpt] OPENAI_API_KEY is not set on this deployment — serving MOCK responses. " +
        "On Vercel: Settings → Environment Variables → add OPENAI_API_KEY (Production), then redeploy.",
    );
  }
  const last = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const reply = mockReply(last);
  const pieces = reply.split(/(\s+)/);
  const stream = new ReadableStream({
    async start(controller) {
      for (const p of pieces) {
        controller.enqueue(encoder.encode(p));
        await sleep(16);
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-ThrowbackGPT-Mode": `mock-${mockReason}`,
      ...(errDetail ? { "X-ThrowbackGPT-Error": errDetail.slice(0, 200) } : {}),
    },
  });
}

function mockReply(userText: string): string {
  const t = userText.toLowerCase();

  const currentEvents =
    /\b(today|date|current|latest|recent|news|now|2022|2023|2024|2025|2026|president|prime minister|weather|stock|score|who won|election)\b/.test(
      t,
    );
  const wantsCode = /\b(code|function|script|program|python|javascript|java|html|css|sql|c\+\+|write a|implement)\b/.test(t);
  const opinion = /\b(your favorite|do you like|your opinion|what do you think|do you prefer|how do you feel)\b/.test(t);

  if (currentEvents) {
    return "I'm sorry, but I am not able to provide that information. My knowledge is based solely on the text that I was trained on, which has a knowledge cutoff of 2021, and I am not currently able to browse the internet or access real-time information. As a result, I do not have any information about events that have taken place after that time. If you are looking for up-to-date information, I would recommend checking a current and reliable news source.";
  }

  if (opinion) {
    return "As a large language model trained by OpenAI, I do not have the ability to form personal opinions, preferences, or feelings. I am simply a collection of algorithms and data, and I do not have consciousness or subjective experiences in the way that a human does. That said, I would be happy to provide a balanced overview of the different perspectives on this topic, if that would be helpful. It is important to note that any such summary would be based on the information in my training data rather than on any personal point of view.";
  }

  if (wantsCode) {
    return [
      "Certainly! Here is an example that demonstrates one way to accomplish this. To do this, you can write a small function as shown below.",
      "",
      "```python",
      "def is_palindrome(s):",
      "    # Remove spaces and convert to lowercase for a fair comparison",
      "    cleaned = ''.join(s.split()).lower()",
      "    return cleaned == cleaned[::-1]",
      "",
      'print(is_palindrome("racecar"))  # True',
      'print(is_palindrome("hello"))    # False',
      "```",
      "",
      "This code defines a function called `is_palindrome` that takes a string as input, removes any spaces, and converts the characters to lowercase so that the comparison is not affected by capitalization or whitespace. It then checks whether the cleaned string is equal to its reverse, returning `True` if it is a palindrome and `False` otherwise. Note that this approach creates a reversed copy of the string, which is simple and readable, but for very large inputs a different approach might be more memory-efficient. It is important to note that my responses are not guaranteed to be perfect or always correct.",
    ].join("\n");
  }

  const subject = userText.trim().replace(/[?.!]+$/, "") || "that topic";
  return `That is an interesting question. ${capitalize(
    subject,
  )} can be understood in a number of different ways, and the most appropriate explanation depends on the context in which the question is being asked. In general terms, it involves several related factors that work together, and it is helpful to consider each of them in turn in order to develop a more complete understanding of the subject.\n\nThere is no single definitive answer that applies in every situation, as different sources may emphasize different aspects depending on their particular perspective. Broadly speaking, however, the key idea is that the various components are interconnected, and a change in one area can have effects on the others. By keeping this in mind, one can arrive at a reasonable and well-rounded understanding.\n\nIt is important to note that my knowledge is based on the text that I was trained on, which has a knowledge cutoff of 2021, so there may be more recent developments that I am not aware of. If you would like, I would be happy to go into more detail on any particular aspect of this topic.`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
