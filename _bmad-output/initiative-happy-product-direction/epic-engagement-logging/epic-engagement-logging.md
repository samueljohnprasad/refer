---
tracker_id: ""
key: ""
type: epic
title: "Logging a thought is small enough to do on a hard day"
parent: initiative-happy-product-direction
covers: ["CAP-2", "CAP-4", "CAP-6"]
after: []
assignee: ""
risk: high
estimate: ""
estimate_basis: ""
---

# Logging a thought is small enough to do on a hard day

## Description

Happi asks once a day, and a person can answer at whatever size they can manage: a mood tap, one caught thought, a fairer version, or a full reframe. Each is a complete log. Naming the thinking trap is a pick, never a blank; "None of these, it's just hard" is a full answer. Whatever they finish is saved once, shown back honestly, and counted the same way on Home and in Practice. Nothing earned is ever lost and Happi never needs anything from the person. The UX spines and the architecture spine own the detail; this epic builds them.

## Outcome

People who open the app on a low-energy day still leave a completed log, and more Thought Catcher sittings end in a saved entry; the signal is completed entries per rung and belief change per weekly active user (research §9.1), not opens.

## Requirements

- R1 (CAP-2): A Thought Catcher sitting saves one row. A catch without a fair version is a completed entry; stepping up updates the same entry. (architecture AD-12, AD-13, AD-14, AD-25)
- R2 (CAP-2): The trap step offers the person's most-picked traps, More, Not sure and None of these; the choice is saved. (UX Component Patterns: Trap chips; AD-15)
- R3 (CAP-2): After the trap step one step-up offer appears with "That's enough for today" at equal weight; the fair-thought step offers stems; unfinished input can be resumed. (UX Step-up row, Stems; AD-14, AD-21)
- R4 (CAP-6): The saved card has standard, catch-only and hard-entry variants; a hard entry gets no praise and offers breathing and help. (UX Saved card variants; AD-18, AD-19)
- R5 (CAP-2): A failed save is queued, shown as unsynced, replayed later, and never counted until acknowledged. (AD-26, inherited AD-8)
- R6 (CAP-4): Ring, lifetime count, garden and Practice stats read one count of completed exercises; the week leaf marks any day with a completed exercise or a mood log. (AD-16, AD-25)
- R7 (CAP-2): Home shows one bubble at most and one button whose label and target follow the modifiers; the daily ask appears under its conditions and rotates. (UX State Patterns M1–M6, Silence Rules; AD-17, AD-21)
- R8 (CAP-4): At the fair-thought step the person's own earlier fair thought for the same trap can be recalled, explained, edited or forgotten. (UX Recall chip, Why sheet; AD-20)
- R9 (CAP-6): The person can choose Gentle or Plain tone once offered and later in Account. (UX Tone setting; AD-22, AD-23)
- R10 (CAP-6): New analytics carry no free text and report one saved event per sitting. (AD-24, inherited AD-7)

## Done when

1. On a production build, a person completes four journeys in the UX spine (Priya, Dev, Ravi, Tomas) and sees the climax described. Mara's journey waits on the parked Low-day row.
2. One sitting that catches a thought and then steps up leaves exactly one `exercise_entries` row, and Home's ring and Practice's count show the same number after it.
3. With the network off, a save shows the unsynced line and moves no count; with the network back, the entry appears once and the counts move.
4. Choosing "None of these, it's just hard" completes the entry and shows the hard-entry card with breathing and help, and no praise.
5. No event sent to analytics contains thought text, fair-thought text or recalled text, checked by inspecting the events module and a captured session.
6. Every new domain rule has a passing table test.

## Boundaries

Owns Home's ask and button, the Thought Catcher wizard, the saved-card variants, the shared practice counts, the week leaf, the garden's data, recall and tone. It does not own the Distressed variant or crisis handling, onboarding and its first reflection, Thought Reframing's steps, notifications, the paywall, or look-back cards.

## References

- architecture — _bmad-output/initiative-happy-product-direction/architecture-engagement-logging/architecture-engagement-logging.md, AD-12 to AD-26 and Deferred
- ux — _bmad-output/initiative-happy-product-direction/ux-engagement-logging/EXPERIENCE.md, all sections
- design — _bmad-output/initiative-happy-product-direction/ux-engagement-logging/DESIGN.md, Components
- mockups — _bmad-output/initiative-happy-product-direction/ux-engagement-logging/mockups/, three key screens
- base ux — _bmad-output/initiative-happy-product-direction/ux-onboarding-and-day-0/EXPERIENCE.md, §13 Lifecycle Home, SavedCard, ProgressPair
- parent architecture — _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md, AD-2, AD-3, AD-7, AD-8, AD-9
- research — docs/research/engagement-and-logging.md, Part 6 and Part 9
- constraint — standing preferences: no shadows on new components, real data only, domain rules pure, containers as hooks, presentation JSX-only, follow the prototype over legacy screens

## Notes

- Decision: Thought Catcher's domain wizard is the only writing runtime (user, 2026-11-15).
- Decision: one optional `trap` field is added to the saved response; nothing else changes shape (user, 2026-11-15).
- Decision: counts come from Supabase rows, and any completed exercise is practice (user, 2026-11-15).
- Decision: the five mood chips stay; Bad is the Low band and Terrible the Not okay band (user, 2026-11-15).
- Decision: the daily ask bubble is added as an eighth allowed bubble; there is no feeling-word step (user, 2026-11-15).
- Unknown: whether an anonymous user can write `exercise_entries` on the hosted project; no policy is visible in the repo. Entry 1 waits on it.
- Decision: the wizard calls the practice-completion adapter only when launched with starter-path parameters; Home-launched sittings write the entry only (user, 2026-11-15).
- Decision: the wizard drops the situation, checkpoint and is-it-true steps; `situation` is saved as an empty string (user, 2026-11-15).
- Decision: the existing go-deeper link to Thought Reframing stays as a quiet text link and is where rung 4 is offered (user, 2026-11-15).
- Decision: the why sheet offers Open entry (read-only) and Forget this; editing a past entry is not built (2026-11-15).
- Decision: the tone card appears after the third completed exercise of any kind (2026-11-15).
- Decision: one epic of 17 entries, not split, because it has one owner and one outcome (user approved the set, 2026-11-15).
- Tracer bullet: entry 1, wizard to mutation to Supabase to counts hook to Home ring.
- Sequencing: the wizard lane runs 3, 7, 4, 5, 6, 12; the counts lane 8 then 9 runs beside it after entry 1; the Home lane 10, 17, 11, 13 starts once 4 and 5 exist; 14 instruments everything; 15 is a person's review after 5; 16 closes.
- Accessibility: each item in the UX spine's Accessibility Floor belongs to the entry that builds its component.
- Parked: the Low-day follow-up row ("Want to start small?"); after a Bad chip Home shows no ask bubble (user, 2026-11-15).
- Parked: the Show Happi toggle (no such setting exists in code) and the monthly ask-line swap (needs more copy).
- Parked: the Distressed variant and "I'm struggling" route, owned by onboarding and Day-0 scope; until it ships a Not okay band opens the existing help sheet.
- Parked: onboarding's first reflection is not an `exercise_entries` row, so the count reads 0 after onboarding. Owned by onboarding.
- Parked: experiments and feature flags from research §9.3; no flag system exists.
- Source conflict: architecture-onboarding-and-day-0 AD-8, AD-9, AD-11 — XP award, streak flame capsule and the old Home screen vs the later UX spines and the current `src/domains/home` Home.
- Waits on epic 2 because: the wizard must call the practice-completion adapter that epic delivered.
