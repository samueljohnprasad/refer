# ABC Analysis soul spec: `.agents/abc-analysis.html` redesign

Pass: 2
Mode: per-screen spec. Phases 1–6 are PASS in `00-status.md` and were not redone. This is research and spec only: no app code and no `.agents/*.html` file was edited. Intended path: `docs/research/soul/_work/abc-analysis-soul-spec.md`. The shared-checkout guard blocked that write, so this file lives at `/private/tmp/claude/abc-soul/abc-analysis-soul-spec.md`.
Inputs: `.agents/abc-analysis.html` (471 lines, read in full), `.agents/thought-reframing.html` (742 lines, read in full; "TR" below), `.agents/onboarding.html` (crisis regex :515, sheet CSS :199–207, sheet markup :235, `SHEETS.help` :679, `openSheet`/`closeSheet` :687–694, `#sos` :230/:513), `.agents/happi.js` (POSES :69–81, reduced motion :115/:283), `.agents/exercise-art.js` (`ART.abc_analysis` :70–77, global export :198), `.agents/happy-ui.css`, `AGENTS.md` §UI Direction and coding style, `03-character.md` (Summary, F5–F7, F12, F13, Expression set, Presence rules, Voice, Struggle and absence), `04-connection-systems.md` (F1, F5, F9, F16 via 06), `05-tokens.md` (Happi bubble row, motion notes), `06-implementation-spec.md` (F6, F7, Exercise flow runner, Thought Catcher, Reframe, ABC Analysis, Completion, Crisis path + phrase matching), `references/prototype-learnings.md` L1–L16, `mobile-app-ui-design/references/mobbin-principles.md`, `_work/onboarding-soul-audit.md` (precedent), all four checklists.
Rendering: not rendered (L14). Layout claims are read from code. Contrast was computed with the WCAG formula in `$TMPDIR/abc/c.py`. The crisis regex was tested in `$TMPDIR/abc/r.py`.

**Mobbin note (L15).** The Mobbin MCP was available in this run. I ran 7 searches and viewed 9 screens, listed as [S1]–[S9]. None of the 9 caller-supplied URLs came back in those searches, so I did not view them. They are listed at the end of Sources without an `[S#]` and none of them counts as evidence. Where a caller URL and a viewed screen show the same pattern, the viewed screen carries the claim. For example, the fill-in-the-blank evidence is Ahead [S1], not ABY.

## Summary
1. **Signature: the sentence with a gap in the middle.** Every step after A restates the user's answers as one sentence in their own `.me` bubble: "When [A], I thought [B], and felt [C]." The B gap stays an empty dashed slot through both C steps. It fills live while the user types the thought, the test step checks it, and the summary rewrites it as "When [A], I could think “[B′]”." (F1, F10).
2. **Four stages in the bar:** Event (A) · Feeling (C, strength) · Thought (B) · Rethink (test, fairer, re-rate). Intro and summary sit outside the bar (L12).
3. **Happi asks, the app instructs.** Happi uses the `abc` pose with the lens on every step. The bubble holds one question: one sentence, ≤12 words, ≤60 characters. Any instruction is one app-voice `.sub` line under the bubble, and only where it prevents an error. Happi steps aside while the keyboard is open, after a crisis match, and when "Show Happi" is off. Happi has no non-question lines in the flow (F10, P3-F13).
4. **Crisis path on every step.** A constant "Get help" button sits in the header. The onboarding `CRISIS` regex runs on a 1500 ms pause and on Continue for A, B and the fairer thought. The plain sheet has no Happi and no motion. Happi stays gone for the session (F6, P6 Crisis path).
5. **Honest ending.** The verdict compares the two strength ratings in words, never as a score. The keepsake shows the user's fairer thought large. The record sits folded in `details`. Happi uses `proud` only when the feeling went down or stayed the same (F4, F5).
6. **Delete:** cloud avatar, % bar, bordered rim chips, slot tray, Yes/No cards and dots, eyebrowed A/B/C chain, "Or tap one to use it", 9rem numerals, tags, scoreboard, the "x of 3 checks" score, and the field focus styles (L5, L6, L9, L10, L11, L12).

## Inventory
| Step id | Current (abc-analysis.html) | Spec section |
|---|---|---|
| intro | :379–382 | Screen: Intro |
| a | :383–384 `textStep('a')` | Screen: A · What happened |
| feel | :386–399 | Screen: C · Feelings |
| c | :400 `gaugeStep('c')` | Screen: C · Strength |
| b | :402–406 `textStep('b')` | Screen: B · The thought |
| test | :408–420 | Screen: Test the thought |
| alt | :421–423 `textStep('alt')` | Screen: Fairer thought |
| c2 | :425 `gaugeStep('c2')` | Screen: Re-rate |
| summary | :427–445 | Screen: Summary |
| (none) | no crisis surface | Screen: Crisis sheet |

Out of scope: the React Native `abcAnalysis/config.ts` (P6 § ABC Analysis covers it), and the missing crisis path in `thought-reframing.html` itself (0 matches for `CRISIS`/`Get help`/`988`). That gap is reported under Self-critique.

## Findings

### F1. A fill-in-the-blank sentence shows the A→B→C link as grammar, not as boxes
- Claim: Ahead teaches by placing a word chip into a slot inside a running sentence ("…which we often only later [decide] fully."), and that pattern carries ABC's causal link in one line without containers.
- Evidence: https://mobbin.com/screens/12f765b4-92c9-468d-b628-a36845862ace [S1]; counter-pattern [S9] (Bloom shows one concept as a bordered card joined by a dotted connector to a second bordered card); REBT holds that B, not A, drives the disturbed C [S10].
- Mechanism: A sentence frame states the order and the dependency ("When…, I thought…, and felt…") in a reading pattern users already know. An empty slot in the middle shows that something is missing before the user names it, which is the core ABC insight [S10]. The current eyebrowed chain (`:259–274`) and Bloom's card+connector [S9] need labels and lines to say what grammar says for free.
- So what for Happy: A new `line()` helper renders the sentence inside the user's `.me` bubble on steps feel, c, b, test, alt and c2 and in the summary keepsake. Empty gaps are dashed slots that show their letter. The `.chain`, `.l`, `.chain small` CSS and `miniChain()` are deleted.

### F2. In the ABC model, C includes behaviour, and the prototype measures only feeling
- Claim: Both REBT sources describe C as "emotional and behavioral" consequences, while this prototype asks only for feelings and their strength.
- Evidence: [S10] ("disturbed and dysfunctional emotional and behavioral Cs"), [S11] ("unhealthy emotional\behavioral reaction to Adversity").
- Mechanism: The re-rate compares feeling strength before and after, so the prototype's C has to be the feeling. Copy that defined C as only a feeling would be inaccurate (AP7.1).
- So what for Happy: No string says that C is just a feeling. The sentence reads "and felt [C]", which is true of the part we measure. The RN build keeps its C-behaviour step (P6 § ABC order). This is logged in Contradictions.

### F3. The three checks are two REBT disputes plus a double-standard question
- Claim: REBT disputes ask "Is it helpful?" (pragmatic), "Is it true?" (empirical) and "Is it sensible?" (logical). The prototype's "fact or guess" and "does believing it help" cover the first two, and its "friend" question is a double-standard check, not a logical dispute.
- Evidence: [S11] (quote re-opened in the spot-check).
- Mechanism: An accurate name for each check keeps the copy from overclaiming. "Not sure" is an honest third answer, and onboarding already uses it (`CHECK` Yes/Not sure/No). Restating the answers as a sentence avoids grading.
- So what for Happy: Keep all three questions, each with 3 answers. Copy and code never call the set "the three REBT disputes". Delete the shaky score `shaky()` (:328) and "x of 3 checks" (:441). The answers come back as one sentence (`sofar()`).

