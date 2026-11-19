# Spine Pair Review — Happy Engagement & Logging

Reviewed 2026-11-15. Files: `DESIGN.md` (D), `EXPERIENCE.md` (E) in this folder. Sibling: `../ux-onboarding-and-day-0/DESIGN.md` (SD), `EXPERIENCE.md` (SE). Upstream: `docs/research/engagement-and-logging.md` Part 6 (R). Line numbers are file lines.

## Overall verdict

The pair is well shaped, lean, and its tokens are complete: all 25 `{token}` references resolve and every colour has a hex. It is not yet a safe contract, because it calls itself a delta that uses the sibling "unchanged" while changing the saved card, Happi's bubble allow-list, the Low-chip branch and the Home CTA model without saying so. A builder reading both pairs gets two different answers for the same surface in at least six places, and six components named in E have no visual spec in either DESIGN file.

Counts: critical 0, high 6, medium 14, low 8.

## 1. Flow coverage — adequate

Checked: R has no named user journeys; Part 6 items and Part 7 diagrams were used as the requirement list. E has five Key Flows, each with a named protagonist, numbered steps and a climax.

### Findings
- **medium** The IA closure claim "every surface above appears in a flow below" is false (E L38). No flow covers rung 5 / Thought Reframing, the tone card, Settings, or a return after 3+ days; My Log and Practice appear only as a mention. *Fix:* add a rung-5 flow and a tone-card flow, or soften the claim.
- **medium** Failure paths exist for Flow 1 only (E L275). Flow 3 has an obvious one (Dev's text could match the inherited crisis-phrase rule, SE L237); Flow 4 has Edit / Forget; Flow 2 has declining the feeling word. *Fix:* one failure line per flow.
- **medium** Flow 1 ends rung 4 with "Nothing else happens" (E L242), but the ladder offers a step up once per completed rung (E L106) and IA puts the rung-5 entry at "Step-up after rung 4" (E L32). *Fix:* state where the rung 4 to 5 offer appears, or that it does not.
- **low** Personas reuse sibling names with different scenes (Tomas, Wednesday 11:40 pm: here no chips at night, E L268; in SE L340 he taps Not okay on the check-in). *Fix:* rename or reconcile.

## 2. Token completeness — adequate

Checked: frontmatter parsed; 25 distinct `{path.to.token}` references in D prose and component objects, all resolve to keys in this D. Inherited hex values match SD. Eight new `garden-*` colours have hex. Light mode only, as inherited.

### Findings
- **medium** `ask-button` is `canvas` on a `sage-50` card with a 1px `sage-200` border (D L82–84). Computed: fill 1.04:1, border 1.31:1. SD L319 bans a ~1.3:1 hairline as the sole edge of a control. This is the main entry point. *Fix:* border `sage-500` (4.31:1) or `ink-soft`, or a `surface-soft`-on-`canvas` treatment matching inherited chips.
- **low** Contrast line says ink-2 on sage-50 is "about 8:1 (not measured)" (D L163); computed 8.36:1. `sage-600` link on `sage-50` (recall chip) is not stated; computed 6.49:1. *Fix:* state both.
- **low** `garden-waiting` dashed ring is 1.89:1 on `sage-50`. Acceptable only if "nothing tried" also has text. *Fix:* say so in D L238.
- **low** Defined but never referenced: `colors.border`, six `garden-*` colours (prose uses only "garden-*"), `spacing.xs`, `lg`, `2xl`, `gap-card`. `garden-stem` duplicates `sage-500`. *Fix:* drop or reference by name in the Garden section.

## 3. Component coverage — thin

Checked: every component in E Component Patterns (L73–88) and every component-like noun elsewhere, against D Components and SD Components. Inherited and present in SD: tactile-button, chat bubbles, quick-reply-chip, checkin-chip, text-field, saved-card, ProgressPair, look-back card, Happi expressions (incl. Listening, Resting, Quiet pride, Gentle concern).

### Findings
- **high** Named in E with no visual spec in D or SD: **Feeling words** and **context chips** (E L77); **Trap definition** (E L80); **Belief scale** 0–10 (E L83; SD has no visual for BeliefScale either); **resume row** (E L31, L105, L122); the **"Why am I seeing this?" sheet** with Edit and Forget (E L82); the **shift line** "8 → 5" (E L131, L242); the **My Log leaf / week strip** (E L34). *Fix:* add a row each in D Components, or point to the spine that owns it.
- **high** "Inherited baseline garden with three pots" (E L134) and the Practice plots are not defined in the sibling pair or in `ux-exercise-discovery`; they exist only in app code. D L238 specifies them, so "inherited" is wrong and E has no behaviour row for the baseline state beyond one line. *Fix:* drop "inherited"; treat the garden as owned here.
- **medium** Trap chip selected state adds "a check glyph before the label" (D L204) and rung 1–2 uses "chip fill and check" (E L153, L215). SD L381 says DistortionChips have "no check badge", and `checkin-chip` selection is fill plus border only (SD L406). *Fix:* declare the check as a deliberate change to the inherited chips, or remove it.
- **medium** The hard-case "breathing button as primary" (D L231, E L169) has no stated style. D L188 keeps the tactile rim "on Save only". *Fix:* name the component used.
- **low** The Day 7 / Day 15 milestone case is in E L174 but missing from D's save-reaction table (D L226–232). "help row" (E L258) is not a sibling component name (SD has `help-pill`, `hotline-row`).

## 4. State coverage — thin

Checked: each IA surface (E L28–36) against State Patterns (E L118–136).

### Findings
- **high** Home has eight ask states (Day 0, saved today, paused, Low, Not okay, return, night, days 1–5) with no precedence between them (E L120–127). SE L395–403 has a binding first-match table that this delta neither extends nor references. Night plus paused entry, Low plus saved today, return plus night are all undefined. *Fix:* add an ordered precedence list and say where it slots into SE §13.
- **medium** "Thought already saved today: no ask card" (E L121) leaves no stated route to a second thought or to a check-in not yet done that day. *Fix:* state it.
- **medium** Thought Catcher gaps: empty field (Next disabled?), length cap, crisis phrase typed (inherited, but not pointed to), "More" expanded and selection change, recall sheet after Forget. Tone card: what "Keep it as it is" does, and when the card appears if day three is a Low day. My Log and Settings have no state rows.
- **medium** "Typing … never as the first thing on a screen" (E L143) conflicts with "No recent thoughts: no chips above the field; placeholder only" (E L128) and Flow 1 steps 2–3.

## 5. Visual reference coverage — pending

`mockups/` does not exist yet; `imports/` and `.working/` are empty. Memlog records three mocks requested (Home ask card, trap chips + stems, saved card cases). Not a defect. When they land: link each inline in D at Ask card, Trap chips / Stems and Save reaction. "Spines win on conflict" is already stated once (D L142).

## 6. Bloat & overspecification — strong

No source restatement; evidence is deferred to R (E L16). Tables used throughout. Pixel values are limited to min heights and leaf size. Invented sections (Reaction Choreography, Silence Rules, Rotation) carry decisions a builder needs.

### Findings
- **low** The effort ladder (E L90–114) sits under Component Patterns; it is a behavioural model, not a component. *Fix:* promote to its own H2.

## 7. Inheritance discipline — broken

Checked: all `sources` paths resolve. Component and expression names match the sibling. The problem is rules that contradict the sibling while D L142 and E L16 say inherited items are "unchanged".

### Findings
- **high** **Saved card is not unchanged.** Here: title "Saved." / "Saved. It's yours.", a quote of 8 words or fewer, one line, optional Breathe button, rises 8 pt in 300 ms, soft impact haptic, count-ups banned (D L224, L234; E L86, L147, L159–172). Sibling: "Saved to your journal", three rows, ProgressPair, reminder block, Go to Home; slide 24 pt in 260 ms, count ticks 0→1, `notificationAsync(Success)` (SE L151–157, L257; SD L397). SE L524 (C7) explicitly rejected "Saved. It's yours." without the ring. *Fix:* declare a post-Day-0 saved-card variant with its own spec, and say whether ProgressPair shows on it.
- **high** **Bubble allow-list.** SE L409 limits bubbles to seven moments and says "otherwise Happi idles silently"; SD L445 repeats it. This pair adds the ask line on every Home open, "Pick up where you stopped?", the Low line, "That's your first one." and "That sounds hard." (E L56–63, L122–123, L167–169). *Fix:* state that this pair amends SE §13's list, and list the additions.
- **high** **Low chip branch.** SE L415: Low opens "Want to start small?" with Catch the thought behind it / Breathe for a minute / One small thing / **I'm struggling** (opens Distressed). Here: a Happi bubble, step up to a feeling word only, then two choices (E L107, L123, L247–249). The "I'm struggling" route is gone. *Fix:* reconcile; keep or explicitly retire the escalation chip (clinician item, E L286).
- **high** **Home CTA model.** SE L407: one filled CTA per state, check-in chips as an always-present block from D1; SD L473: tactile button on the forward action. Here: two flat equal buttons, neither filled, check-in behind "Just a check-in" (D L188, L198; E L30, L75). *Fix:* say whether the ask card replaces the CTA and check-in blocks in SE §13, per variant.
- **medium** **Belief scale.** 0–10, both optional (E L83, L99) vs five tappable steps, selection required (SE L148–149); "8 → 5" vs "Before: somewhat" (SD L397).
- **medium** **Return greeting.** Bubble is "Good to see you." (E L54, L125) vs H1 carries it and the bubble is a variant or silence, never both (SE L438, L532 C15). R L369 agrees with this pair; the sibling needs the ruling.
- **medium** **Bubble length.** "12 words or fewer, one sentence" (E L42) vs "max two short sentences" (SE L106). The pair breaks its own rule: "That sounds hard. One tap is enough today." is two sentences (E L123).
- **medium** **Text field.** SD L490 bans a text field outside the opt-in personal branch; SE L143–145 specifies multiline, 280 chars, a skip link. Here a one-line field is behind Home's first button (E L78). Flagged as `[ASSUMPTION]` (E L114) but unresolved; D has no note at all. *Fix:* get the ruling and amend SD's Don't.
- **medium** **Settings naming.** "Settings: Happi's tone; Show Happi; hide weekly ring" (E L36) vs sibling Account → Preferences: **Hide progress** (hides count and ring together), Show Happi (SE L161, L193).
- **medium** Copy and rule mismatches against R Part 6:
  - Stems: "never the same three as the last entry" (E L81, L199) vs "No stem repeats in consecutive entries" (R L518). Weaker rule.
  - Hard case trigger adds "None of these, it's just hard" (E L169); R L426 lists Low day or belief did not drop only.
  - First-case card always says "You named the thought and tested it." (E L167, from R L424), which is the rung-4 line; a first entry at rung 3 should get "You caught the thought." (E L172). The rung 3 and rung 5 lines are new, not in R.
  - "No ask of any kind on a saved screen" (E L228) vs the reminder question on the first card (E L167) and the step-up row on the saved card (E L33). R L490 "Pin a fair thought as a coping card, on any saved card" is dropped without a note.
  - Gentle concern runs past 600 ms by design (R L426, L430); E L163 says idle at 600 ms with no exception. E L214 mentions "no scale" but no scale is specified (R L414–415 has it).
- **low** Recall chip drops "most recent" (E L82 vs R L390). Empty-state line gains a full stop (E L135 vs R L510). XP conflict with `ux-exercise-discovery` (its DESIGN L141, L198; EXPERIENCE L71) is logged as open item 7 but unresolved.
- **low** SD L432 gives the expression art path as `assets/images/panda/…`; E L22 says the rig is the cloud. Recorded in memlog and open item 6, not in D.

## 8. Shape fit — strong

D sections are in canonical order, all eight present. E has every required default; Inspiration is present and warranted; Responsive is correctly absent (single surface). Open Items and `[ASSUMPTION]` tags are honest and specific.

## Mechanical notes

- All five D sources and five E sources resolve on disk.
- No Mermaid. Frontmatter complete (`name`, `description`, `status`, `sources`, `updated`).
- `components.garden-plot.leafMax: 6` and `insight-empty-line.typography` are non-standard component keys; harmless.
- Copy that matches R exactly: all three ask lines and windows, night row, Low line, Day 0 card text, paused line and "Continue · about 1 min", both button labels, step-up line, "That's enough for today", both escape chips, "That's your first one.", "That's one more kept.", "Breathe · 30 s", all twelve silence rules, rotation pools.
- Six `[ASSUMPTION]` tags in E, one in D; eight open items. Open item 1 is deferred to architecture per memlog.
