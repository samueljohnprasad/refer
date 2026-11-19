---
name: Happy Engagement & Logging — Experience Spine
description: How Happi asks for a log, how a hard entry is broken into four rungs, what happens on save, how the garden grows, and when Happi stays silent.
status: final
sources:
  - ../../../docs/research/engagement-and-logging.md
  - ../ux-onboarding-and-day-0/EXPERIENCE.md
  - ../ux-exercise-discovery/EXPERIENCE.md
  - ../../../docs/research/retention-strategy.md
  - ./DESIGN.md
updated: 2026-11-15
---

# Happy Engagement & Logging — Experience Spine

This spine is a delta on the [Onboarding & Day-0 experience spine](../ux-onboarding-and-day-0/EXPERIENCE.md) ("the base spine"). The base spine owns Lifecycle Home and its precedence table, check-in chips and the Low follow-up row, lapse and return, notifications, the Distressed variant, crisis handling, the wellbeing check, graduation, ChatThread, ChatTextInput, BeliefScale, SavedCard and ProgressPair. Where this spine is silent, the base spine applies. The evidence behind each decision is in [engagement-and-logging.md](../../../docs/research/engagement-and-logging.md).

**Two amendments to the base spine made by this run** (both applied there):

1. Base §13 presence caps: the bubble list gains an eighth moment, **the daily ask**.
2. Base §19 C4 is closed: the check-in stays one tap; there is no feeling-word second step.

**Differences from the research document.** The research ladder had five rungs; with the feeling-word step removed this spine has four, renumbered. The research document's separate ask card, save bubbles and "Saved. It's yours." wording are not used; the base spine's Home blocks and SavedCard stand.

## Foundation

Single-surface mobile, iOS first, Expo and React Native. No external UI system. `DESIGN.md` in this folder and the base design spine are the visual reference. Saved response shapes for exercise entries are fixed; nothing here changes them. Happi is the cloud character in the shipped rig; expression names follow the base spine.

## Information Architecture

No new tab, route or screen.

| Surface | Reached from | What this spine adds |
|---|---|---|
| Home | App open | The ask bubble; time cost on the button label; night, saved-today and paused modifiers; the tone card (once) |
| Thought Catcher flow | Home button, Lessons, resume row | Catch as a finished state; trap chips with two escapes; stems; recall chip; step-up row |
| Thought Reframing flow | Lessons, Home button rotation | Named as rung 4; no behavioural change |
| Saved card | Save | Catch-only and hard-entry variants; Happi's expression per case |
| Why sheet | Recall chip link | Source entry, Open entry, Forget |
| My Log | Exercises tab | A leaf on today's slot for any log |
| Practice | Exercises tab | Garden growth rules; one-line empty states |
| Account | Home header | Happi's tone |

→ Composition reference: [mockups/key-home-ask.html](mockups/key-home-ask.html), [mockups/key-trap-chips-and-stems.html](mockups/key-trap-chips-and-stems.html), [mockups/key-saved-card-cases.html](mockups/key-saved-card-cases.html). Spines win on conflict.

## Voice and Tone

Base rules hold: Happi's bubble is 12 words or fewer, one sentence, no "I" about its own feelings, no emoji. App copy instructs and quotes; Happi does neither.

| Do | Don't |
|---|---|
| "Anything on your mind this morning?" | "Time for your daily thought log!" |
| "Catch a thought · 2 min" | "Start" |
| "Does one of these fit?" | "Which distortion is this?" |
| "None of these, it's just hard" | "Skip" |
| "That's enough for today" | "Maybe later" / "No thanks" |
| "That sounds hard." | "Great job logging that!" |
| "Two entries this week and Monday shows them back." | "Unlock insights by logging more" |

**The ask bubble, by device local time:**

| Window | Line |
|---|---|
| 05:00–11:59 | "Anything on your mind this morning?" |
| 12:00–16:59 | "What's been on your mind today?" |
| 17:00–21:59 | "Anything from today still with you?" |
| 22:00–04:59 | None |