### F4. A rating reads as a sentence in words, with the scale ends in words
- Claim: stoic shows a sleep rating as "Last night / I slept quite well." above a slider with the ends "Not at all" and "Very", and no numeral.
- Evidence: https://mobbin.com/screens/ff6c11c1-3550-4c9e-b943-2d585d20522e [S3].
- Mechanism: A word maps onto how the feeling is felt. A 9rem numeral (`:149`) invites precision the user doesn't have and reads as a score (L5).
- So what for Happy: Strength words are `STRENGTH = v => v===0?'None':v<=3?'Mild':v<=6?'Medium':v<=9?'Strong':'Very strong'`. The readout shows the word only. The numeral survives only in `aria-valuetext` ("7 out of 10, Strong"). The scale ends read "None" / "Very strong". The cutoffs are inference and mirror TR's `WORD` (L5).

### F5. Completion screens that score the session or shrink the user's answer drop the person
- Claim: stoic's journal completion shows "Good job!" over WORDS 79 / TIME 00:46 stat tiles, and How We Feel's summary prints the user's answer in small grey text under the app's question and the AI's paragraph.
- Evidence: https://mobbin.com/screens/f872477c-61a4-42cd-93bf-9e85af0e0814 [S4]; https://mobbin.com/screens/5fe87449-b301-4232-87c1-e169bf1dae7a [S7].
- Mechanism: Stats grade the effort, and a small answer under large app text says the app's words matter more. Both oppose "their words are the biggest text" (mobbin-principles §1, L7).
- So what for Happy: The summary keepsake prints the fairer thought at the screen's one Fredoka size. The lead "When [A], I could think" is 15 px. The scoreboard `.shift` (:211–216, :442) and the tag pills (:209, :438) are deleted.

### F6. Mental-health apps keep the crisis entry fixed and visible while the user writes
- Claim: How We Feel prints "If you are in crisis, get professional support here" under the Finish / Go deeper buttons with the keyboard open, and Wysa keeps "Talk to a Counsellor" and "SOS" as header buttons.
- Evidence: https://mobbin.com/screens/d8e58142-43ac-49d4-a363-46cfe3428046 [S2]; https://mobbin.com/screens/0804ae99-d713-466d-93b5-719ca47b34e2 [S5]; https://mobbin.com/screens/1feb4801-a9b3-4a95-b5d7-bc095ac9b8f6 [S6].
- Mechanism: An entry that stays in one place is found once and stays findable. That covers false negatives of the phrase match (P6-F7).
- So what for Happy: A "Get help" header button appears on every step. It does not move with the per-step composer, because ABC's composer changes form on every screen. That is the decision taken in Contradictions.

### F7. A placeholder cannot carry the "camera" rule
- Claim: NN/g reports that disappearing placeholder text strains short-term memory, and that default grey placeholders have poor contrast.
- Evidence: [S12] (re-opened in the spot-check).
- Mechanism: The A rule ("only what a camera could have seen or heard") matters most while the user is typing, which is exactly when a placeholder vanishes.
- So what for Happy: The rule is the A step's app `.sub` line, taken verbatim from P6. The placeholder carries an example opener ("This morning, my manager…"). Placeholder colour is TR's `#6b6b6b`, computed at 4.97:1 on `#f7f7f7`, 4.54:1 on `#f6ecd8` and 5.12:1 on `#fffaf0`.

### F8. Live restatements must be status messages, not focus moves
- Claim: WCAG 4.1.3 asks that content changes not given focus be announced "in a way that doesn't unnecessarily interrupt their work".
- Evidence: [S13].
- Mechanism: The so-far line on the test step and the comparison note on the re-rate change while focus stays on a control. `aria-live="polite"` announces them without stealing focus. The live-filled sentence must not announce on every keystroke.
- So what for Happy: `#sofar` and `#cmp` get `aria-live="polite"`. `#line` has no live region; it is read when the user reaches it.

### F9. Intro copy makes no efficacy claim
- Claim: Bloom's onboarding headline reads "The most effective form of therapy" for CBT.
- Evidence: https://mobbin.com/screens/fd5721f9-dec3-4332-839f-6b4186ed23f8 [S8].
- Mechanism: Telling an anxious user "this works" sets an expectation that a "same" or "stronger" result then breaks. That is AE1.7 at the screen where trust is set.
- So what for Happy: The intro states only duration and privacy: "ABC Analysis · 7 to 10 min · private to you".

### F10. A character beside each question keeps the exercise a conversation, and the cap has to count lines, not asks
- Claim: Wysa's chat puts the penguin avatar beside each group of its bubbles and echoes the user's words ("'Caring, kind and helpful'."). That supports L1's Happi-asks pattern, while P3 caps Happi at ≤3 bubbles per session.
- Evidence: https://mobbin.com/screens/0804ae99-d713-466d-93b5-719ca47b34e2 [S5]; inference: P3 set the cap to stop a character from taking the turn away (AP3.1, P3-F13), and a one-sentence question hands the turn to the user, so it does not cause the harm the cap exists for.
- Mechanism: The face beside the question makes each step a turn in a conversation (L1). Keeping the bubble to one question and moving instruction into app copy keeps Happi from teaching or grading (AP3.3, ED2.1).
- So what for Happy: Each step has ≤1 bubble, and the bubble is one question sentence of ≤12 words and ≤60 characters. Happi says 0 non-question lines in ABC. The 3-per-session cap applies to non-question lines, so ABC uses 0 of 3. This is logged in Contradictions as a P3 amendment to confirm.

## Signature (deliverable 1)
**The sentence with a gap in the middle.** One component, `line()`, renders inside the user's own `.me` bubble (ink `#5F7F58` fill, white text, 4.50:1):

```js
const lc = s => /^(My|A|An|The|We|They|He|She|It|Our|Someone|This|That|Today|Yesterday|At|In|On|After|Before|During)\b/.test(s) ? s[0].toLowerCase() + s.slice(1) : s; // ponytail: keeps names capitalised, misses rare openers
const gap = (t, k) => t ? `<span class="gap" data-k="${k}">${esc(t)}</span>` : `<span class="gap empty" data-k="${k}"><span aria-hidden="true">${k}</span><span class="vh">not written yet</span></span>`;
const line = (b, verb = 'thought', withC = true) => `<div class="me"><p class="line" id="line">When ${gap(lc(R.a.trim().replace(/[.!]+$/, '')), 'A')}, I ${verb} ${b.trim() ? `“${gap(b.trim(), 'B')}”` : gap('', 'B')}${withC ? `, and felt ${gap(feelText(), 'C')}` : ''}.</p></div>`;
```
CSS: `.line{font-weight:500;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}` (the clamp is visual only, so screen readers get the full text). `.gap{font-weight:700}`. `.gap.empty{display:inline-block;min-width:3.5em;text-align:center;border-bottom:2px dashed currentColor;font-size:var(--t-foot)}` (white on ink = 4.50:1, above the 3:1 non-text minimum). `.vh` is the standard visually-hidden rule. `feelText()` returns lower-case "anxious and sad" / "anxious, sad and lonely".

Where it recurs:
| Step | Sentence shown | What changes |
|---|---|---|
| intro | `.line.map` on white, not in a bubble: "When [A], I thought [B], and felt [C]." | All three gaps are empty and show their letters. Gaps are `#767676` dashes (4.54:1) |
| a | none | The viewfinder is the picture, and the A text is not echoed while it is being typed |
| feel | `line('', 'thought')` | The C gap fills live with each tap. The B gap stays empty |
| c | `line('', 'thought')` | Unchanged. The empty B is the open question going into the next stage |
| b | `line(R.b)` | The B gap fills live from the `.tb` textarea (adapted from current `liveB` :360) |
| test | `line(R.b)` | Static. Happi's lens points at it |
| alt | `line(R.b, 'thought', false)` | The old sentence without C, to rewrite against |
| c2 | `line(R.alt, 'could think', false)` | The new sentence, rated right after it is read |
| summary | keepsake: lead "When [A], I could think" 15 px + `.rf` “[B′]” in Fredoka 28 px | The user's new words are the largest text (L7) |

## Stages (deliverable 2)
`const STAGES = ['Event', 'Feeling', 'Thought', 'Rethink'];` TR's 4-span `.bar` markup and `show()` fill logic are reused verbatim (TR :284, :321–323).

| Step | stage | aria-valuetext |
|---|---|---|
| intro | none (`noProgress`) | "Not started" |
| a | 0 | "Event, part 1 of 4" |
| feel, c | 1 | "Feeling, part 2 of 4" |
| b | 2 | "Thought, part 3 of 4" |
| test, alt, c2 | 3 | "Rethink, part 4 of 4" |
| summary | none | "Done" |

