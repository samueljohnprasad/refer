# Report: Learning Science — unit1-curriculum-execution

## Recommendation

Pick a V1 Unit 1 named **“Sleep is a body rhythm, not a willpower test.”**

Execution model: 4 tiny lessons, 20 current V1 exercises, mock data only, using the existing shared formats:

1. **Your sleep system has three levers** — sleep pressure, body clock, arousal.
2. **Bad nights are data, not failure** — wakeups and uneven sleep can happen without meaning the user is broken.
3. **Sleep gets harder when you try to force it** — anxious effort and clock-checking can raise arousal.
4. **One tiny reset cue** — pick a low-pressure next action: steady wake time, dim/light cue, wind-down buffer, or get out of bed briefly if stuck awake.

Do not lead Unit 1 with detailed sleep architecture stages. Keep N1/N2/N3/REM as a later optional science layer or one bounded explainer, because anxious/low-energy users need a usable model before labels. Teach one idea, ask active recall, correct one misconception, retry with changed scenario, then offer an optional unscored action/reflection.

## Confidence

High — 0.86.

Reason: CBT-I guidelines strongly support education plus behavioral/cognitive components, but this app is not delivering clinician-guided CBT-I in V1. The safe product move is psychoeducation and low-pressure skill rehearsal, not diagnosis, treatment promises, strict sleep restriction, or course-specific engines.

## Evidence

### Strong sources

- AASM clinical practice guideline for behavioral and psychological treatments for chronic insomnia disorder in adults: multicomponent CBT-I is strongly recommended; stimulus control, sleep restriction, relaxation, and brief therapies have conditional support; sleep hygiene alone is not enough. Source: https://jcsm.aasm.org/doi/10.5664/jcsm.8986
- ACP guideline: CBT-I is recommended as initial treatment for adults with chronic insomnia disorder. This supports using CBT-I-aligned principles, while staying clear that the app’s Unit 1 is education/practice, not medical care. Source: https://pubmed.ncbi.nlm.nih.gov/27136449/
- NHLBI/NIH sleep health page: sleep affects learning, decision-making, mood regulation, coping, safety, and health. It also describes daytime sleepiness and sleep deficiency without blaming the person. Source: https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects
- CBT-I primer: CBT-I targets factors that maintain insomnia and commonly includes sleep education, stimulus control, sleep restriction, relaxation, cognitive therapy, and sleep hygiene. This fits Unit 1 as a gentle map of maintaining factors, not a full treatment protocol. Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC10002474/

### Medium sources

- Duolingo spaced repetition explainer: review harder concepts sooner; pair spaced repetition with active recall; practice in small spaced chunks. Useful for execution shape, not sleep domain content. Source: https://blog.duolingo.com/spaced-repetition-for-learning/
- Duolingo half-life regression paper: concept-level recall evidence can drive review timing. Useful as a model for mastery telemetry, not required for V1 mock data. Source: https://research.duolingo.com/papers/settles.acl16.pdf
- Duolingo Method whitepaper: bite-sized lessons, scaffolding, immediate feedback, and repeated practice support app-based learning. Useful for format principles, not clinical safety. Source: https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_duolingo_method_2023.pdf

## Key findings

- The highest-value Unit 1 concept is not “sleep stages”; it is a causal map users can use tonight: sleep pressure builds, the body clock times alertness/sleepiness, and arousal can block sleep even when tired.
- For anxious users, the first unit should reduce self-blame. Copy should say “your system is reacting,” “a bad night is not a personal failure,” and “one cue is enough for tonight.”
- Avoid rigid claims like “wake at X time means REM,” “you need perfect deep sleep,” or “do this and you will sleep.” Use bounded language: “can,” “often,” “may help,” “a common pattern.”
- Teach practical CBT-I-adjacent ideas without prescribing full CBT-I. Stimulus-control style examples can be gentle: “If you are wide awake and frustrated, leaving bed briefly can help your brain relearn bed = sleep.” Avoid strict sleep restriction in Unit 1 V1 without clinician context.
- Sleep hygiene alone is weak as a standalone intervention, so do not make Unit 1 a checklist of caffeine/screens/room tips. Use tiny cues only after teaching the mechanism.
- The existing exercise formats are enough:
  - `close_discrimination`: choose safer belief vs misconception.
  - `guided_recall`: rebuild the three-lever model.
  - `scenario_why`: apply the model to a changed person/situation.
  - unscored `close_discrimination`: optional personalization/action choice.
- Runtime should use authored feedback and changed-example retry. From the prior audit snapshot, scoring/completion without feedback/mastery would undermine learning, so Unit 1 content should be authored for correction and retry even if persistence remains mock-only.
- Mastery evidence should be concept-level: `sleep_pressure`, `body_clock`, `arousal`, `self_blame_reframe`, `tiny_cue`. Do not store sensitive reflections as scored proof.

Recommended Unit 1 structure:

| Lesson | Concept | Bite-size objective | Exercise loop |
| --- | --- | --- | --- |
| 1 | Three levers | “Sleep is shaped by pressure, clock, and arousal.” | discriminate model -> recall levers -> scenario -> unscored worry area -> recap |
| 2 | Sleep pressure | “Being tired helps, but naps/in-bed wake time can change pressure.” | discriminate -> recall build/release -> changed scenario -> optional cue -> recap |
| 3 | Body clock | “Light, wake time, and routine help time sleepiness.” | discriminate -> recall cues -> changed scenario -> optional cue -> recap |
| 4 | Arousal/self-blame | “Trying harder can keep the system alert; one calm reset is enough.” | discriminate -> recall effort/arousal -> scenario -> optional action -> recap |

## Contradictions found within this domain

- Guidelines support CBT-I, but the app constraint forbids a new clinical engine, Supabase persistence, or clinician workflow. Resolution: Unit 1 should be CBT-I-informed psychoeducation and rehearsal, not “CBT-I treatment.”
- AASM includes sleep restriction as a supported component, but target users include anxiety/depression/low energy and V1 lacks assessment/safety guardrails. Resolution: exclude strict sleep restriction from Unit 1 V1; mention only gentle sleep-pressure concepts.
- Sleep architecture is legitimate sleep science, but it can invite monitoring and stage anxiety. Resolution: do not center Unit 1 on N1/N2/N3/REM; center it on actionable mechanisms.
- Duolingo-style learning favors challenge and mastery, while mental-health UX must avoid pressure. Resolution: use active recall and review, but no lives, timers, streak threats, shame copy, or forced reflection.

## Open questions

- Should Unit 1 include one brief “when to seek medical help” card for red flags such as severe daytime sleepiness, breathing pauses, safety risk, mania symptoms, or persistent distress?
- Should V1 show “learning progress” only as private concept confidence, or also as visible lesson completion?
- Should strict CBT-I techniques like sleep restriction remain out of the whole course unless reviewed by a clinician?

## Rejected alternatives

- **Current sleep-stage-first Unit 1**: too trivia-like for first value; risks stage-monitoring anxiety; less directly useful tonight.
- **Sleep hygiene checklist Unit 1**: official guidance and CBT-I literature do not support hygiene alone as the core insomnia intervention.
- **Full CBT-I protocol in Unit 1**: outside V1 scope and safety envelope; would need screening, diary logic, clinician-grade caveats, and stronger persistence.
- **Journaling-first Unit 1**: too much effort and disclosure for low-energy users; reflections should remain optional and unscored.
- **New exercise engine for sleep**: violates the shared-format constraint and is unnecessary for this curriculum.
