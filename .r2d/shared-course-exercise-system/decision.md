# Decision — Shared Exercise System for Every Course

Use one eight-format exercise kit across all psychoeducation courses. Change content, never interaction mechanics. Each lesson uses 3–5 short activities; no course invents its own exercise type.

**Design rule:** remove interaction friction, not useful thinking. Assume the learner may have low energy, anxiety, poor focus, or little patience.

**Reversibility:** Two-way door for UI. One-way door for `skill_id`, evidence meaning, privacy rules, and telemetry names.

## Prioritized exercises

| Priority | Shared exercise | Why used | Learning proof |
| --- | --- | --- | --- |
| P0 | **Guided recall** | Learner produces answer instead of only recognizing it. Builds durable memory. Start with clue or partial answer; fade support. | Unaided correctness, hint level, delayed recall |
| P0 | **New-situation scenario + why** | Tests whether learner can use idea when details change. Prevents memorizing question wording. | Changed-case choice, reason code, later transfer |
| P0 | **Close discrimination** | Learner separates similar ideas. Good for finding and correcting misconceptions. | Chosen confusion, corrected retry, misconception recurrence |
| P1 | **Guided reconstruction** | Learner rebuilds sequence, model, or cause chain. Easier than blank recall; stronger than rereading. | Step accuracy, partial errors, support-to-unaided change |
| P1 | **Causal explanation / evidence sort** | Learner explains why, or sorts fact, guess, and missing information. Builds deeper understanding without AI judging private writing. | Authored reason/rubric code, sort accuracy, changed-case result |
| P1 | **Guided practice / rehearsal** | Learner performs a safe skill, not only recalls facts. Uses prepare, demonstrate, practise, self-check, and repeat. | Practice completed, support used, later independent rehearsal; never infer health outcome |
| P1 | **Small action plan** | Connects knowledge to one safe, realistic next action. Builds real-world use and autonomy. | Structured plan fields, later plan recall; never score real-life outcome |
| P2 | **Private reflection** | Helps personal meaning and self-awareness. Important for psychoeducation, but not objective mastery evidence. | Completion or skip only; never capture private text |

Cards, basic multiple choice, matching, and true/false are **support tools**. Use for teaching, warm-up, or rescue. Never let them prove mastery alone.

## Shared mobile UX

Every exercise uses the same calm screen structure:

1. **Header:** close button and lesson progress. No timer, lives, or score pressure.
2. **Instruction:** one short sentence saying exactly what to do.
3. **Work area:** one input, choice set, sort, or sequence. This is main object.
4. **Support:** visible `Make this easier` and `Show a clue`; keep two short examples visible when generation may feel difficult.
5. **Bottom action:** `Check`, `Continue`, `Save plan`, or `Save reflection`. Disabled state looks clearly disabled.
6. **Teaching feedback:** appears inline above bottom action, never in blocking modal.

Common interaction states:

`Ready → Answered → Feedback → New example or support → Resolved → Continue`

- Correct response: explain **why** it fits, then continue.
- Incorrect response: teach the rule in one or two sentences. Primary action becomes `Try another example`.
- Learner may choose `Learn with support` or `Skip for now`. Miss never traps or shames.
- Same question never repeats until green. Retry changes surface details.
- Close always stays available. Progress autosaves.

### Low-friction defaults

- Start with 2–4 minute lessons and 3–5 activities.
- Use one action per screen and no more than three choices at first.
- Prefer tap over drag. Typing and voice are optional paths, not requirements.
- Never use blank-page writing, timers, lives, streak pressure, hard gates, forced disclosure, or punishment for skipping.
- Keep review sets to three items or fewer. Unfinished review never becomes overdue debt.
- Do not treat slow reading, pausing, accessibility tools, or asking for help as low ability.

## How each exercise works for learner

### 1. Guided recall

1. User sees a short prompt, tap-to-build word chips, and two pattern examples.
2. User builds a short answer, then taps `Check`. Typing appears later as an optional harder version.
3. App shows answer, reason, and useful clue. Wrong answer opens different prompt.
4. After stable success, word bank and examples fade. Supported answer counts as practice, not mastery.

### 2. New-situation scenario + why