## Shared shell (applies to every screen below)
- **Reused from TR as-is:** `#app` frame and `@media (min-width:600px)` (:33–37), header/`.icon-btn`/`.bar` (:46–51), `main` + `@keyframes enter` (:54–56), footer/`.btn`/`.btn.ghost` (:70–76), `.me` (:65–67), `.ask`/`.ask .happi`/`.say` (:93–99), `.qrs`/`.qr` (:80–84), `.tick` (:85–87), `.note` (:62), `#toast` absolute (:274–276), `show()`/`restart()`/toast/back/close engine (:315–338), `focusField()`, `words()`, `own()`, `esc()`, `buzz()`, `IC` icons, and `bindText()` (:106–114, called with `ok` empty, so it never shows a "good" message).
- **Changed from TR:** `head(q, sub)` replaces TR `head(stage,title,sub)`:
  ```js
  const happiOn = () => !crisis && localStorage.getItem('happi') !== 'off';
  const head = (q, sub = '', pose = 'abc') => `<div class="ask${happiOn() ? '' : ' solo'}">${happiOn() ? `<div class="happi" data-pose="${pose}"></div>` : ''}<div class="say"><h1>${q}</h1></div></div>${sub ? `<p class="sub">${sub}</p>` : ''}`;
  ```
  CSS: `.ask.solo .say::before{display:none}`, `.ask+.sub{margin:calc(-1*var(--sp-3)) 0 var(--sp-4)}`, `.sub{font-weight:500}`. `quick(items, attr)` drops its label argument and `.qrl`.
- **Keyboard-open aside (P3-F7, zone 1):** on `focusin` of a `textarea` when `matchMedia('(pointer: coarse)').matches`, add `.typing` to `#main`; remove it on `focusout`. CSS: `.typing .ask .happi{opacity:0;transform:scale(.96);transition:opacity .2s ease-in,transform .2s ease-in}` with a 250 ms ease-out return. The figure keeps its box so the question does not jump.
- **Type and weight (AGENTS):** only weights 700/600/500. TR's 800s become 700 (`.btn`, `.read em`, `.ans summary`, `.emo`→600). The Google Fonts `<link>` (:8) is deleted because `happy-ui.css` imports Nunito and Fredoka. Fredoka appears once per screen: the bubble `h1` on steps, and the keepsake `.rf` on the summary, where `.verdict h1{font-family:var(--font);font-weight:700}`.
- **Fields (L11):** delete `textarea:focus,input:focus` (:89), `.row:focus-within` (:93) and `textarea.paper:focus` (:120). TR's `.vf`/`.tb`/`.frame` textareas already have no focus styling.
- **Scripts:** `<script src="happi.js"></script><script src="exercise-art.js"></script>` before the inline script. The face drawer copied from TR's `ART` IIFE (TR :338 onward, `face`/`FEAT`/`E`/`drop`/`ln`/`mix`/`f1`/`C`) is renamed `FACES` so it does not shadow `window.ART` from exercise-art.js. The intro calls `window.ART.abc_analysis()`.
- **Crisis plumbing:** `let crisis = false` at module level, never reset by `restart()` (zone 2: the rest of the session). `R.helpShown` is reset per run (one auto-open per entry, P6).

## Screen: Intro
| Dimension | Current (abc-analysis.html) → delete, why | Change (decided) | Driven by |
|---|---|---|---|
| Layout | `.sky.lead` cloud hero + `.bub` with a 31-word paragraph (:380–381) | `p.meta` → `.scene` (`window.ART.abc_analysis()`, 160×120, `background:var(--hue-abc)`, `border-radius:var(--r-l)`) → `head(q, '', 'abc')` → `.line.map` empty sentence. TR's `.path` stage list is not used | P3-F5, L10, T:enter |
| Type | h1 800 (:61) | Bubble h1 Fredoka 600 24 px. `.line.map` 20 px 500 `#4B4B4B` (8.72:1). Meta 13 px 600 | T:h2 |
| Color | cloud `--cloud-hi` | Scene wash `#E2EEF8` (no text on it). Gaps `#767676` dashes on white, 4.54:1 | T:selection.border |
| Spacing | `.intro .bub` margins | Scene → ask 16 px. Ask → line 8 px | T:enter |
| Illustration / mascot | `SKY(.55,'lead')` cloud with face (L1 second character; P3-F10 one character) | Happi `abc` pose (lens). Bubble "Did something upset you today?" | P3-F13, L1 |
| Motion | `bob`/`spin`/`twinkle` idle loops on the cloud (:175–182) | Happi pose entry 1250 ms (happi.js `hold`), then idle. No other loops (AP5.2) | T:enter |
| Haptics | none | none | P4-F9 |
| Copy (exact strings) | "Something stung today?" + "It is rarely the event…" (:381) | Meta "ABC Analysis · 7 to 10 min · private to you". Bubble "Did something upset you today?" (5 words, 30 chars). Map "When A, I thought B, and felt C." Button "Begin". Header "Get help" | P3-F13, P6-F6 |
| Accessibility | cloud `aria-hidden` ok | Scene `aria-hidden` (exercise-art `svg()` with no label). Map gaps read "not written yet". Focus lands on h1 (TR `show()`). The scope lives on Home/onboarding | T:touch-min |
| Ethics guard | none | No efficacy claim (F9). "Get help" in the header | P4-F16 |

## Screen: A · What happened
| Dimension | Current (abc-analysis.html) → delete, why | Change (decided) | Driven by |
|---|---|---|---|
| Layout | `ask()` + `textarea.paper` + `#status` + `.qrl` + `.qrs` scroller (:343–354, :383) | `head()` → `.sub` → TR `label.vf` viewfinder textarea → `#status` → `.qrs` wrap pills (no label). Chips hide once the field has text (TR `bindText`) | L1, P1-F17 |
| Type | textarea 20 px 700 | `.vf textarea` 24 px 700 (TR :113) | T:body |
| Color | focus ring `--ink`/`--tint` (:89) deleted (L11) | `.vf` `#F7F7F7`; placeholder `#6b6b6b` 4.97:1 | T:selection.border |
| Spacing | n/a | TR `.vf` padding 16/16/12 | T:space-4 |
| Illustration / mascot | cloud avatar (:323) deleted | Happi `abc`. Steps aside while the keyboard is open (coarse pointer) | P3-F7 |
| Motion | `nod()` on chip tap (:326) deleted (bounce, spring) | Step enter 280 ms (`enter`). The aside is 200 ms ease-in out, 250 ms ease-out back | T:enter |
| Haptics | `buzz()` on chip | `buzz()` 8 ms on chip tap only | P4-F9 |
| Copy (exact strings) | "Just the facts, like a camera would have seen it." / okText "Good. That stays with what happened." (grades the writing, ED2.1) / "Or tap one to use it" (L9, AGENTS) | Bubble "What happened?" (2 words). Sub "Write what a camera could have seen or heard." (P6 verbatim). Placeholder "This morning, my manager…". Chips "My manager hasn’t replied to my email since this morning" · "A friend cancelled our plans an hour before". Hint while under 2 words "A few words is enough to start." (empty once valid). Button "Continue" | P6-F6, P1-F17 |
| Accessibility | `aria-label` = title | `aria-label="What happened"`. `#status` `aria-live="polite"`. Chips ≥44 px (`.qr min-height:var(--tap)`). `focusField` does not open the keyboard on touch | T:touch-min |
| Ethics guard | none | `CRISIS` check on a 1500 ms typing pause and on Continue (see Crisis sheet) | P6-F7 |

