# Prototype learnings (`.agents/*.html`)

Product-agnostic principles live in `.agents/skills/mobile-app-ui-design/references/mobbin-principles.md`; this file is the Happy-specific application.

Hard-won rules from building and reviewing the exercise prototypes. Phases 3, 5, 6 must not contradict them; Phase 6 specs cite them as `L#`. Mobbin evidence is in `docs/research/soul/02-teardown.md`.

## Conversation
- **L1** Exercises are a conversation, never a form: Happi asks in an `.ask` bubble, the user answers in a `.me` bubble, examples are quick-reply chips, one question per screen. Title + subtitle + boxed textarea reads as syllabus. Never strip this layer while restyling.
- **L2** Starter chips only after the user's earlier answer exists (gate on word count); example copy must not ignore what they already said.
- **L3** ≤1 Happi bubble per screen normally; no streaks, XP or loss framing.

## Reading a past entry (My Log, open state)
- **L4** Restate the user's data as a sentence, not a chart or label stack. Basis: Finch summary replays answers (46bc26b8); Calm recap shows question small, user's answer large (feb92e75).
- **L5** Intensity in words ("a lot", "somewhat"), not `7/10` bars. Basis: How We Feel (a540208a). The word cutoffs (9/7/4) are inference.
- **L6** Direction without judgement: "Distress went down, 8 to 4", "Calm went up". Never colour or icon up/down as good/bad.
- **L7** One visual idea per entry: hollow dot = before, filled dot = after, connected by a line. Reuse it in the row header and the body. The user's new view is the largest text, the original thought muted.
- **L8** Feelings and thinking-trap names go in one quiet sentence, not pills. Trap names in quotes.

## Slop tells (fail on sight)
- **L9** Grey eyebrow label above every field; left-rule blockquote; tinted callout card; pill rows for metadata; per-field bars; brand-bright colours; a card/border around everything. Fewer containers, more type hierarchy.
- **L10** Every decorative element must encode something. If removing it loses no meaning, remove it.

## Interaction
- **L11** No focus styling (bg, border, ring) on text fields in the prototypes: user rejected it three times. Keep `:focus-visible` on buttons only.
- **L12** Progress bars show stages (e.g. 4 segments), not step counts.

## Process
- **L13** After every UI change, spawn an Opus reviewer for drift, gaps, contrast, aria and orphaned CSS, then fix. Never wait for screenshots.
- **L14** No browser in the sandbox: verify with `node --check` on extracted scripts, a jsdom walk (stub `matchMedia`, inline `happi.js`/`exercise-art.js`) and computed contrast. Say layouts are unrendered.
- **L15** If Mobbin is disconnected, ground decisions in `02-teardown.md` URLs, say so, and offer to re-run once reconnected. Never claim fresh research.
- **L16** Bug classes to check first: specificity collisions (`.card svg` vs `.tick svg`), grid `1fr` min-content overflow, scroll-snap eating padding, inline `<label>` wrappers, connector-line geometry vs dot centres.