**Tone setting.** Gentle is the default. Plain removes softeners and keeps meaning and behaviour: "That sounds hard." stays; "Take your time." becomes no line.

`[ASSUMPTION]` Only one ask line per window and the rule for Plain are written. Open item 3.

## Component Patterns

Behaviour only. Visuals are in `DESIGN.md` or, for inherited components, the base design spine.

| Component | Use | Behavioural rules |
|---|---|---|
| Ask bubble | Home hero | At most once per day. Shown only when all hold: the Home variant is D1 or later by install day (base precedence row 5); no thought saved today; today's chip is unanswered, Good or Okay; time is 05:00–21:59; no other allowed bubble is due. Counts toward 1 per screen and 3 per session. Days 1–5 use one fixed line per window |
| Home button | Home | The base filled button. Label carries the time cost: "Catch a thought · 2 min". Night: "Wind down · 1 min". Paused entry: "Continue · about 1 min" |
| Check-in chips | Home | Base behaviour, unchanged, including the Low row with **I'm struggling** and Not okay opening the Distressed variant |
| Thought field | Thought Catcher | Base ChatTextInput. Adds up to three of the person's own recent thoughts as chips above the idea chips |
| Trap chips | Thought Catcher | Base DistortionChips. Order: the person's three most-picked traps, "More" (expands the rest in place), then "Not sure" and "None of these, it's just hard" on their own row. Single select. Either escape completes the step |
| Trap definition | Thought Catcher | One sentence of app copy under the chip rows for the selected trap. Happi does not define traps |
| Step-up row | Thought Catcher, after the trap step | "Want to go one step further? About 1 min." with "Write a fairer version · 1 min" and "That's enough for today" at equal weight. Shown once. Stopping saves the entry as a catch. Not shown after "None of these, it's just hard" |
| Stems | Thought Catcher, fair-thought step | Three of eight; never the same three as the last entry. Tap writes the stem into the field. Optional |
| Recall chip | Thought Catcher, fair-thought step | Shown only when the selected trap has an earlier saved fair thought that did not come from a Low or Not okay session. Tap inserts the text for editing. Follows base Memory callbacks rules |
| Why sheet | From the recall chip | Shows the source entry and date. **Open entry** shows that entry read-only. **Forget this** stops that sentence being recalled; it does not delete the entry |
| Belief scale | Thought Catcher | Base BeliefScale |
| Saved card | End of flow | Base SavedCard. Variants below |
| Week leaf | My Log | Today's slot fills on the first log of the day at any rung |
| Garden | Practice | Grows on any completed exercise (architecture AD-16), not on a check-in. A new growth step animates once, on the next visit to Practice |
| Tone card | Home | Shown once, after the third completed exercise, never on a Low or Not okay day or in a lapsed variant. Any choice dismisses it. Also in Account |

`[ASSUMPTION]` The base spine's BeliefScale is five required steps; the shipped flow uses a slider. This spine inherits the base rule and does not settle the difference. Open item 6.

### The effort ladder

Each rung is a complete log. The person may stop at any rung.

| Rung | Name | What the person does | Typed fields | Time | Complete when |
|---|---|---|---|---|---|
| 1 | Check-in | Taps one of the five mood chips (Terrible · Bad · Okay · Good · Great). Bad is the Low band, Terrible the Not okay band (architecture AD-18) | 0 | 5 s | Chip tapped |
| 2 | Catch | Types or picks one thought; answers "Does one of these fit?" | 1 | 45 s | Trap step answered |
| 3 | Fair version | Writes a fairer thought from a stem; belief before and after | 2 | 2 min | Fair thought saved |
| 4 | Reframe | Evidence for, evidence against, balanced thought | 3–4 | 5 min | Balanced thought saved |

