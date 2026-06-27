# ThrowbackGPT Visual-Fidelity Report

## Overall Verdict

**Strong, ship-ready recreation.** Average fidelity across 9 screens is **86/100**. Eight of nine screens land in the high-fidelity band (85-92), reproducing the Dec-2022 ChatGPT layout, palette, sidebar, composer, and footer faithfully. The intended ThrowbackGPT wordmark, Discord sidebar item, green spark logo, and "not affiliated with OpenAI" positioning are correct by design and excluded from scoring. The single real outlier is **capacity (62)**, which is center-aligned and under-scaled versus the strictly left-aligned, large-display reference. Every other gap is low-severity cosmetic polish.

## Per-Screen Scores

| Screen | Score | Rendered OK | Top Issue |
|---|---|---|---|
| emptystate-light | 92 | Yes | Card → arrow always shown (should be hover-only) |
| codeblock-light | 91 | Yes | Code header tint slightly light; lang label vs snippet mismatch |
| chat-dark | 91 | Yes | Regenerate button too large/prominent |
| onboarding | 90 | Yes | Extra pagination dots not in reference |
| login | 88 | Yes | Button green too bright (~#16b378 vs #10a37f) |
| conversation-light | 88 | Yes | Footer wraps to 3 lines vs single-line reference |
| emptystate-dark | 87 | Yes | Footer wording/structure diverges (medium) |
| settings | 85 | Yes | Dark square-cornered card + boxed header vs light rounded card |
| capacity | 62 | Yes | Centered layout vs strictly left-aligned reference (high) |

## Prioritized Fix List

### High severity
1. **capacity — left-align the content.** Anchor the heading, get-notified line, and poem block flush-left toward the top-left of the content column. Both references are strictly left-aligned; the centered layout is the largest single fidelity gap in the set.

### Medium severity
2. **capacity — enlarge the heading.** Bump the title to a bold display size (~36-48px) to match the reference's prominent headline.
3. **capacity — restyle the get-notified link.** Render "Get notified when we're back" as a black underlined hyperlink, not muted gray plain text.
4. **emptystate-dark — fix the footer.** Restore the canonical single centered line: underlined version-label link ("ThrowbackGPT Dec 15 Version") + "Free Research Preview. Our goal is to make AI systems more natural and safe to interact with. Your feedback will help us improve." Restore the dropped word "safe" and stop wrapping to three lines.

### Low severity
5. **login — correct button green.** Set button background to the canonical #10a37f instead of the brighter #16b378.
6. **emptystate-light — hide the card → arrow at rest.** Reveal the right-arrow only on card hover.
7. **chat-dark — shrink the Regenerate button.** Reduce padding/font-size to a compact pill (~13-14px label, thin 1px border).
8. **chat-dark — drop the Light mode active highlight.** Render the theme-toggle row as a plain hover-only menu item, not a selected pill.
9. **chat-dark — add composer placeholder.** Show a muted "Send a message..." placeholder in the empty composer.
10. **conversation-light / emptystate-dark — swap send icon.** Replace the paper-plane glyph with the thin right-chevron arrow used in Dec-2022; reduce its size on dark.
11. **conversation-light / emptystate-light — tighten footer height.** Let the primary disclaimer sit on one line (widen max-width or slightly reduce font-size); keep the nostalgia-project note as a subtle separate line.
12. **settings — soften the modal styling.** Increase border-radius (~12-16px) and remove the shaded header band so the title sits flush like the light rounded reference card.
13. **settings — mute the Clear button.** Reduce the saturated red (#ef4444) to a softer red or neutral secondary style.
14. **onboarding — reconcile pagination dots.** Remove the two dots for an exact single-card match, or keep as an intentional carousel enhancement.
15. **onboarding — use monochrome card icons.** Swap color emoji (test tube, rotating light) for muted monochrome SVGs, and soften card fills to ~#f7f7f8.
16. **codeblock-light — confirm code-block tones.** Header ~#343541/#2d2d33, body #0d0d0d; derive the language label from the fenced code language so it tracks the snippet.
17. **emptystate-light — lighten title weight.** Use the softer light-mode heading color/weight rather than near-black #202123.
18. **chat-dark / emptystate-light — minor spacing.** Tighten card row gaps; verify wordmark vertical position against reference.

*Optional / acceptable-as-is (no action required):* capacity green "Back to ThrowbackGPT" button and the missing subscriber-login card; emptystate-dark seeded sidebar conversation and "Light mode" vs "Dark mode" toggle label; conversation-light fuller sidebar and indigo user avatar; login shortened subline. These are intentional or within the loose-match guidance.

## What Is Already Faithful

The core experience is a solid recreation. Across all screens the **Dec-2022 palette is accurate** — light #f7f7f8 backgrounds and the dark #343541 main / #444654 assistant-row / #202123 sidebar tones. **Layout and element sets match**: three-column empty states with verbatim 2022 card copy, alternating user/assistant rows with avatars and action icons, centered Regenerate button, dark code blocks with header bar + Copy code, the full sidebar (New chat, conversation items, Clear conversations, theme toggle, Discord, Updates & FAQ, Settings, Log out), and the composer with send arrow. The login, onboarding, settings, and capacity flows all render cleanly with no broken or blank screens. The deliberate ThrowbackGPT identity — wordmark, green spark logo, Discord link, and independent-project disclaimer — is applied consistently and correctly throughout.

Reference artifact for the weakest screen: `/Users/arshawnarbabi/Downloads/ThrowbackGPT/verification/actual/09-capacity.png`

---

## Post-report fixes applied (re-verified visually)
- **capacity (was 62):** content left-aligned, heading enlarged to bold display size, "Get notified when we're back" restyled as a black underlined link. (HIGH + 2 MEDIUM resolved)
- **footer (emptystate-dark / conversation MEDIUM):** restructured to a single full-width line with an underlined "ThrowbackGPT Dec 15 Version" link and the restored "...natural and safe to interact with..." wording; affiliation note moved to a subtle second line.

Remaining items are all LOW-severity cosmetic polish (optional).