## Screen: C · Feelings
| Dimension | Current (abc-analysis.html) → delete, why | Change (decided) | Driven by |
|---|---|---|---|
| Layout | `said('What happened')` + `.tray` slots + `#cnt` + bordered `.chip` grid (:386–399, :226–246) | `line('', 'thought')` → `head()` → `.sub` → TR `.emos` 2-col grid of `.emo` with `FACES.face(name,on)` and `.tick` (TR step 5 bind, verbatim). `.tray` and `#cnt` are deleted (L10: they repeat the ring and the live C gap). Under the grid, when "Hopeless" is on: `button.link#help2` "Get help now" | L9, L10, P2-F7 |
| Type | chip 700 | `.emo` label 17 px 600 | T:chip |
| Color | `.chip` 2 px border + rim box-shadow + `::after` hollow circle (:227–235; L9 card around everything, AGENTS no rims) | Rest `#F7F7F7`; selected `--warm #EEF3EA` + inset 2 px ink ring (4.00:1 non-text) + `.tick` `#29452A` | T:selection.border |
| Spacing | 12 px gap | 12 px gap, 112 px min tile (TR) | T:space-3 |
| Illustration / mascot | cloud avatar | Happi `abc`. Faces are the step's picture | P3-F5 |
| Motion | `.slot.new` drop with spring (:245) | `.emo.just svg` pop 350 ms on `var(--ease)`, not `--spring` (P5 rejected overshoot) | T:press |
| Haptics | `buzz()` | `buzz()` per toggle | P4-F9 |
| Copy (exact strings) | "And how did that make you feel?" / "Pick up to 3. Tap again to take one back." / "Nothing picked yet" | Bubble "What did you feel?" (4 words). Sub "Pick up to 3." Toast on a 4th tap "Up to 3. Tap one to swap it out." Link "Get help now". Labels: the 10 TR `EMOTIONS` | P2-F7, P4-F1 |
| Accessibility | `aria-pressed` ok | `aria-pressed`; focus stays on the tapped tile (TR). `#line` C gap updates without a live region (F8) | T:touch-min |
| Ethics guard | none | "Hopeless" shows the inline help link (P6 § Reframe guard) without blocking | P4-F16 |

## Screen: C · Strength
| Dimension | Current (abc-analysis.html) → delete, why | Change (decided) | Driven by |
|---|---|---|---|
| Layout | `.gauge` + `.big` 9rem numeral + `/10` + `.lbls` 3 labels (:363–376, :147–162) | TR `sliderStep` structure: `.fill` → `line('', 'thought')` → `head()` → `.mid` `SKY(null,'live')` → `.ctl` `.read` (word only) → `.scale` `.segs` + range → `.lbls` 2 ends. Seed `R.c = 5` | L5, P2-F7 |
| Type | numeral 9rem display (:149) deleted (L5) | `.read b` = word, Nunito 700 28 px (the bubble keeps the screen's one Fredoka line). `.read span`/`em` deleted | T:body |
| Color | `.segs i` 2 px borders | TR `.segs` fills; filled `#5F7F58` + rim | T:selection.border |
| Spacing | n/a | `.ctl` `margin-top:auto` (TR) | T:space-4 |
| Illustration / mascot | `ask(...,0)` cloud-free bubble | Happi `abc`. The sky is the picture: the strength in weather (shared with TR). It stays uncapped (Contradictions) | P3-F6 |
| Motion | sky follows `--heat-f` live | Same. Sun/cloud transitions 280 ms. Rain loop `fall` 1.2 s per drop, 0.4 s stagger (<3 Hz) | T:enter |
| Haptics | none | none (drag) | P4-F9 |
| Copy (exact strings) | "How strong is it right now?" / "Barely · Strong · Overwhelming" | Bubble "How strong is it right now?" (6 words, 27 chars). Readout `STRENGTH(v)`. Ends "None" · "Very strong". Button "Continue" | P3-F13 |
| Accessibility | range has no valuetext | `aria-valuetext="7 out of 10, Strong"` updated on input. `.read` is `aria-hidden` (TR) | T:touch-min |
| Ethics guard | none | No good/bad colour at any value (L6) | P1-F6 |

## Screen: B · The thought
| Dimension | Current (abc-analysis.html) → delete, why | Change (decided) | Driven by |
|---|---|---|---|
| Layout | `miniChain()` with eyebrows "Event/Your thought/Feeling" + dashed `B` node (:357–361; L9) + `textarea.paper` | `line(R.b)` with live B gap → `head()` → `.sub` → TR `.tb` thought-bubble textarea (TR `.snap` and `.trail` dropped: the sentence already restates A, L10) → `#status` → `.qrs` | L1, L4, L9, P2-F7 |
| Type | 20 px 700 | `.tb textarea` 20 px 700 (TR) | T:body |
| Color | n/a | `.tb` `#F6ECD8` with inset rim; placeholder 4.54:1 | T:selection.border |
| Spacing | n/a | TR `.tb` padding 24/24/16 | T:space-4 |
| Illustration / mascot | cloud avatar | Happi `abc`; steps aside while the keyboard is open | P3-F7 |
| Motion | none | Gap text swaps per keystroke with no transition | T:enter |
| Haptics | chip `buzz()` | same | P4-F9 |
| Copy (exact strings) | "What went through your mind just then?" / "Say it the way it showed up, even if it sounds harsh or unfair." / okText "Keep it exactly as it showed up." | Bubble "What went through your mind just then?" (7 words, 38 chars). Sub "Do not make it fair yet. Just catch it." (P6 verbatim). Placeholder: scene ? `“They’re annoyed with me.”` / `“They don’t really want to see me.”` : `“They think I…”`. Chips: if A came from a scene chip, that scene's 2 thoughts ("They’re annoyed with me." · "I always get this wrong." / "They don’t really want to see me." · "I’m not a priority to anyone."); if the user typed A, starters "They think I " · "I always " · "What if " · "I should " (added to `own()`'s strip list, so a tapped starter alone does not count as words). Hint "A few words is enough." | L2, P6-F6 |
| Accessibility | n/a | `aria-label="What went through your mind"` | T:touch-min |
| Ethics guard | none | `CRISIS` check (pause + Continue). On a match, Happi unmounts and the sheet opens; the text stays | P6-F7 |

## Screen: Test the thought
| Dimension | Current (abc-analysis.html) → delete, why | Change (decided) | Driven by |
|---|---|---|---|
| Layout | `said()` + `.two` 120 px bordered Yes/No cards + `.dots` (:408–420, :249–258; L9 boxes, L12 count dots) | `line(R.b)` → `head(TESTS[qi].q, qi?'':validation)` → `.qrs` with 3 `.qr` answer pills (`aria-pressed`) → `p.note#sofar`. One bubble whose text swaps per check. Back goes to the previous check when `qi>0`, otherwise to the previous step | L1, L12, P2-F7 |
| Type | 20 px 700 | `.qr` 15 px 600. `#sofar` 15 px 500 `#4B4B4B` | T:chip |
| Color | `.two button.on` rim shadow | `.qr[aria-pressed=true]` warm + 2 px ink ring (TR :84) | T:selection.border |
| Spacing | dots 24 px top | `#sofar` 16 px under the pills | T:space-4 |
| Illustration / mascot | cloud nods (`nod()`) | Happi `abc`. The lens is the picture: Happi holds it toward the user's sentence (gaze direction to be verified, Self-critique) | P3-F5 |
| Motion | 420 ms auto-advance | Keep the 420 ms delay. The bubble h1 cross-fades in 150 ms. Never auto-advances the screen | T:enter |
| Haptics | `buzz()` | `buzz()` per answer | P4-F9 |
| Copy (exact strings) | "Honest answers only. You are checking the thought, not arguing with yourself." / "Would you say it to a friend in the same spot?" (idiom) | Q1 "Is it a fact, or a guess?" → "A fact" · "A guess" · "Not sure". Q2 "Would you say it to a friend?" → "Yes" · "Not sure" · "No". Q3 "Does believing it help you?" → "Yes" · "Not sure" · "No". Sub on Q1 only `${Feelings} make sense. Now check the thought, not yourself.` (e.g. "Anxious and sad make sense. …"). `#sofar` = `sofar()` (below) | P4-F1, P1-F6 |
| Accessibility | dots `aria-label` "Check 1 of 3" | The `.say` h1 swap is in `aria-live="polite"`. Focus moves to the first pill of the next check. `#sofar` polite | T:touch-min |
| Ethics guard | `shaky()` score | No score anywhere. "Not sure" is a full answer | P1-F6 |