1. User reads one short neutral situation and chooses from two or three responses.
2. Second question asks, `What clue helped you choose?`
3. App explains decision and clue together.
4. Wrong answer leads to new, simpler situation. Same memorized scenario never repeats.

### 3. Close discrimination

1. User sees one example and two similar labels. A third is added only after success.
2. User chooses closest label, then taps `Check`.
3. Feedback compares selected label with correct one: `These look similar. Key difference is…`
4. App checks same distinction later using different wording.

### 4. Guided reconstruction

1. User sees an empty sequence, model, or cause chain with movable pieces.
2. User taps pieces into place, then checks. Dragging is optional.
3. App marks only incorrect link or step. Correct work stays in place.
4. `Show one step` places one piece. Later reviews remove labels and hints.

### 5. Causal explanation / evidence sort

1. User taps a short statement, then taps `Fact`, `Guess`, or `Need more information`.
2. User chooses one authored reason explaining pattern.
3. App shows what evidence supports answer and what remains unknown.
4. No AI scoring of open personal writing. Only bounded authored answers count.

### 6. Guided practice / rehearsal

1. User sees what the skill is for, its limits, and a short demonstration.
2. User taps `Start`, follows one instruction at a time, and may pause, stop, or shorten it.
3. User completes a private self-check such as `Need more guidance` or `Ready to try alone`.
4. App offers one supported repeat or a later independent practice. Stopping never counts as failure.

### 7. Small action plan

1. User chooses from a simple structure: `When…`, `I will…`, `If that feels hard, I can…`
2. App shows plan preview. User edits or saves it.
3. Reminder is optional and off by default.
4. Plan creation counts as participation. Real-world outcome is never right, wrong, or graded.

### 8. Private reflection

1. User sees one large text input first. Two adaptive examples remain visible below it.
2. User may write, speak, use an example as a starting point, or tap `Skip`.
3. Primary action says `Save reflection`, never `Check`.
4. App gives neutral acknowledgement. No correctness, diagnosis, word-count gate, or analytics capture of text.

## Common lesson flow

`Easy review → one teaching card → guided recall → discrimination or reconstruction → changed scenario → optional rehearsal, plan, or reflection`

Use 3–5 exercise formats per lesson. Keep one primary concept. Do not force every format into every lesson.

## Feedback and adaptive support

`Teach one idea → recall → specific correction → retry with changed example → spaced review`

- First miss: show the rule, why, and one clue.
- Second miss: reduce choices or complete one part; then use a changed example.
- Third miss or long stall: show a worked answer and continue. Label it `You practised this with help.`
- Two independent correct responses in different examples: remove choices and answer-bearing help.
- Reading time, language level, voice input, or assistive technology never lower mastery.
- Review same session, then around `+1d`, `+3d`, `+10d`, `+30d`, `+90d`. Tune with learner data.

## Progress and safety

- Track `Introduced → Practising → Ready to use → Kept fresh`.
- `Ready to use`: two unaided correct attempts on separate days, including one changed situation.
- `Kept fresh`: later unaided review succeeds. Completion and XP stay separate.
- Never score feelings, disclosure, mood, journaling, or real-world outcomes.
- Never diagnose, shame, remove earned progress, force retry, or claim treatment/cure.
- Never show `Failed`. Support level and supported completion stay separate from mastery.
- Reward competence: “You used the idea in a new situation.” No streak loss, leaderboard, loot, or variable reward.

## Why this direction

Retrieval improves later learning beyond rereading; spacing improves retention; changed tasks are needed to test transfer. Digital-health products also need explicit evidence, safe design, and good data practices. Sources: [Yang et al., 2021](https://doi.org/10.1037/bul0000309), [Cepeda et al., 2006](https://pubmed.ncbi.nlm.nih.gov/16719566/), [Pan & Rickard, 2018](https://doi.org/10.1037/bul0000151), [NICE Evidence Standards Framework](https://www.nice.org.uk/corporate/ecd7/chapter/section-c-evidence-standards-tables).

**Confidence:** 85%. Core direction strong. Exact spacing and mastery thresholds need pilot testing.

**Next action:** Use this as fixed exercise taxonomy before designing any course.
