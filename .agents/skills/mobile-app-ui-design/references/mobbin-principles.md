# Principles learned from Mobbin (product-agnostic)

Distilled from verified Mobbin screens (13-app teardown in `docs/research/soul/02-teardown.md`, plus Happy prototype reviews). Use for any app, any domain. Each rule: principle, evidence, how to apply. `inference` = our reading, not directly observed. Re-check against fresh Mobbin queries before relying on a rule for a new domain.

## 1. Show the user back to themselves
- **Restate, don't tabulate.** Past data reads as a sentence in plain words. Evidence: Stoic feed "You felt curious, comfortable, and grateful" (b802e263); Calm recap prints the user's answer on a dated card (feb92e75).
- **Their words are the biggest text.** The prompt shrinks, the answer grows. Evidence: Calm recap (feb92e75); mood entry = header + plain user text (e4921529).
- **Echo before asking again.** Next prompt carries the last answer. Evidence: How We Feel (d02f5f0b), Stoic (2b88e656).
- **Words over numbers for soft quantities.** "Somewhat", "A little" beat 7/10 and bars. Evidence: How We Feel (a540208a). Cutoffs are inference.
- **Summaries say what you did.** Completion lists the acts, not a score. Evidence: Stoic day-1 (81c9db8f).

## 2. Say what changed, not whether it was good
- State direction neutrally ("went down, 8 to 4"). Colouring up/down as good/bad is wrong whenever the metric's polarity varies. Evidence: Gentler Streak states a missed day as a neutral fact chip (597f67c9).
- A missing record is a future offer, not a gap. Evidence: Wysa-style empty chart "Start tracking … with bi-weekly check-ins" (0731479c).

## 3. Structure and density
- **One idea per screen, one question per turn.** Evidence: conversational flows in Wysa/Finch/Pi/Ahead teardown. Cuts effort for low-energy users.
- **Group history by time, not by feature.** Date groups, newest first. Evidence: activity history (e779c6a0), check-ins grouped (ef70a2d1).
- **Progressive disclosure.** Collapsed row = name, time, one-line result. Open = the story. Never show everything at rest. (inference from list patterns above.)
- **Counts over chains.** Weekly count with dots beats a consecutive-day streak. Evidence: Calm weekly count (f2dbc8b8). Let users hide any streak (Stoic 5fddacf1, Finch dc8d14c8).

## 4. Visual language
- **One visual idea per component, reused.** Pick one encoding (e.g. hollow = before, filled = after) and use it in the row and the detail. Repeated metaphors read as designed; new widgets per field read as generated.
- **Every decorative element must encode something.** Remove it and nothing is lost → delete.
- **Hierarchy from type size/weight, not containers.** Fewer cards, borders, pills, tinted callouts. One emphasised line per block.
- **Illustration carries colour; UI stays neutral.** White base, one accent, tinted washes only behind illustration. (BitePal/Duolingo benchmark.)
- **No focus decoration on text fields** when a product owner rejects it; keep `:focus-visible` on buttons.

## 5. Slop tells (fail on sight)
Grey eyebrow label above every field; left-rule blockquote; tinted callout card; pill rows for metadata; per-field bars; saturated brand colours; border/card around everything; generic hero illustration; confetti on routine actions.

## 6. Method
- Research first, decide second; cite screen URLs per decision.
- Mobbin down → use the existing teardown, say so, never claim fresh research.
- After each UI change: reviewer agent for drift, contrast (AA), aria, orphaned CSS; no-browser verification = `node --check` + jsdom walk + computed contrast, and state layouts are unrendered.
