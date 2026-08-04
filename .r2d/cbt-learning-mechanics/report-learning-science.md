# Learning science

## Recommendation

Use **Learn → Retrieve → Explain → Correct → Changed-case retry → Spaced transfer**.

One small skill per loop.

Teach with 2 visible worked examples.

Ask learner to recall before showing answer.

Give immediate, specific correction: answer + why + clue.

Retry with changed situation. Never reward next-tap completion.

Unlock progress from demonstrated recall, changed-case use, and later retention. Completion stays separate.

General learning evidence. CBT mapping is reasoned inference. No direct evidence found for this exact adult mobile CBT loop.

## Confidence

**88%.** Retrieval, correction, spacing strong. Exact intervals, mastery cut-offs, and CBT transfer effect need product testing.

## Evidence

### Strong

- Retrieval beats restudy for later retention: [Rowland 2014, meta-analysis](https://doi.org/10.1037/a0037559); [Yang et al. 2021, 222 classroom studies / 48,478 learners](https://doi.org/10.1037/bul0000309); [Karpicke & Roediger 2008, repeated retrieval](https://doi.org/10.1126/science.1152408).
- Spaced practice beats massed practice. Best gap changes with desired retention delay: [Cepeda et al. 2006, quantitative synthesis](https://doi.org/10.1037/0033-2909.132.3.354); [Cepeda et al. 2008, 1,350-person timing study](https://doi.org/10.1111/j.1467-9280.2008.02209.x).
- Retrieval can improve changed-task performance, not only same-question recall. Benefit depends on successful, elaborated retrieval and response match: [Pan & Rickard 2018, transfer meta-analysis](https://doi.org/10.1037/bul0000151); [Yang et al. 2021](https://doi.org/10.1037/bul0000309).
- Prompted self-explanation improves learning across 64 reports, mean g=.55: [Bisra et al. 2018](https://doi.org/10.1007/s10648-018-9434-x). Generating beats reading in 86-study review, mean d=.40: [Bertsch et al. 2007](https://doi.org/10.3758/BF03195967).
- Interleave similar case types after initial learning. Effect depends on similarity: [Brunmair & Richter 2019, meta-analysis](https://doi.org/10.1037/bul0000209).

### Medium

- Corrective feedback after multiple-choice reduced later lure intrusion and improved delayed recall; both immediate and delayed feedback beat none: [Butler & Roediger 2008](https://doi.org/10.3758/MC.36.3.604).
- Novices benefit from worked examples; fade toward independent solving as knowledge grows: [Renkl & Atkinson 2003](https://doi.org/10.1207/S15326985EP3801_3). Adaptive example fading improved delayed transfer in tutor studies, but classroom replication smaller: [Salden et al. 2010](https://doi.org/10.1007/s11251-009-9107-8).
- Refutation text can reduce scientific misconceptions. Do not claim durable CBT-belief change from this alone: [Kennedy et al. 2024, preregistered meta-analysis](https://doi.org/10.1080/00461520.2024.2365628).

## Key findings

- Recognition can feel fluent. It does not prove recall or use. Score it lower.
- Retrieval must happen before answer reveal. Re-reading after reveal is support, not proof.
- Wrong options can plant false knowledge. Always show correction and reason. Never leave a lure hanging.
- Difficulty must be productive. Give support after failure; remove support only after independent success.
- Transfer needs changed situations. Same wording proves weakly.
- Do not infer learning from time, completion, XP, confidence, or symptom change.

## Ranked exercise formats

| Rank | Format | Mechanics / feedback / retry | CBT example | Telemetry |
|---|---|---|---|---|
| 1 | Cued short recall + changed-case retry | Prompt first. Learner types or selects 3–8-word answer. Reveal answer, one-sentence why, then similar new case after error. | “Name the thinking pattern: ‘One awkward meeting means I will fail work.’” Retry: friend cancels dinner. | skill_id, item/version, mode=recall, outcome, latency band, hint stage, retry outcome |
| 2 | Scenario transfer + causal explanation | Give unfamiliar brief case. Ask “What clue tells you?” Then compare learner choice with model reason. Retry only new case. | Choose helpful next step after a tense text. Explain why thought, feeling, and action differ. | mode=transfer, case family, outcome, explanation rubric code, hint stage, delayed outcome |
| 3 | Worked example → faded completion → independent recall | Start with 2 labelled examples. Hide one label/step. Then ask new item without labels. Promote only after no-hint success. | Example maps situation → automatic thought → feeling → action. Next item hides “automatic thought.” | support_level, example_seen, completion outcome, independent outcome |
| 4 | Misconception contrast | Ask prediction. State “Common mix-up: X. Better rule: Y, because Z.” Ask learner to choose/apply Y in changed case. | “Changing a thought is not pretending bad things cannot happen.” | misconception_id, prior choice, correction_shown, corrected retry, later reappearance |
| 5 | Discriminative mixed set | After each skill learned alone, mix 3 similar skills. Ask “Which fits, and why not others?” | Mind reading vs fortune telling vs all-or-nothing thinking. | set_id, confusions, distractor chosen, response order, later discrimination |
| 6 | Recognition check | Use 3–4 plausible choices only as first scaffold or quick review. Always require reason/next changed case for mastery. | Pick best description of behavioural experiment. | mode=recognition, option_id, outcome, distractor exposure, follow-up outcome |
| 7 | Reflection/free text | Keep private and optional. Do not score, gate, or call proof of skill. Offer prompt and examples. | “Write one thought you noticed today.” | completion only; never send text |

## Spacing schedule

- New skill: learn + retrieval + changed-case retry in one short visit.
- Same day: one mixed, new-case check near end of visit. No massed same-card drilling.
- Reviews: 1 day, 3 days, 10 days, 30 days, then 90 days after last independent correct transfer.
- Miss or high support: correct now; schedule another changed case next day. Do not reset course or remove earned progress.
- Passes: lengthen gap one step. Two poor delayed attempts: return to worked example, then re-test later.
- Treat schedule as start setting. Cepeda timing evidence says target retention delay changes best gap. Tune against 30/90-day retention, not engagement.

## Scaffolding policy

- Novice or first miss: keep 2 concrete examples visible. Ask constrained completion before open answer.
- Second miss or long stall: show one fully worked example with labels and causal reason. Then one partial example.
- Two independent correct responses across different cases: remove choices; ask short recall or explanation.
- One independent delayed changed-case success: mark skill retained. Not “finished forever.”
- Never shame a miss. Say what rule fits and why. Keep retry optional only after correction is shown; no forced personal disclosure.
- Confidence question optional. Use only to find overconfidence/underconfidence; never grade it.

## Progression and telemetry

Use three states per skill: `introduced`, `practicing`, `demonstrated`.

`demonstrated` needs product rule: 2 no-hint correct changed-case responses on separate occasions, including 1 delayed review. This is an operational bar, not universal science threshold.

Store only structured learning evidence: skill, item/version, prompt mode, case family, attempt order, outcome, latency band, hint/support level, misconception code, confidence optional, scheduled/due/completed timestamps. Store no journal or free-text content in analytics.

Capture PostHog events for `learning_prompted`, `learning_answered`, `learning_feedback_seen`, `learning_retry`, `learning_review_due`, `learning_review_done`, `learning_mastery_changed`. Supabase remains source of mastery record.

Report: immediate recall, changed-case transfer, 1/10/30/90-day retention, hint dependence, repeated misconception rate, time-to-demonstrated. Segment by item version. Never report completion as learning.

## Contradictions

- Immediate versus delayed feedback mixed. Give correction after each answer here because novice CBT tasks need rapid error repair; spacing supplies later delay. Do not hold correction back for “desirable difficulty.”
- Interleaving helps discrimination, but early mixing can overload novices. Block first. Mix later.
- Open generation has learning value, but too-hard generation stalls users. Show examples and fade; do not start blank.
- Near transfer can improve from retrieval. Far real-life CBT transfer is harder and unproven here. Measure it separately; do not promise it.

## Open questions

- Does short typed recall work better than spoken or tap-built answers for this audience?
- Which CBT skills have reliable structured scoring without reading private text?
- Do 30/90-day reviews retain use without becoming unwanted notifications?
- What changed-case families show meaningful everyday transfer, not answer-pattern memorizing?

## Rejected alternatives

- Done-button / XP path. Measures taps.
- Recognition-only quizzes. Inflates fluency.
- One-shot final test. Misses forgetting and correction.
- Same-question retry until green. Teaches answer memory, not transfer.
- Blank free-text first. High stall risk; no structured proof.
- Streaks, leaderboards, variable rewards. Completion pressure. No learning proof.
