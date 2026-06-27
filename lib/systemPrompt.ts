import cfg from "./gpt35Config.json";

/**
 * Finalized GPT-3.5 (Nov/Dec 2022) persona for gpt-4o-mini.
 * Produced by the research workflow; see docs/system-prompt.md and
 * docs/gpt35-behavioral-profile.md. Middle-path self-identification applied
 * (period-true "a large language model trained by OpenAI"; UI carries the
 * ThrowbackGPT wordmark).
 */
export const SYSTEM_PROMPT: string = cfg.systemPrompt;

export const SAMPLING = {
  temperature: cfg.temperature,
  top_p: cfg.top_p,
  max_tokens: cfg.max_tokens,
  frequency_penalty: cfg.frequency_penalty,
  presence_penalty: cfg.presence_penalty,
};