1. Rung 1 counts as showing up. Any completed exercise counts as practice, including rungs 2–4 and exercises outside the ladder such as breathing: it fills the weekly ring and grows the garden (decided 2026-11-15).
2. Leaving midway keeps the highest finished rung; the rest is resumable.
3. The step up from rung 2 to rung 3 is offered once, inside the flow. Rung 4 is offered only by the existing quiet "go deeper" text link in the wizard; nothing offers it on a saved card.
4. On a Low day the base follow-up row routes the person; a rung 2 or 3 entry that day ends on the hard-entry saved card.
5. After Not okay or **I'm struggling** there is no ladder; the base Distressed variant takes over.
6. The example under a question describes a different situation from anything the person wrote.

`[ASSUMPTION]` Rung 2 as a finished entry needs a way to count a Thought Catcher entry with no fair version while saved response shapes stay unchanged. Deferred to architecture. Open item 1.

### Saved card variants

| Variant | Trigger | Card | Happi |
|---|---|---|---|
| Standard | Rung 3 or 4 saved | Base SavedCard, unchanged | Quiet pride, 600 ms or less, once. No bubble |
| Catch-only | Rung 2 saved | One row (the thought); the move reads "You caught the thought."; no belief change | Quiet pride. No bubble |
| Hard entry | Low day, or belief did not drop, or "None of these, it's just hard" | Headline replaced by "That sounds hard."; "Breathe for a minute" above "Go to Home"; help pill below; ProgressPair shown without the count tick | Gentle concern, small. No bubble |
| Milestone | Day 7 or 15, per the base spine | Base behaviour | Celebrating, per the base spine |

The first-ever save and the first save after a gap use Standard; the base spine already handles the reminder row and the return greeting.

`[ASSUMPTION]` Drawn in the mock, not yet confirmed: the Standard card after Day 0 has two rows (the thought, another way to see it) because the personal flow captures no "what happened"; the hard-entry card keeps the "Saved to your journal" row, shows the thought as its one row, and omits the reminder row.

## State Patterns

**Home modifiers.** The base precedence table decides the variant. Then the first matching modifier below applies. Modifiers never apply to the Distressed variant or to onboarding resume (base rows 1–2).

| # | Condition | Effect |
|---|---|---|
| M1 | Time is 22:00–04:59 | No ask bubble. Button reads "Wind down · 1 min" and opens breathing. Happi Resting |
| M2 | An entry is paused midway and it is today's newest saved entry, or it was left on an earlier day | No ask bubble. Button reads "Continue · about 1 min" |
| M3 | A thought was saved today | No ask bubble. No filled button; the saved entry shows with the base link "Catch another one" |
| M4 | Today's chip is Low | No ask bubble. Base follow-up row decides the button |
| M5 | Lapsed variant (base row 3) or post-return week | No ask bubble; the return greeting has the bubble |
| M6 | None of the above, D1 or later | Ask bubble for the time window; button "Catch a thought · 2 min" |

So night with a paused entry is M1; Low with a thought saved today is M3. A paused entry does not expire at midnight. Check-in chips follow the base rule under every modifier: shown until answered, then collapsed.

| State | Surface | Treatment |
|---|---|---|
| No recent thoughts | Thought field | No recent chips; base idea chips only |
| Fewer than three traps picked before | Trap chips | The first three in the standard list |
| No earlier fair thought for this trap | Fair-thought step | No recall chip; stems only |
| Recall sentence forgotten | Fair-thought step | The chip does not return for that sentence |
| Offline | Any rung | Queue the save, show the saved card with the unsynced line, and do not move the ring or count until it syncs (architecture AD-26) |
| Save fails after retry | Saved card | "Saved on this phone. It will sync when you're back online." No error colour |
| Fewer than 3 practices | Practice | Garden pots: grown, sprout or waiting |
| 3 or more practices, a topic untried | Practice | Plot with a dashed ring and "Not tried yet" |
| Practice data fails to load | Practice | The existing error line; never the baseline garden |
| No logs this week | My Log | Seven empty rings; no message about missing days |
| Look-back not ready | Home, Practice | "Two entries this week and Monday shows them back." |
| Show Happi off | Home, saved card | No bubble or character; button label and card unchanged |
| Keyboard open | Thought Catcher | Happi steps aside; returns on close |

## Interaction Primitives