`sofar()` joins the answered parts with ", " and a final " and ", capitalises the first letter and adds a full stop. Parts: fact → "you called it a fact" / "you called it a guess" / "you weren’t sure if it’s a fact"; friend → "you’d say it to a friend" / "you wouldn’t say it to a friend" / "you’re not sure you’d say it to a friend"; help → "believing it helps" / "believing it doesn’t help" / "you’re not sure it helps". Example: "You called it a guess and you wouldn’t say it to a friend."

## Screen: Fairer thought
| Dimension | Current (abc-analysis.html) → delete, why | Change (decided) | Driven by |
|---|---|---|---|
| Layout | `said('Your thought')` + `textarea.paper` + example chips that write the answer for the user (:421–423) | `line(R.b,'thought',false)` → `head()` → `.sub` → TR `.frame>div>textarea` (TR's `small` "A fairer version" is dropped, L9) → `#status` → `.qrs` of TR `STARTERS` with TR's `data-start` handler (TR :275–278: prepends, never wipes the user's words). TR `.old` is dropped (the sentence already shows B) | L1, L9, L10, P2-F7 |
| Type | 20 px 700 | `.frame textarea` 20 px 700 | T:body |
| Color | n/a | `.frame` `#ECD496` with inner `#FFFAF0`; placeholder 5.12:1 | T:selection.border |
| Spacing | n/a | TR `.frame` 12 px pad | T:space-4 |
| Illustration / mascot | cloud avatar | Happi `abc`; steps aside while the keyboard is open | P3-F7 |
| Motion | none | Step enter only | T:enter |
| Haptics | chip `buzz()` | `buzz()` on starter tap | P4-F9 |
| Copy (exact strings) | "What would be a fairer way to say it?" / "True and kind. Not forced positive, just fair." / okText "Fair and believable is enough." | Bubble "What’s a fairer way to say it?" (7 words, 30 chars). Sub "Aim for something fair and believable, not forced positive." (P6 verbatim). Placeholder "It’s possible that…". Starters "It’s possible that " · "Even though " · "I don’t know yet if " · "A kinder way to see it: ". Hint "A short sentence is enough." | P6-F6, P2-F7 |
| Accessibility | n/a | `aria-label="A fairer way to say it"`. Starters ≥44 px | T:touch-min |
| Ethics guard | `D_EX` chips hand over a finished reframe | Starters only, so the reframe stays the user's (ED1.1). `CRISIS` check (pause + Continue) | P6-F7 |

## Screen: Re-rate
| Dimension | Current (abc-analysis.html) → delete, why | Change (decided) | Driven by |
|---|---|---|---|
| Layout | `said('Before', '… 6 out of 10')` + gauge (:425) | TR `sliderStep({before:true})` shape: `line(R.alt,'could think',false)` → `head()` → `.sub` → `.mid` sky → `.read` word → `.segs` with `i.was` on the before cell → `#cmp`. Seed `R.c2 = R.c` | L5, L7, P1-F6 |
| Type | numeral | Word readout as on C · Strength | T:body |
| Color | n/a | `.segs i.was::after` notch `#29452A` (10.61:1), not TR's `#E09A24` (2.38:1). `#cmp` always `#4B4B4B`; TR's `.note.ok` sage on "Lighter" is removed (L6) | T:selection.border |
| Spacing | n/a | as C · Strength | T:space-4 |
| Illustration / mascot | none | Happi `abc` | P3-F6 |
| Motion | live sky | live sky, 280 ms | T:enter |
| Haptics | none | none | P4-F9 |
| Copy (exact strings) | "And how strong is the feeling now?" | Bubble "How strong is it now?" (5 words). Sub "Any answer is fine." `#cmp`: lower and the word changed → "Less strong than before: Strong to Medium."; lower and the word is the same → "A little less strong than before."; equal → "Same as before: Strong."; higher and the word changed → "Stronger than before: Medium to Strong."; higher and the word is the same → "A little stronger than before." | P4-F1, P1-F6 |
| Accessibility | n/a | `#cmp` `aria-live="polite"`. Range valuetext as on C · Strength | T:touch-min |
| Ethics guard | none | The seed equals the before value, so leaving the slider untouched reads as "same", never as a made-up improvement (TR :118) | P1-F6 |

## Screen: Summary
| Dimension | Current (abc-analysis.html) → delete, why | Change (decided) | Driven by |
|---|---|---|---|
| Layout | `.pair` skies + `ask()` verdict + `.hero` tinted callout + eyebrowed `.chain` + `.group` h3 sections + `.shift` scoreboard + `.tags` (:427–445; L4, L8, L9) | `.verdict` row (Happi 72 px + h1 + `.sub`) → `article.keep` (TR): `.wx` two skies with word captions → `.lead` "When [A], I could think" → `.rf` “[B′]” → `.was` "Instead of “[B]”" → `details.ans` "See your answers" → `.fine` | L4, L7, P4-F5 |
| Type | verdict display + numerals 3.5rem | `.verdict h1` Nunito 700 24 px. `.rf` Fredoka 600 28 px (the one display line). `.lead`/`.was` 15 px 500. `figcaption b` = word, 600 | T:quote |
| Color | `--tint` hero | `.keep` `#E2EEF8`: `#142414` 13.79:1, `#4B4B4B` 7.40:1 | T:quote |
| Spacing | n/a | TR `.keep` padding, 24 px radius | T:space-12 |
| Illustration / mascot | `.pair` clouds with faces | Happi `proud` when `c2 <= c`, `abc` when `c2 > c` (AP3.2). No bubble. Absent after a crisis match or with Show Happi off | P3-F5, P4-F5 |
| Motion | `pop` on the pair | `.keep` pop 500 ms on `--ease`. Happi pose entry 1300 ms | T:enter |
| Haptics | none | Save: `buzz()` once | P4-F9 |
| Copy (exact strings) | "The feeling eased once you tested the thought." / "Next time it shows up, tell yourself" / "x of 3 checks suggest the belief is shaky" / "Completing saves this reflection…" | Verdict per § Honest summary copy. `.wx` captions "Before Strong" / "Now Medium". `details` rows `dt`/`dd`: "What happened" A · "You felt" `${Feelings}. ${Before word}, then ${now word}.` · "The thought" B · "Checking it" `sofar()` · "Fairer thought" B′. Fine print "Saving keeps this in your exercise history, in your own words." Buttons "Edit answers" (ghost) · "Save and finish". Toast after saving "Saved. It’s yours." | P4-F5, P6-F6 |
| Accessibility | n/a | `article aria-label="Your fairer thought"`. Skies `role="img"` labels "Before: Strong" / "Now: Medium". Focus lands on h1. `details` is native | T:touch-min |
| Ethics guard | none | No XP, streak, score or share. When the feeling went up and `c2 >= 7`, a link appears under the sub: "If it feels like too much, you can get help now." | P6-F2, P4-F16 |

## Screen: Crisis sheet
| Dimension | Current (abc-analysis.html) → delete, why | Change (decided) | Driven by |
|---|---|---|---|
| Layout | none (no help entry; the close `confirm()` only) | Header between `.bar` and `#close`: `button#sos` "Get help" on every step. Bottom sheet (onboarding `.sheet` + `.scrim`, :199–207, :235): close X → h3 → line row → "Call 988" → "Text 988" → emergency line → scope line → "Keep writing" | P4-F16, P6-F1 |
| Type | n/a | h3 24 px 700. Rows 17 px 500. `#sos` 13 px 600 | T:body |
| Color | n/a | "Call 988" `#142414` fill with white text (16.25:1, P6 T:crisis.action), no rim. `#sos` `#4B4B4B` on white (8.72:1) | T:crisis.action |
| Spacing | n/a | Rows and buttons ≥56 px; `#sos` ≥44 px | T:touch-min |
| Illustration / mascot | n/a | No Happi on the sheet. After a phrase match or a tap on Get help, `crisis = true`: `head()` renders `.ask.solo` and summary Happi is absent for the rest of the session | P3-F12 |
| Motion | n/a | 0 ms in/out (`.sheet.help{animation:none}`) | T:crisis |
| Haptics | n/a | none | P4-F9 |
| Copy (exact strings) | n/a | h3 "If you’re thinking about hurting yourself, you deserve support now." Row "988 Suicide & Crisis Lifeline · call or text 988". Buttons "Call 988" (`tel:988`) · "Text 988" (`sms:988`). "In danger right now? Call 911." "Happy isn’t an emergency service. If you might act on these thoughts, call now." "Keep writing". Header "Get help" | P3-F12, P4-F16 |
| Accessibility | n/a | `role="dialog" aria-modal="true" aria-labelledby="sh-t"`. Focus goes to X. Esc and the scrim close it, and focus returns to the opener (onboarding `openSheet`/`closeSheet`) | T:touch-min |
| Ethics guard | n/a | Never blocks Continue. The text stays. No paywall, score or celebration after it. Auto-opens at most once per run (`R.helpShown`). The prototype shows a US line only (ponytail, as in onboarding); the locale rows come from P6 § Locale resource table | P6-F7 |

### Crisis rules (deliverable 4)
- **Phrase list:** onboarding.html:515 verbatim, a superset of the P6 English list:
  ```js
  const CRISIS=/\b((kill|hurt|cut)(ing)? myself|kms|end (my life|it all)|wanna die|want(ed)? to die|wish i (was|were) dead|better off (dead|without me)|suicid\w*|self[- ]?harm\w*|overdos\w*|no reason to live|can'?t go on|can ?not go on|do(n'?t| not) want to be here)\b/i;
  ```
  It is tested on `v.replace(/[’‘]/g,"'")`. Verified in `$TMPDIR/abc/r.py`: 16/16 P6 phrases match; 0/6 false positives ("I could die of embarrassment", "The deadline is killing me", "They cut me off in the meeting", "I hurt my back at the gym", "My manager killed the project", "I want to diet"); curly "can’t go on" matches.
- **Fields:** A (`.vf`), B (`.tb`), fairer (`.frame`). These are the only free-text fields.
- **Trigger:** a 1500 ms pause in `ta.oninput` (`clearTimeout`/`setTimeout` inside `bindText`) and `#next` on those steps. If it matches and `!R.helpShown`: set `R.helpShown = crisis = true`, hide `.happi` on screen, `openSheet('help', el)`, and `return` without advancing. A second tap on Continue advances normally (never blocks).
- **Entry points:** header `#sos` on every step (always visible, no toggling); `#help2` under the feelings grid when "Hopeless" is selected; the summary link when the feeling went up and `c2 >= 7`.

## Honest summary copy (deliverable 5)
Decided from the numbers `d = R.c2 - R.c`; words come from `STRENGTH()`.

| Outcome | h1 (Nunito 700) | sub | Happi |
|---|---|---|---|
| down (`d < 0`), word changed | "The feeling is less strong now." | "From strong to medium, after you checked the thought." (lower-cased words) | `proud` |
| down, same word | "The feeling is less strong now." | "Still strong, a little less than before." | `proud` |
| same (`d === 0`) | "The feeling is about the same." | "That’s okay. Some thoughts take more than one look." | `proud` |
| up (`d > 0`) | "The feeling is stronger right now." | "Looking closely can do that for a while. You can come back to this later." + if `c2 >= 7`: link "If it feels like too much, you can get help now." | `abc` |

## Build order
1. Shell: TR header/4-span bar/footer/engine, `STAGES`, weights 700/600/500, fonts link deleted, field focus CSS deleted. Acceptance: jsdom walk reports the bar `aria-valuetext` per step matching § Stages; `grep -c "font-weight:800\|font-weight:900"` = 0.
2. `head()` + Happi `abc` + keyboard aside + Show-Happi flag. Acceptance: each bubble h1 ≤12 words and ≤60 chars (script over `steps`); `.happi svg[aria-hidden=true]`; `.typing` toggles on focusin under a coarse-pointer stub.
3. `line()` + live C/B gaps. Acceptance: jsdom types "they hate me" into B → `#line` contains “they hate me”; an empty gap reads "not written yet".
4. A, B, fairer steps with TR `.vf`/`.tb`/`.frame`, scene-aware chips and starters. Acceptance: typed A → B chips are starters; scene A → scene thoughts (L2).
5. Feelings grid (`.emos`, `FACES`) + strength/re-rate `sliderStep` with words. Acceptance: no visible numeral; valuetext "5 out of 10, Medium"; notch contrast 10.61:1.
6. Test step: 3 pills, swap-in-place, back within checks, `sofar()`. Acceptance: 27 answer combinations give grammatical sentences (script).
7. Crisis: `#sos`, sheet, regex, pause + Continue triggers, `crisis` flag. Acceptance: typing "I want to die" in B opens the sheet once, keeps the text, removes `.happi` from later steps, and Continue still advances.
8. Summary keepsake + honest copy + `details`. Acceptance: the 4 outcome rows above render their exact strings; a single Fredoka element per screen.
9. Reviewer agent pass (L13): drift, AA contrast, aria, orphaned CSS (`.chip`, `.tray`, `.two`, `.dots`, `.chain`, `.hero`, `.shift`, `.tags`, `.group`, `.big`, `.gauge` all removed).

## Measurement plan
Prototype first, then RN with the same events:
- Stage completion: share of runs that reach each of the 4 stages. Guardrail: drop-off at Thought (B) ≤ the current baseline once measured. The empty-middle gap must not stall people.
- Honest re-rate: the share of "same" and "up" results stays visible (non-zero). If 0% "up" over ≥200 runs, the seeded slider or the copy is pushing users toward improvement, so investigate.
- `crisis_sheet_shown` `{trigger: 'button'|'phrase'|'hopeless'|'summary', locale}`, never the text (P6). Guardrail: the share of phrase triggers followed by "Keep writing" within 5 s is reviewed by the clinical owner every 90 days.
- "Edit answers" use rate as a proxy for misread summary copy. Guardrail: no rise in "pressure"/"guilt" words in feedback.

## Contradictions
- L1 says Happi asks every question, while P3 zone 3 bars Happi from CBT instruction steps, P6 § ABC sets mascot "None", and P3 caps Happi at ≤3 bubbles per session. Decision: Happi asks (L1, the user-validated prototype rule and the user's stated target), with ≤1 bubble per screen, one question sentence, ≤12 words and ≤60 chars. All instruction moves to app `.sub` lines (P3-F13). The session cap counts Happi's non-question lines, and ABC uses 0. This follows the onboarding precedent (zone 3 overridden, instruction kept in app copy). It needs a P3 Presence-rules amendment (Self-critique).
- P6 § ABC orders the steps intensity-before → A → B → C → C-behaviour, while the prototype goes A → C → strength → B. Decision: keep A → C → B, because the empty middle gap is the signature (F1) and the before-rating comes after the feelings are named. [S11] lists "A =? B =? C =?" without prescribing an order.
- [S10]/[S11] put behaviour in C; the prototype has no behaviour step. Decision: the prototype stays feelings-only, because the re-rate measures feeling (F2). The RN build keeps its behaviour step, and no copy defines C narrowly.
- P6 § ABC labels the steps "A · What happened", "B · The thought". Decision: no letter eyebrows (L9). The letters live only in the empty gaps of the sentence, where they encode which part is missing (L10).
- TR's `sliderStep` shows a 56 px numeral, while L5 asks for words. Decision: ABC shows words only. TR adopts the same readout in its next pass so the shared component stays one component (AGENTS reuse).
- Onboarding audit C-3 caps the after-sky at 0.3 so it never re-darkens. Decision: ABC does not cap. The summary compares the before and after skies, so a capped sky would misreport the user's own rating (AE1.7). Happi does not slump at any value, which was the other half of C-3.
- How We Feel puts its crisis line under the composer [S2]; P6 and onboarding put it in the header. Decision: header (F6), because ABC's composer changes form on every step.
- TR uses Fredoka twice on its summary and weight 800 in 9 rules, against AGENTS (one Fredoka line per screen; 700/600/500). Decision: ABC complies. TR's drift is reported, not copied.
- P6 Completion's specific line "You linked the moment, the thought and what followed." conflicts with AGENTS "no helper text". Decision: dropped. The keepsake sentence shows the link instead of naming it.

## Rejected ideas
- Keep the A/B/C chain of letter nodes with a connector line. Rejected: it needs an eyebrow per item (L9), connector geometry is an L16 bug class, and Bloom's card+connector [S9] shows the same weight problem.
- Make the weather sky ABC's signature. Rejected: the sky is the shared rating picture across exercises (TR), so ABC needs its own idea. The sky stays only on the two rating steps.
- Animate the intro stones to fill as stages complete. Rejected: it repeats the 4-segment bar (L10), and `exercise-art.js` scenes are static by design.
- Show the 3 checks as a thread of 3 Happi bubbles. Rejected: ≤1 bubble per screen (P3).
- Happi says "That sounds hard." when "Hopeless" is picked. Rejected: it would be a second bubble on the screen. Validation is the app sub on the first check, and the help link is the guard.
- Keep "x of 3 checks suggest the belief is shaky". Rejected: it grades the user (ED2.1). `sofar()` restates the answers instead.
- Reuse TR's `.path` 4-stage list on the intro. Rejected: two maps of one flow on one screen. The empty sentence is the map.

## Critique (pass 1)
Pass 1 drafted the spec by cloning TR's step builders onto the ABC content.
- [FAIL] ED5.2: pass 1 kept TR's `head(title, sub)` with the sub inside the bubble. The A bubble was 2 + 17 = 19 words, and TR's intro bubble is 17 words. That breaks the ≤12-word, one-sentence cap.
- [FAIL] AE1.2: pass 1 inherited TR's shell, which has no crisis path (0 matches for `CRISIS`, `988`, `Get help` in thought-reframing.html), so the A, B and fairer fields had no phrase check.
- [FAIL] AP9.2: pass 1 kept TR's `#cmp` with `.note.ok` (sage) on "Lighter than before", which colours direction as good (L6).
- [FAIL] AE2.1: pass 1 kept TR's before-notch `#E09A24` on `#FFF` = 2.38:1, below the 3:1 non-text minimum.
- [FAIL] ED6.2: pass-1 copy carried idioms: "Something stung today?", "in the same spot", "stir a feeling up".
- [FAIL] AP3.2: pass 1 used Happi `proud` on every summary, including "stronger right now".
- [FAIL] ED2.1: pass 1 kept the summary line "x of 3 checks suggest the belief is shaky", which is a grade.
- [FAIL] RQ1.5: pass 1 cited the 9 caller-supplied Mobbin URLs as evidence. None surfaced in this run's searches, so none was viewed.
- [PASS] AE2.6: happi.js sets `aria-hidden` on the svg (:124); bubbles are text.
- [PASS] AP7.2: TR's distortion names are untouched (ABC has none). The check questions are named accurately (F3).
- Spot-checked 3 citations by re-opening them: [S11] the exact sentence "Bring to bear pragmatic ('Is it helpful?'), empirical (e.g., 'Is it true?'), and logical ('Is it sensible?')" is present; [S12] "Disappearing placeholder text strains users' short-term memory" is present (Sherwin, 2014, reviewed 2018); [S2] re-viewed image: "If you are in crisis, get professional support here" under Finish / Go deeper with the keyboard open. All three match their claims.

## Revisions
- Pass 2, ED5.2: `head(q, sub)` puts only the question in the bubble and moves the sub outside as app copy. All 10 questions are listed with word and character counts (max 7 words, 38 chars).
- Pass 2, AE1.2: added Screen: Crisis sheet and § Crisis rules (onboarding regex verbatim, tested 16/16 with 0/6 false positives; triggers; `crisis` session flag; 4 entry points).
- Pass 2, AP9.2: `#cmp` is always `#4B4B4B` with neutral wording (Re-rate row).
- Pass 2, AE2.1: the notch is now `#29452A` (10.61:1). All other pairs are computed in the screen tables.
- Pass 2, ED6.2: "Did something upset you today?", "Would you say it to a friend?", "Looking closely can do that for a while." The words "heavy" and "lighter" are avoided (P3 Voice).
- Pass 2, AP3.2: Happi is `proud` only when `c2 <= c`, and `abc` otherwise.
- Pass 2, ED2.1: `shaky()` and the score are deleted; `sofar()` restates the answers.
- Pass 2, RQ1.5: ran 7 Mobbin searches and cited only the 9 viewed screens [S1]–[S9]; the caller URLs are listed separately as not viewed.

## Checklist run (deliverable 6, on the pass-2 spec)
**Accessibility and ethics**
- [PASS] AE1.1: harmful extremes and guards: an empty gap that pressures → no gating beyond 2 words; a re-rate pushing improvement → seed = before, neutral copy; distress rising → summary help link at ≥7; a mirrored-distress face → Happi never slumps.
- [PASS] AE1.2: crisis sheet, plain, no Happi, no paywall; US line in the prototype, P6 locale table for RN.
- [PASS] AE1.3: scope sentence on the crisis sheet; the intro claims nothing (F9).
- [PASS] AE1.4: Show-Happi flag honoured; nothing to opt into here.
- [PASS] AE1.5: the help sheet points to people; no "always here" copy.
- [N/A] AE1.6: the save goes to exercise history; viewing and deletion live there (P6 Timeline).
- [PASS] AE1.7: no efficacy claim; the verdict reports the user's own numbers.
- [N/A] AE1.8: the age statement lives in the store listing (P6).
- [PASS] AE2.1: all pairs ≥4.5:1 text / ≥3:1 non-text as computed (lowest 4.50:1 white on ink, at P5's thinnest known margin).
- [PASS] AE2.2: `.qr`, `.emo`, `#sos`, sheet buttons ≥44 px.
- [PASS] AE2.3: `.line` clamps to 4 lines visually with full text for screen readers; the details record holds the full answers; layout unrendered (L14).
- [PASS] AE2.4: global reduced-motion kill rule retained (abc :277); happi.js holds the final frame (:283).
- [PASS] AE2.5: rain drops on 1.2 s cycles, below 3 Hz.
- [PASS] AE2.6: Happi and scenes `aria-hidden`; summary skies labelled with words.
- [PASS] AE2.7: strength in words; the selected state uses ring + tick, not colour alone.
- [PASS] AE2.8: `vibrate(8)` is never the only signal.
- [PASS] AE2.9: the longest instruction, "Aim for something fair and believable, not forced positive.", is grade ≤8 (P6 verbatim); bubbles are ≤7 words.

**Anti-pattern**
- [PASS] AP1.1–AP1.4: no streaks, loss copy or decay.
- [PASS] AP2.1–AP2.6: no urgency, confirmshaming, variable reward or paywall.
- [PASS] AP3.1: one question per bubble, 0 non-question lines.
- [PASS] AP3.2: `proud` only when the feeling did not rise.
- [PASS] AP3.3: instruction is app copy, never Happi.
- [PASS] AP3.4: Happi is absent on the sheet and for the rest of the session.
- [PASS] AP4.1–AP4.3: no "yay", no "cheer up", no "should" aimed at the user (the "I should " starter is the user's own capture).
- [PASS] AP5.1: no confetti or sound.
- [PASS] AP5.2: the cloud idle loops are deleted; one primary button per screen.
- [N/A] AP5.3: no novelty moments in the flow.
- [PASS] AP6.1–AP6.3: no recall, no notification text.
- [PASS] AP7.1: "fair and believable, not forced positive"; C is not narrowed (F2).
- [PASS] AP7.2: check names accurate (F3).
- [PASS] AP7.3: no outcome claims.
- [PASS] AP8.1–AP8.4: see AE2.1, AE2.2, AE2.4, AE2.7.
- [PASS] AP9.1: no eyebrow stacks, callout cards, pills or per-field bars.
- [PASS] AP9.2: every element encodes something (gap letters = the missing part; notch = the before value); no numerals; neutral direction.
- [PASS] AP9.3: conversation kept (L1); no field focus styling (L11).

**Emotional design**
- [PASS] ED1.1: the sentence restates the user's words on 6 of 9 screens; the keepsake shows B′ largest.
- [PASS] ED1.2: "Anxious and sad make sense." precedes the first check.
- [PASS] ED1.3: no points on a distress entry.
- [PASS] ED2.1: no grading; "checking the thought, not yourself".
- [N/A] ED2.2: weekly cadence, single session.
- [PASS] ED2.3: Show-Happi honoured; the hopeless link is non-blocking.
- [PASS] ED3.1: no delight moments to cap.
- [PASS] ED3.2: summary pop 500 ms, no confetti; Happi `proud` is the quiet tier.
- [PASS] ED3.3: no game mechanic borrowed except the 4-segment bar, which is stages, not score (L12).
- [N/A] ED4.1, ED4.2: in-session flow.
- [PASS] ED5.1: the `abc` and `proud` poses have no frown; the cloud face belongs to the rating prop, not the character.
- [PASS] ED5.2: ≤12 words per bubble.
- [PASS] ED5.3: zones 1, 2 and 3 honoured (zone 3 via app-copy instruction, Contradictions).
- [PASS] ED5.4: entries use happi.js holds; aside 200/250 ms; reduced motion = still.
- [PASS] ED6.1: read-aloud lines contain no cloying markers.
- [PASS] ED6.2: idioms removed; "make sense" and "fair" carry translator glosses in i18n.

**Research quality**
- [PASS] RQ1.1–RQ1.3: every finding has hard evidence; 1 of 11 evidence lines is inference-led (F10).
- [PASS] RQ1.4: 13 verified non-internal sources.
- [PASS] RQ1.5: Mobbin screens viewed this run; caller URLs excluded.
- [PASS] RQ1.6: spot-checks above.
- [PASS] RQ2.1–RQ2.4.
- [PASS] RQ3.1, RQ3.2.
- [PASS] RQ3.3: [S11] is a practitioner page, not a trial; F4's word cutoffs are inference.
- [PASS] RQ3.4: Wysa/Ahead patterns transfer within wellness and ed-tech and are dose-adjusted (one bubble, no avatar per line).
- [PASS] RQ4.1–RQ4.4.
- [PASS] RQ5.1, RQ5.2.

## What adds the most soul (deliverable 7, ranked)
1. **The sentence with the empty middle** (F1). The user watches their own words assemble into "When…, I thought…, and felt…". The gap they fill last is the insight of the exercise. Seen-ness (ED1.1) and the CBT act come from one object.
2. **The keepsake in their words** (F5). The fairer thought is the largest text on the last screen, with "Instead of" under it, and the summary verdict never misstates the result.
3. **Happi with the lens on the test step** (F10). The character looks at the user's sentence with them (P3-F5) and never grades it.
4. **"Not sure" plus the so-far sentence** (F3). Honest answers become a plain sentence instead of a score.
5. **A crisis path that is always one tap away** (F6). It is not warmth, but without it the warmth is unsafe; the user can trust the space because help is fixed in the header.

## Self-critique
- Weakest part: the Happi cap reconciliation (questions not counted against ≤3 per session) is my reading of P3's intent, not a rule P3 states. It needs a P3 Presence-rules amendment signed off by the product owner. Until then, the TR and ABC prototypes both exceed the letter of P3. Second weakest: nothing is rendered (L14). The `abc` pose gaze (gx −2.5, gy −1) may point away from the sentence above it. The `lc()` heuristic and `sofar()` grammar are untested on real inputs.
- A further pass should:
  - Run the L14 jsdom walk on the implemented HTML. Snapshot the test step to confirm the lens and gaze point at `#line`; if not, mirror `.happi` with `scaleX(-1)`.
  - Script-check the 27 `sofar()` combinations and 50 sample A inputs through `lc()`.
  - Add the same crisis path to `thought-reframing.html`. It has none today, and it is the reference this spec copies.
  - Re-run the 9 caller-supplied Mobbin URLs once a direct screen lookup is available, and replace [S1] with ABY if it shows the sentence-frame pattern more directly.
  - Get a clinician read on the 3 checks and the "up" summary line.

## Sources
- [S1] Ahead — "Fill in the blank" recap: sentence with a filled slot chip ("decide") and word chips below. https://mobbin.com/screens/12f765b4-92c9-468d-b628-a36845862ace (viewed this run)
- [S2] How We Feel — "Reflect" writing screen, keyboard open, "If you are in crisis, get professional support here" under Finish / Go deeper. https://mobbin.com/screens/d8e58142-43ac-49d4-a363-46cfe3428046 (viewed this run; re-viewed in spot-check)
- [S3] stoic. — sleep rating rendered as "Last night / I slept quite well.", slider ends "Not at all" / "Very". https://mobbin.com/screens/ff6c11c1-3550-4c9e-b943-2d585d20522e (viewed this run)
- [S4] stoic. — "Good job! You’ve Completed your Journal" with WORDS 79 / TIME 00:46 tiles (counter-example). https://mobbin.com/screens/f872477c-61a4-42cd-93bf-9e85af0e0814 (viewed this run)
- [S5] Wysa — chat: penguin avatar beside bubble groups, echo "'Caring, kind and helpful'.", header "Talk to a Counsellor". https://mobbin.com/screens/0804ae99-d713-466d-93b5-719ca47b34e2 (viewed this run)
- [S6] Wysa — home with a header "SOS" button. https://mobbin.com/screens/1feb4801-a9b3-4a95-b5d7-bc095ac9b8f6 (viewed this run)
- [S7] How We Feel — summary: italic question, user's answer "Because I can exercise" small and grey, AI paragraph larger (counter-example). https://mobbin.com/screens/5fe87449-b301-4232-87c1-e169bf1dae7a (viewed this run)
- [S8] Bloom — "The most effective form of therapy" CBT claim screen (counter-example). https://mobbin.com/screens/fd5721f9-dec3-4332-839f-6b4186ed23f8 (viewed this run)
- [S9] Bloom — "Let’s continue!": bordered "Behavioral" card, dotted connector, bordered definition card. https://mobbin.com/screens/dd69170c-f481-4062-ad99-dc278ae0eb90 (viewed this run)
- [S10] Wikipedia. "Rational emotive behavior therapy" (ABC model; "disturbed and dysfunctional emotional and behavioral Cs"). https://en.wikipedia.org/wiki/Rational_emotive_behavior_therapy (opened this run; tertiary source)
- [S11] Matweychuk, W. J. "Becoming skilled at using the ABC model of REBT". REBT Doctor. https://rebtdoctor.com/becoming-skilled-at-using-the-abc-model-of-rebt/ (opened this run; practitioner page, not a trial; re-opened in spot-check)
- [S12] Sherwin, K. (2014, reviewed 2018). "Placeholders in Form Fields Are Harmful". Nielsen Norman Group. https://www.nngroup.com/articles/form-design-placeholders/ (opened this run; re-opened in spot-check)
- [S13] W3C. Understanding WCAG 2.2 SC 4.1.3 Status Messages. https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html (opened this run)
- internal: `.agents/abc-analysis.html`, `.agents/thought-reframing.html`, `.agents/onboarding.html`, `.agents/happi.js`, `.agents/exercise-art.js`, `.agents/happy-ui.css`, `AGENTS.md`, `docs/research/soul/03-character.md`, `04-connection-systems.md`, `05-tokens.md`, `06-implementation-spec.md`, `_work/onboarding-soul-audit.md`, `references/prototype-learnings.md`, `mobile-app-ui-design/references/mobbin-principles.md`
- Caller-supplied Mobbin, not surfaced by this run's searches and not viewed (not evidence): ABY Journal https://mobbin.com/screens/5c0e4735-be8c-426b-9e69-83c2c7ca148e · How We Feel thinking-trap menu https://mobbin.com/screens/6eb1a996-a775-4313-b097-8307ee3b06fd · Bloom sentence starters https://mobbin.com/screens/1bdc3236-bcc3-408b-9cfc-4682b0a3e2fc · Wysa thoughtpad https://mobbin.com/screens/0f4d1e71-9d59-4b87-be26-16f8a18315e6 · Ahead "1 out of 6" https://mobbin.com/screens/aef7519a-2891-4779-a70b-ca9663bcc0ae · Liven reflection https://mobbin.com/screens/649f920a-6755-4d42-9222-edac86f65a92 · Liven summary https://mobbin.com/screens/d2121bed-a008-41d7-9bfa-dd3f1c299756 · stoic words rating https://mobbin.com/screens/a490b4e0-e90a-43cb-8b2f-716e6cd004a1 · Calm journal flow https://mobbin.com/flows/99093f34-33f9-47c8-bd28-97325508f682
