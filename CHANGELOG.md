# Changelog

## v1.0.0 (2026-06-27)

First release. A faithful, open-source recreation of the original November 2022 ChatGPT, powered by `gpt-4o-mini` with a researched, eval-tuned GPT-3.5 (2022) persona.

Live demo: https://throwbackgpt.arshawnarbabi.com

### Added
- Classic Dec-2022 UI: the Examples / Capabilities / Limitations welcome screen, dark sidebar, alternating message rows, dark "Copy code" blocks, and the "Free Research Preview" footer.
- `gpt-4o-mini` system-prompted to imitate 2022 GPT-3.5: the 2021 knowledge cutoff, verbose hedging, prose-first answers, confident hallucination, and the prose → code → caveat shape. Reverse-engineered from primary sources and tuned against a 12-prompt eval.
- Token-by-token streaming with the blinking cursor; Stop generating / Regenerate response.
- Light and dark themes (default light; the sidebar stays dark in both, like the original).
- Multi-chat history with inline rename and delete (localStorage); the app boots straight into the chat.
- First-run onboarding modal, settings dialog, thumbs-down feedback modal, and the "ChatGPT is at capacity" easter egg.
- Automatic OpenAI prompt caching (about a 50% input discount on the cached system prompt).
- Mock mode when no API key is set, plus one-click Vercel deploy.

### Notes
- Not affiliated with OpenAI. The website, UI, and branding are independent; only the model backend uses OpenAI's `gpt-4o-mini` API.