- One tap saves a check-in.
- Typing appears once at rung 2 and once at rung 3, never as the first thing on a screen.
- Back inside a flow returns to the previous step with the answer kept.
- **Banned on logging surfaces:** streak counters, XP, coins, badges, confetti, share buttons, review requests, upsells, auto-advance, typewriter text, a tappable Happi that talks more, any follow-up to a declined step up.

`[ASSUMPTION]` The Exercise Discovery spine lists XP as optional metadata. None is shown on the surfaces in this spine. Open item 7.

## Reaction Timing

Base motion and haptics apply to the saved card (slide up and fade, success haptic, ring fill). This spine adds:

| Moment | Motion | Haptic |
|---|---|---|
| Hard-entry saved card in | Base slide and fade; no count tick; no ring animation | Soft impact, not success |
| Happi Quiet pride on save | 600 ms or less, once | None |
| Happi Gentle concern on hard entry | 300 ms fade in, then still | None |
| Between turns in a flow | Happi's gaze moves to the reply over 500 ms; next question 250 ms after the reply settles | None |
| Garden growth | Scale in, staggered 160 ms per plant, then a slow sway | None |

Reduce Motion: final frames only; the garden shows the settled plant.

## Silence Rules

Happi shows no bubble when:

1. A thought is already saved today.
2. Any entry is saved.
3. Today's chip is Low, Not okay or **I'm struggling**.
4. A help or crisis sheet is open, and for the rest of that session.
5. The keyboard is open.
6. It is between 22:00 and 04:59.
7. Three bubbles have been shown in this session.
8. The person is on My Log, Practice, a chart, the paywall, Account or a permission prompt.
9. The person declined the step up.
10. Show Happi is off.
11. The only line available is generic praise.

Inside a flow Happi asks one question per step and nothing more.

## Rotation

| Clock | What rotates | Pool | Rule |
|---|---|---|---|
| Per entry | Stems | 8, 3 shown | Never the same three twice running |
| Per entry | Example under a question | 4 per question | Never the same twice running |
| Daily, from day 6 | Ask line | 4 per window | No repeat within 3 days |
| Monthly | Ask lines | 4 new replace the 4 oldest | 1st of the month |

## Accessibility Floor

- The Home button's label includes the time cost: "Catch a thought, about 2 minutes, button".
- A selected chip announces "selected". Escape chips are announced like any trap chip.
- The ask bubble is read once when Home appears, after the greeting.
- On a hard entry VoiceOver reads "That sounds hard" before the card rows.
- Dynamic type: chips wrap; the time cost wraps to a second line before a label is cut; step-up options stay stacked.
- Tap targets at least 44 pt; step-up options at least 56 pt; "Why am I seeing this?" has a 44 pt hit area.
- Nothing depends on colour alone: a paused entry has a text label as well as the faded leaf; a filled week leaf is announced "logged".
- "That's enough for today" follows the step option in focus order.

## Inspiration & Anti-patterns

- **Lifted from Wysa:** one question per turn, asking only for the first thought.
- **Lifted from Finch:** a pick before any writing, and writing last.
- **Lifted from BitePal:** the character reacts to showing up, never to what was logged.
- **Lifted from Duolingo:** the time cost stated in the ask.
- **Rejected — a pet that depends on the person (Finch, BitePal):** Happi has no needs, meter or absence mood.
- **Rejected — streaks, hearts, wilting (Duolingo, BitePal, Forest, Habitica):** nothing earned is ever lost.
- **Rejected — treating every thought as a distortion (chat CBT bots):** "None of these, it's just hard" completes the entry.
- **Rejected — an offer on the saved screen (Reflectly):** the step up lives inside the flow only.

## Key Flows

### Flow 1 — Priya, 31, product designer. Tuesday 6:40 pm, replaying a comment from standup

1. Priya opens the app. Happi: "Anything from today still with you?"
2. She taps **Catch a thought · 2 min**.
3. She types "They think I'm not pulling my weight".
4. "Does one of these fit?" Her first chip is Mind reading. She taps it; one sentence explains it.
5. The step-up row appears. She taps **Write a fairer version · 1 min**.
6. She taps the stem "The part I'm missing might be…" and finishes the sentence, then sets her belief before and after.
7. She saves.
8. **Climax:** the saved card slides up with her thought and her other way to see it side by side, and the ring moves to 2 of 3. Happi's cheeks warm and settle without a word.

