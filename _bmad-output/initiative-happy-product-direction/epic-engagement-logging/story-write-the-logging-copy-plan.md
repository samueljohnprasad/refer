---
title: 'Write the logging copy'
type: 'feature'
ticket: '2'
created: '2026-11-15'
status: 'built'
baseline_revision: '4edcd5ebce422cef296a278aef82c6441de63cef'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: ['_bmad-output/initiative-happy-product-direction/architecture-engagement-logging/architecture-engagement-logging.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The epic's later stories need copy the app does not have: the thought-catcher and Home domains hardcode English, and much of the spine's wording (trap definitions, five stems, examples, extra ask lines, the Plain table) is written nowhere.

**Approach:** Add every English key the epic uses to the `exercises` and `home` namespaces, with `_plain` siblings for tone, so later stories add no keys. Wording comes from the UX spine verbatim where written; unwritten wording is drafted and marked for a person to sign off.

## Boundaries & Constraints

**Always:** Keys live in `src/locales/en/exercises.json` or `home.json` only (AD-23). A Plain variant is the sibling key `<key>_plain`, consumed later as `t(key, { context: 'plain' })`; a line Plain drops gets no `_plain` key (the domain rule decides). Voice rules from the spine: Happi lines 12 words or fewer, one sentence, no "I" about its feelings, no emoji. Reuse existing keys (`moods.*`, `log.openEntry`); never duplicate them. Where the spine and a mockup disagree, the spine wins (why-sheet action is "Open entry", not "Edit").

**Never:** No component, container or hook change; no `t()` wiring (stories 3 onward consume the keys). No other namespace. No keys for parked items (Low-day follow-up row, monthly ask-line swap beyond the pool).

**Decisions (human, 2026-11-15):** The agent drafts all unwritten wording in the spine's voice; a person signs it off before release. English only: non-English locales are not touched (runtime falls back to `en`), and the keys use i18next namespaces and the `plain` context. Built on `main` as is; no commit.

</frozen-after-approval>

## Code Map

- `src/locales/en/exercises.json` (605 lines) -- top keys: title, subtitle, runtime, tab, library, categories, log, milestone, cbt, feedback, copingCards, flow. Thought-catcher, trap, stem, saved-card and why-sheet keys go here.
- `src/locales/en/home.json` (85 lines) -- top keys include greeting, moods, prompts. Ask lines, button labels, tone card and Account row go here.
- `src/locales/en/exercises.json` `log.openEntry`, `home.json` `moods.*` -- already exist; do not duplicate.
- `src/lib/i18n/index.ts:223,250` -- `fallbackLng: 'en'`, partial bundles; a missing key renders English.
- `scripts/validate-localization.mjs:111-140` -- key parity across seven locales; not wired in CI.
- `_bmad-output/.../ux-engagement-logging/EXPERIENCE.md:46-220`, `mockups/key-trap-chips-and-stems.html`, `mockups/key-saved-card-cases.html` -- the copy source.
- `src/domains/thoughtCatcher/**`, `src/domains/home/**` -- hardcoded English today; do not touch.

## Tasks & Acceptance

**Execution:**
- [ ] `src/locales/en/home.json` -- ask lines (3 windows, pool of 4 per window), Home button labels with time cost and their a11y labels, M-modifier labels ("Catch another one"), tone card (rows, link, sample lines), Account tone row, look-back line, each with `_plain` where Plain differs
- [ ] `src/locales/en/exercises.json` -- trap prompt and escapes, trap names and one-sentence definitions, "More"/"Not sure"/"None of these, it's just hard", step-up row, eight stems, four examples per question, recall chip, why sheet (title, body, "Open entry", "Forget this"), saved-card lines ("You caught the thought.", "That sounds hard.", "Breathe for a minute", "Go to Home", "Saved to your journal"), unsynced line, "Not tried yet", a11y labels ("selected", "logged"), each with `_plain` where Plain differs

**Acceptance Criteria:**
- Given the spine's Voice and Tone, Component Patterns, Saved card variants, Rotation and Accessibility Floor sections, when each named string is looked up, then it resolves to English text in the exercises or home namespace.
- Given both JSON files, when parsed, then they are valid and no key duplicates an existing one.
- Given any Happi line, when counted, then it is 12 words or fewer.
- Given drafted (not spine-written) wording, when released, then a person has signed it off.

## Implementation Notes

Keys added only: `home.json` gains `ask`, `cta`, `lookBack`, `tone`; `exercises.json` gains `thoughtCatcher`. No `t()` wiring.

**Spine-written (verbatim):** ask line 1 per window, button labels, "That sounds hard.", "You caught the thought.", unsynced line, "Not tried yet", Mind reading definition, three stems, step-up row, "Keep it as it is".

**Drafted, needs human sign-off:** ask lines 2-4 per window, five extra stems, all examples, trap definitions except Mind reading, trap names beyond the three in the mockup (US spelling, matching the app), tone-card body and sample lines, why-sheet body and caption, and every `_plain` variant.

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens): 0 high, 2 medium patched, 2 low (1 patched, 1 rejected), 2 false.

| Finding | Verdict | Route | Evidence |
|---|---|---|---|
| `log.spaceTitle/spaceBody/explore` rewritten | false | rejected | Pre-baseline edit from the earlier Exercises-tab port; shows in the diff only because baseline `4edcd5eb` predates it. Story added only `thoughtCatcher`, `ask`, `cta`, `lookBack`, `tone`. |
| `tab.doneCount`, `tab.support`, `log.today/yesterday/rungsLabel/...` out of plan | false | rejected | Same: earlier port, not this story. |
| British trap names vs US locale | low | patch | Keys and existing strings are US; names changed to Catastrophizing, Overgeneralizing, Personalizing, Labeling. |
| `tone.gentleSample` two sentences | medium | patch | Happi line rule is one sentence; now "That sounds hard, and there's no rush." |
| No key for the tone-card link | medium | patch | Added `tone.keep` = "Keep it as it is". |
| No marker for drafted wording | medium | patch | JSON holds no comments; spine-written vs drafted keys now listed in Implementation Notes. |
| Duplicate strings (`recall.why`/`sheetTitle`, two "selected") | low | rejected | Splits serve different consumers (sheet title vs chip link; trap chip vs tone row); merging forces a decision on stories 3-6. |

## Verification

**Commands:**
- `node -e "JSON.parse(require('fs').readFileSync('src/locales/en/exercises.json'));JSON.parse(require('fs').readFileSync('src/locales/en/home.json'))"` -- expected: no output
- `node scripts/validate-localization.mjs` -- expected: reports only keys added by this story, only the new keys missing from the seven other locales (expected, deferred)

**Manual checks:**
- A person reads the drafted wording and signs it off.