Failure: offline at step 7 queues the save and shows the card with the unsynced line; the ring moves once it syncs. Leaving at step 6 keeps the catch; next open shows "Continue · about 1 min".

### Flow 2 — Mara, 36, ICU nurse. Thursday 7:50 am after a night shift

1. Mara opens the app and taps **Low** on the check-in chips.
2. The base row asks "Want to start small?" She taps **Breathe for a minute**.
3. **Climax:** Home returns with "Today: Low" and a leaf on Thursday in My Log. No bubble, no button pushing a lesson. The minute of breathing counts as practice like any completed exercise; nothing on screen makes a point of it.

### Flow 3 — Dev, 24, student. Saturday noon, his landlord has given notice

1. Dev taps **Catch a thought · 2 min** and types "I have nowhere to go next month".
2. "Does one of these fit?" None does. He taps **None of these, it's just hard**.
3. No step-up row appears. He saves.
4. **Climax:** the card reads "That sounds hard." with **Breathe for a minute** above Go to Home and the help pill beneath. Happi is small and still. Nobody has told him his problem is a thinking error.

### Flow 4 — Ravi, 29, analyst. Day 20, the same trap again

1. Ravi catches a thought before a review and picks Catastrophising, his most-used chip, then steps up.
2. A recall chip shows his own sentence from 2 November.
3. He taps "Why am I seeing this?", reads the source entry, closes the sheet and taps the chip.
4. He edits two words and saves.
5. **Climax:** on his next visit to Practice the Anxiety plot gains a leaf and sways once. The history he built did part of today's work.

Failure: if he taps **Forget this**, the chip disappears and that sentence is not offered again.

### Flow 5 — Tomas, 34, warehouse lead. Wednesday 11:40 pm, phone in the dark

1. Tomas opens the app. Happi is Resting. No bubble.
2. The button reads **Wind down · 1 min**. He taps it and breathes.
3. **Climax:** the screen stays quiet. Nothing asked him to write the thought down at midnight.

## Analytics

Base rule: no event carries free text. New events are listed in [engagement-and-logging.md §9.2](../../../docs/research/engagement-and-logging.md); rung numbers there map to this spine as 1→1, 3→2, 4→3, 5→4. Primary measures are completed entries per rung and belief change, not opens.

## Open Items

| # | Item | Blocks |
|---|---|---|
| 1 | How a catch-only entry counts as complete without changing saved response shapes (deferred to architecture) | Rung 2 |
| 2 | Clinician review of catch as a stopping point and of the hard-entry card | Release |
| 3 | Copy: nine more ask lines, eight stems, examples, trap definitions, the Plain table | Rotation, tone |
| 4 | Cloud rig parameters for Quiet pride, Gentle concern and the gaze move | Reactions |
| 5 | Whether a check-in alone should place a leaf on the week strip, as specified | My Log |
| 6 | BeliefScale: base spine says five required steps; shipped flow uses a slider | Fair-version step |
| 7 | Exercise Discovery spine allows XP as metadata; this spine shows none | Consistency |
| 8 | Closed 2026-11-15: rung 4 is offered by the wizard's quiet go-deeper link | — |
| 11 | The Low-day follow-up row is parked, so Flow 2 (Mara) is not built in this epic; after a Bad chip Home shows no ask bubble | Flow 2 |
| 12 | The wizard drops its situation, checkpoint and is-it-true steps (decided 2026-11-15) | — |
| 9 | Mocks carry placeholder copy (trap definition, fair-thought question, why-sheet sentence, greetings, belief captions) and an unconfirmed position for the ask bubble under Happi | Copy sign-off |
| 10 | The base mock `key-home-first60s.html` is stale (streak capsule, emoji, shadows); the mocks here follow the spines, not it | Base spine upkeep |
