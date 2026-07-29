# Sleep Reset Exercise System — Production Learning Audit

**Date:** 2026-07-29  
**Scope:** The registered exercise runtime and every current node in
`src/data/mock/sleep-reset-flat.ts`  
**Review posture:** Production gate for a consumer sleep-learning product  
**Decision:** **REJECT**

This is a source audit. It does not include simulator observation, learner
testing, retention data, or clinical review.

The separate step-based CBT exercise framework under
`src/components/exercise/steps/` is outside this audit because Sleep Reset does
not reach it through `ExerciseRegistry`.

## 1. Executive Summary

The current system is not ready to teach millions of learners. It is not close
to Duolingo production quality.

The course contains 66 interactions across eight lessons and one checkpoint.
The number creates an illusion of depth. The learning engine underneath it is
mostly absent:

- 38 interactions are scored, but a wrong answer can advance on the next tap.
- Authored explanations exist on 33 of those 38 scored interactions, but the
  runtime never displays them.
- Lesson pass thresholds are declared but never calculated or enforced.
- Exercise responses are collected locally, then discarded when the node is
  completed.
- There is no concept mastery state, retry history, misconception tracking,
  delayed review scheduler, or adaptive difficulty.
- The checkpoint tests only one of seven listed review concepts with a scored
  question.
- All 38 scored interactions use recognition or guided reconstruction. There is
  no scored independent recall or production.
- Several health claims are inaccurate, overconfident, internally
  contradictory, or framed as diagnosis.

### Release scores

| Dimension | Score | Verdict |
| --- | ---: | --- |
| Learning effectiveness | 3/10 | Exposure and immediate recognition, not demonstrated learning |
| Engagement | 4/10 | Surface variety; repetitive cognitive action |
| Retention design | 2/10 | Almost no delayed retrieval or mastery evidence |
| Cognitive challenge | 3/10 | Correct answers are usually visible or obvious |
| Interaction quality | 4/10 | Usable taps, but broken answer lifecycle |
| Feedback quality | 1/10 | Authored teaching feedback is discarded |
| Replay value | 2/10 | Fixed sequence, fixed answers, no adaptation |
| Production polish | 3/10 | Attractive shell cannot hide broken learning behavior |
| **Duolingo-quality bar** | **2.5/10** | **Significantly weaker** |
| **Production readiness** | **2/10** | **Reject** |

### What learners may leave with

- **Recognize:** Some sleep terms and obvious cause/effect pairs.
- **Recall unaided:** Not demonstrated.
- **Explain:** Requested in reflections, but never evaluated or corrected.
- **Apply:** Simulated by leading multiple-choice scenarios, not proven.
- **Remember next week:** Unsupported because the system has no delayed
  retrieval loop.

The release cannot be approved by improving copy alone. First fix the answer,
feedback, scoring, persistence, and mastery loop. Then rewrite the course around
that real capability.

## 2. Audit Benchmark

Duolingo's published method has five relevant expectations: learn by doing,
personalized difficulty, focus on important skills, motivation through
bite-sized progress, and delight. Duolingo also describes a progression from
guided work toward open-ended challenges and uses learner performance to choose
appropriately difficult exercises.

The learning-science bar used here is narrower and defensible:

- retrieval should improve later retention more than repeated study;
- learner-generated answers should replace reading when the objective requires
  recall or explanation;
- spaced practice should revisit concepts after delays;
- feedback should correct the learner's model, not only label an answer;
- transfer requires applying a concept to a changed context.

These are design requirements, not promises that a mechanic automatically
causes learning.

## 3. Current Exercise Architecture

### 3.1 Runtime

```text
sleep-reset-flat.ts
  -> journeyApi (mock course tree)
  -> journey selectors
  -> NodeEngine
  -> ExerciseRenderer
  -> ExerciseRegistry
  -> exercise component

answer
  -> local response
  -> generic success/error footer
  -> next exercise
  -> node marked complete
  -> answer data discarded
```

Critical implementation facts:

- `NodeEngine` decides correctness only from `currentResponse?.isCorrect`.
- First press on a scored exercise shows generic success/error.
- Second press advances even after error.
- `LessonScreen` shows only **Awesome!** or **Incorrect**.
- Exercise-specific explanations and option feedback are not passed to the
  footer.
- `handleComplete` receives responses but does not send them to
  `completeNode`.
- `completeNode` marks the node complete without a score.
- `passThreshold` is dead data.
- The content type is `Record<string, any>` and the registry uses
  `ComponentType<any>`, so invalid exercise contracts compile.

### 3.1.1 Evidence map

| Finding | Source |
| --- | --- |
| Correctness depends only on `response.isCorrect`; error advances on next tap | `src/components/node/NodeEngine.tsx:35` |
| Generic success/error footer | `src/components/ui/LessonScreen.tsx:233` |
| Registry claims 14 supported types; builder is a placeholder | `src/components/exercise/ExerciseRegistry.tsx:19` |
| Exercise content is untyped `Record<string, any>` | `src/types/journeyV5.ts:189` |
| Responses received, then omitted from completion API call | `app/tabs/screens/(journey)/journey-flow.tsx:36` |
| Mock completion returns completion state without score or responses | `src/domains/journey/data/journeyApi.ts:303` |
| No journey learning analytics found | `app/_layout.tsx:171` is provider setup; journey runtime has no capture calls |
| No runtime or Sleep Reset tests found | No matching tests for `NodeEngine`, registered scored modules, or `sleepResetFlatData` |

### 3.2 Registered modules

| Module | Interaction | Intended purpose | Cognitive process | Current use |
| --- | --- | --- | --- | --- |
| `concept` | Read text, continue | Model a concept | Passive exposure | Not used |
| `quiz` | Choose one string option | Legacy knowledge check | Recognition | Not used |
| `builder` | Mapped to `ConceptExercise` | Undefined | Broken | Not used |
| `free_text` | Type to a word-count gate | Reflection or independent response | Generation / self-explanation | 4 |
| `guided_response` | Type with sub-prompts and optional mood | Scaffolded reflection | Guided generation | 6 |
| `learn_cards` | Tap to reveal text cards | Psychoeducation | Passive exposure | 9 |
| `matching` | Match current term to one option | Association / categorization | Recognition with elimination | 4 |
| `multiple_choice` | Select one option | Comprehension / discrimination | Recognition | 17 |
| `ordering` | Tap items into an order | Sequence reconstruction | Guided recall | 1 |
| `rating_check` | Pick a labeled rating | Self-report | Metacognition / reflection | 8 |
| `scenario` | Read scenario, select answer | Contextual application | Recognition-based transfer | 5 |
| `slider_rating` | Move a defaulted slider | Self-report | Minimal metacognition | 1 |
| `true_false` | Choose true or false | Misconception correction | Binary recognition | 8 |
| `fill_in_the_blank` | Place supplied options in slots | Guided reconstruction | Cued recall | 3 |

### 3.3 Actual cognitive distribution

| Mode | Count | Share | Production judgment |
| --- | ---: | ---: | --- |
| Passive exposure | 9 | 14% | Too much when feedback also fails |
| Recognition | 34 | 52% | Dominant mode |
| Guided reconstruction | 4 | 6% | Too little |
| Unscored written production | 10 | 15% | Useful, but no correction or evidence |
| Self-report | 9 | 14% | Overused as a lesson ending |

All 38 scored exercises are recognition or guided reconstruction. Zero scored
exercises require independent recall, causal explanation, or action planning.

## 4. Exercise-by-Exercise Production Critique

Score order is:

`learning / engagement / retention / challenge / interaction / feedback / replay / polish`

### `concept` — `3 / 2 / 2 / 1 / 3 / 1 / 1 / 3`

Useful only as a short model. Learner does nothing. It becomes ready
immediately and has no check, elaboration, or follow-up. Good exposure, weak
learning evidence, almost no replay value.

### `quiz` — `2 / 3 / 2 / 2 / 4 / 1 / 2 / 2`

The component returns a numeric index, not `isCorrect`. If marked scored,
`NodeEngine` therefore treats every answer as wrong. It does not use
`correctIndex` to create feedback. This is a broken module, not a shippable quiz.

### `builder` — `1 / 1 / 1 / 1 / 1 / 1 / 1 / 1`

The registry maps builder payloads to `ConceptExercise`, whose expected content
shape is different. This is a placeholder masquerading as a supported exercise.
Remove it from the public contract or implement it.

### `free_text` — `5 / 4 / 5 / 5 / 5 / 1 / 4 / 4`

Best potential for generation and real-world connection. Current completion
means “typed enough words,” not “formed a useful answer.” There are no hints,
examples, optionality controls, structured response fields, or feedback. Forced
minimum word counts turn reflection into homework.

### `guided_response` — `6 / 5 / 6 / 5 / 5 / 1 / 5 / 4`

The strongest learning format in the registry because prompts can scaffold a
causal explanation. It still validates only length and required mood fields.
The system cannot identify a misconception, reflect the answer back, or offer a
worked example. Mood collection and learning production are mixed in one
component.

### `learn_cards` — `3 / 5 / 2 / 1 / 5 / 1 / 2 / 5`

Clear and bite-sized. Still passive. The component ignores the authored
`visual_url`, so the course's diagrams never appear. Tapping reveals more text;
it does not produce prediction, retrieval, or elaboration. Nine sets are too
many for a system with weak active practice.

### `matching` — `5 / 6 / 5 / 5 / 6 / 3 / 5 / 4`

Good association mechanic and the only module with immediate in-task error
recovery. But it forces trial until the correct pair is found, does not preserve
wrong attempts, and returns no `isCorrect`. A scored completed match therefore
produces a generic **Incorrect** footer. Elimination also makes the last pair
free.

### `multiple_choice` — `3 / 4 / 3 / 3 / 5 / 1 / 3 / 4`

Functional selection, weak instruction. Most distractors are absurd, morally
loaded, or much shorter than the correct answer. The component sends
correctness, but the runtime discards all authored correct and incorrect
feedback. Wrong answers can immediately advance. This tests answer spotting.

### `ordering` — `5 / 5 / 5 / 5 / 6 / 1 / 5 / 4`

Useful guided reconstruction. Current random sort can occasionally start in the
correct order. There is no partial credit, misplaced-item explanation, hint, or
retry loop. Only one instance appears in the whole course.

### `rating_check` — `2 / 3 / 2 / 1 / 4 / 1 / 3 / 4`

Valid for optional reflection, not evidence of knowledge. It ends eight of nine
learning nodes, creating a predictable and dull rhythm. Several prompts steer
learners toward agreement: “Does this explain...?” That measures compliance,
not comprehension.

### `scenario` — `5 / 5 / 4 / 4 / 5 / 1 / 4 / 4`

Potentially the best transfer format. Current scenarios remain recognition
questions with obvious answers and answer-length clues. Authored option feedback
is ignored. Several “wrong” options deny anxiety or individual variation,
making the exercise medically overconfident.

### `slider_rating` — `1 / 2 / 1 / 1 / 2 / 1 / 2 / 3`

It defaults to the midpoint and marks itself ready on mount. The learner can
continue without interacting. This is not an exercise. At most it is optional
self-report, and it should require an intentional touch if the data matters.

### `true_false` — `2 / 3 / 2 / 2 / 4 / 1 / 2 / 4`

A 50% guess can pass. It is useful only when a plausible misconception is
followed by an explanation. The runtime hides that explanation, destroying the
format's main teaching value. Eight uses create repetitive binary tapping.

### `fill_in_the_blank` — `4 / 5 / 4 / 4 / 5 / 1 / 4 / 4`

This is an option-bank placement task, not true recall. Correctness is encoded
by each option's target slot. There are no accepted synonyms, typed answers,
hints, or retry feedback. With only two options and two blanks, guessing is
easy.

## 5. Complete Lesson Flow Review

### Unit 1 — Your Brain at Night

#### Lesson 1: Welcome to Sleep School — **3/10 ready**

**Intended outcome:** Distinguish N3 from REM and describe how their
distribution changes through the night.

**Current sequence:** cards → true/false → multiple choice → matching →
scenario → multiple choice → fill blank → true/false → reflection → rating.

**Breaks:**

- Starts with instruction, not retrieval; acceptable for a first lesson.
- Repeats one simplified “early body / late mind” claim seven times in five
  minutes.
- Jumps from one card set to nominal scaffold level 6, but the scenario gives
  the answer away.
- “Two stages are for deep repair; two are for dreams” is inaccurate framing.
- Clock time is treated as if it identifies a person's exact sleep stage.
- “Your sleep is cycling exactly as it should” makes a diagnosis from a generic
  scenario.

**Better sequence:** brief prediction → two-card model with real sleep-stage
diagram → close discrimination → explain one difference from memory → varied
scenario with uncertainty → one personal, optional observation → recap.

#### Lesson 2: The 90-Minute Cycle — **4/10 ready**

**Intended outcome:** Explain that sleep cycles repeat and change across the
night.

**Current sequence:** easy review → cards → true/false → ordering → matching →
true/false → multiple choice → written reflection → true/false → multiple
choice → fill blank → slider → cards.

**Breaks:**

- Thirteen interactions are massed around the same few facts.
- The phase order reaches “peak,” then returns to four easier recognition tasks.
- Cycle duration ranges are memorized more than the underlying pattern.
- “Brief awakenings are 100% normal” and “cycles happening exactly as they
  should” erase individual and clinical variation.
- Ending with more cards asks the learner to reread instead of retrieve.

**Better sequence:** retrieve early/late pattern → predict what changes in cycle
four → model cycle variation → order a night → diagnose a neutral sleep
hypnogram → explain why a late awakening can feel different → optional
reflection → one-sentence recall.

#### Lesson 3: Your Internal Clock — **4/10 ready**

**Intended outcome:** Explain circadian timing and choose a stable wake-time
anchor.

**What works:** It reviews sleep cycles, uses a relevant weekend scenario, and
connects knowledge to the learner's routine.

**Breaks:**

- “Wake time is the master anchor” is repeated as an absolute rule while light,
  chronotype, work schedules, and sleep need are mostly absent.
- The correct option is consistently longer and more specific.
- The learner never generates the mechanism without prompts.
- Rating agreement replaces an end-of-lesson retrieval.

**Better sequence:** retrieve late-night REM → predict Monday after weekend
drift → model circadian cues with bounded language → compare two schedules →
choose a realistic response for a shift worker and a regular worker → plan one
small consistent cue → recall the mechanism.

#### Lesson 4: Early vs Late Sleep — **2/10 ready**

**Intended outcome:** Compare early- and late-night sleep composition.

**Breaks:**

- Only five interactions and two scored responses.
- The lesson mainly repeats Lessons 1 and 2 instead of deepening skill.
- Precise percentages are introduced without source, visualization, or need.
- “Final cycle = almost pure REM; recovery mostly complete” is an unsafe
  overclaim.
- No independent recall, varied scenario, or misconception correction.

**Better sequence:** draw/reconstruct the night arc from memory → reveal a
bounded reference model → compare two hypnograms → correct the false inference
“4 a.m. means REM” → apply to a variable bedtime → short recap.

### Unit 2 — What's Stealing Your Sleep

#### Lesson 5: The Sleep Pressure System — **4/10 ready**

**Intended outcome:** Explain how homeostatic sleep pressure and circadian
timing interact.

**What works:** The tank metaphor is memorable and the nap scenario is
actionable.

**Breaks:**

- `circadian_rhythm` is listed for review but never tagged or retrieved.
- “Miss either = insomnia” turns a model into diagnosis.
- The wrong answer “You're just anxious” is rejected even though sleep onset
  can have multiple causes.
- The learner is told the mechanism inside the question before selecting it.

**Better sequence:** retrieve circadian timing → predict a late nap's effect →
model Process S and C → manipulate a two-curve timeline → compare short versus
long naps → choose a bounded action → explain the interaction without the tank
labels.

#### Lesson 6: Caffeine: The Pressure Blocker — **2/10 ready**

**Intended outcome:** Explain caffeine's relation to adenosine and choose a
personal cutoff.

**Blocking factual problem:** The half-life arithmetic is wrong. For 200 mg at
2 p.m. with a five-to-six-hour half-life, the lesson says 50 mg remains at
8 p.m. and 25 mg at 11 p.m. The first value should be roughly 90–100 mg, and the
second roughly 50–60 mg under that simplified model. The 3 p.m. example also
reaches 25% too early.

**Other breaks:**

- A universal 2 p.m. cutoff is presented as the safest rule for most people,
  despite dose, bedtime, sensitivity, pregnancy, medication, smoking, and
  tolerance variation.
- The learner is asked to perform calculations after being taught bad math.
- Correct answers are obvious and feedback is hidden.

**Better sequence:** retrieve sleep pressure → predict which dose/timing leaves
more caffeine → teach the halving model with one correct worked example →
calculate using selectable time blocks → compare two people with different
bedtimes/sensitivity → choose a personal experiment, not a universal medical
rule → recall mechanism.

#### Lesson 7: Alcohol: The Sleep Saboteur — **2/10 ready**

**Intended outcome:** Explain why alcohol may shorten sleep onset while
disrupting later sleep.

**Blocking content problems:**

- Acetaldehyde is presented as the single cause of REM rebound and specific
  2 a.m. symptoms.
- “Everyone experiences” the effect denies individual variation.
- “Timing doesn't fix it” is absolute.
- “One beer barely disrupts” conflicts with the later claim that one drink can
  disrupt sensitive people.
- “Saboteur,” “destroys,” and “classic” are dramatic, not clinical-quality
  psychoeducation.

**Better sequence:** predict onset versus second-half effect → model the
sedation/fragmentation distinction with bounded language → compare alcohol,
placebo, and timing scenarios → identify an overclaim → choose a low-pressure
personal observation or opt out → recall the main tradeoff.

#### Lesson 8: Light, Stress & Irregular Wake Times — **2.5/10 ready**

**Intended outcome:** Distinguish three disruptor mechanisms and choose a
relevant response.

**Breaks:**

- Three new concepts are compressed into five interactions.
- All scored practice is about irregular wake time. Light and stress are merely
  stated.
- “A bright screen tells the brain it is 10 a.m.” is catchy but false precision.
- The correct answer denies sleep amount and treats timing as the only cause.
- The personal response asks for change before the learner has practiced two of
  the three mechanisms.

**Better sequence:** split into at least two lessons. For light: prediction →
light-timing model → source comparison → evening choice. For stress: body-signal
identification → distinguish arousal from sleep pressure → practise a response.
Interleave wake-time retrieval in both.

#### Checkpoint: Sleep Science Checkpoint — **1/10 ready**

**Intended outcome:** Validate integration of seven section concepts and choose
one useful sleep experiment.

**Reality:**

- One scored multiple-choice question tests only stage names.
- Six listed concepts receive no scored evidence.
- `sleep_composition` is omitted from the checkpoint review list.
- A 50-word personal disclosure is required.
- Personal writing cannot fail, but it is treated as checkpoint completion.
- The 0.85 pass threshold is never computed.
- No delayed recall, misconception diagnosis, or transfer gate exists.

**Better sequence:** six to eight short tasks: uncued stage retrieval, cycle
ordering, Process S/C prediction, caffeine timing calculation, alcohol
misconception correction, light/stress/wake-time matching, a novel multi-cause
scenario, then optional action planning. Report concept evidence separately
from reflection. Do not require disclosure to pass.

## 6. Learning Science Audit

| Principle | Current status | Evidence |
| --- | --- | --- |
| Active recall | **Weak** | No scored independent recall |
| Retrieval practice | **Weak** | Many immediate recognition checks; little delayed retrieval |
| Generation effect | **Partial** | Ten written responses, all unassessed and length-gated |
| Desirable difficulty | **Weak** | Obvious distractors; difficulty numbers do not change runtime |
| Transfer | **Weak** | Five leading scenarios; no open application or changed-context validation |
| Misconception correction | **Broken** | Explanations authored but hidden |
| Scaffolding | **Cosmetic** | `scaffoldLevel` is metadata only; support never adapts |
| Spaced reinforcement | **Weak** | Mostly next-lesson review; no due-review system |
| Feedback-driven learning | **Broken** | Generic label, no retry/reteach |
| Long-term retention | **Unsupported** | No delayed evidence or concept state |

### Spacing map verdict

The course has some hand-authored adjacent review:

- sleep architecture is reviewed in Lesson 2;
- sleep cycles in Lessons 3, 4, and 7;
- sleep pressure in Lesson 6;
- the checkpoint nominally lists seven concepts.

That is not a spaced-repetition system. The runtime does not know when a concept
was last retrieved, whether it was correct, what scaffold level was used, or
when it is due again. The current file declares 32 total lessons but contains
only eight lessons and one checkpoint, so the promised eight-week retention arc
does not exist.

## 7. Duolingo Production Comparison

| Dimension | Relative level | Why |
| --- | --- | --- |
| Learn by doing | **Significantly weaker** | Most “doing” is selecting an obvious answer |
| Exercise surface diversity | **Equivalent on count** | Eleven types appear in the course |
| Cognitive diversity | **Significantly weaker** | Recognition dominates; no scored production |
| Pacing | **Weaker** | Lessons range from 4 to 13 interactions without calibrated time |
| Progressive difficulty | **Significantly weaker** | Difficulty/scaffold fields do nothing |
| Immediate feedback | **Significantly weaker** | Generic labels; authored explanations hidden |
| Meaningful correction | **Significantly weaker** | Wrong answer advances without repair |
| Personalization | **Significantly weaker** | Same fixed sequence for every learner |
| Review integration | **Significantly weaker** | No data-driven or delayed review |
| Mastery validation | **Significantly weaker** | Thresholds ignored; checkpoint is not an assessment |
| Motivation | **Weaker** | Progress bar and mascot exist, but progress is not tied to capability |
| Delight | **Weaker** | Same mascot, same footer, predictable rating ending |
| Real-world relevance | **Mixed** | Sleep scenarios are relevant, but often leading or overconfident |
| Mental-health adaptation | **Weaker** | Forced disclosure, diagnostic certainty, and agreement prompts |

The only real strength is topical relevance plus surface mechanic variety. That
is not enough. Duolingo's quality comes from exercise selection, progressive
challenge, correction, and repeated evidence—not the number of component
names.

## 8. Engagement and Retention Audit

### Engagement arc

| Desired feeling | Current result |
| --- | --- |
| Curiosity | Briefly present in sleep-stage and caffeine mechanisms |
| Momentum | Progress bar works, but errors do not create useful next actions |
| Surprise | Low; correct answer is usually the longest and most specific |
| Confidence | Artificially high because wrong answers have no consequence |
| Flow | Cannot adapt; difficulty metadata is inert |
| Meaningful challenge | Rare |
| Satisfaction | Generic “Awesome!” is disconnected from what was learned |
| Desire to continue | Repetitive ratings and reflections weaken endings |

### Exact disengagement points

1. First wrong scored answer: learner receives **Incorrect**, no explanation,
   then can leave the item.
2. Third or fourth restatement of “early deep, late REM”: learner has already
   spotted the pattern.
3. Written “peak” exercises: learner is asked for 15–50 words without useful
   feedback.
4. Every lesson ending: another agreement or feeling rating.
5. Checkpoint: after eight lessons, learner gets one easy factual question and a
   writing assignment instead of a mastery moment.

### Recognition versus durable learning

The system is likely to produce immediate familiarity. It cannot show durable
learning because it does not collect the required evidence.

- Recognition: supported.
- Cued reconstruction: lightly supported.
- Uncued recall: absent.
- Causal explanation: requested but unevaluated.
- Near transfer: simulated by leading scenarios.
- Far transfer: absent.
- Delayed retention: absent.

## 9. Prioritized Gap Analysis

### P0 — Release blockers

1. **Feedback is discarded.** Errors do not teach.
2. **Wrong answers advance.** There is no correction loop.
3. **Responses are discarded.** No learning state can exist.
4. **Pass thresholds and checkpoint mastery are fake.**
5. **Matching and legacy quiz correctness contracts are broken.**
6. **Health content contains factual errors and unsafe certainty.**
7. **Published metadata promises 32 lessons while only nine learning nodes
   exist.**

### P1 — Major learning failures

1. Recognition dominates all scored work.
2. No delayed retrieval scheduler.
3. No progression from model to independent production.
4. No misconception IDs or targeted remediation.
5. No adaptive difficulty or support restoration.
6. Checkpoint coverage is almost empty.
7. Light and stress are introduced but not practised.
8. Personal disclosure is required for completion.
9. Exercise schema is effectively untyped.
10. No learning analytics or exercise-system tests.

### P2 — Quality and engagement gaps

1. Correct answers reveal themselves through length and specificity.
2. Rating checks are overused.
3. True/false is overused for claims that need nuance.
4. Ordering, prediction, compare/contrast, error correction, and short recall are
   underused.
5. Authored visual assets are ignored.
6. Generic feedback and repeated panda presentation flatten delight.
7. Lesson endings measure agreement instead of retrieval or agency.

## 10. Recommended Production-Grade Framework

### 10.1 One release decision

Do not add more exercise types first. Build one correct learning loop:

```text
retrieve or predict
  -> answer
  -> evaluate
  -> explain
  -> retry or reduce support
  -> record concept evidence
  -> schedule review
  -> advance only after resolved feedback
```

### 10.2 Exercise contract

Every assessable exercise needs:

```yaml
id: string
type: typed_union
concept_ids: [string]
learning_action: retrieve | discriminate | explain | apply | plan
scaffold_level: 1..6
difficulty: 0..1
is_scored: boolean
misconception_ids: [string]
prompt: typed_content
evaluation:
  correct_response: typed
  accepted_alternatives: []
  partial_credit: optional
feedback:
  correct:
    result: string
    why: string
  incorrect_by_misconception:
    misconception_id: string
    correction: string
    hint: string
retry:
  max_attempts: 2
  after_first_error: hint
  after_second_error: worked_example
review:
  introduction_or_review: review
  due_policy: concept_mastery
```

Reflections and self-reports need `is_scored: false`, `optional: true` where
disclosure is not necessary, and a separate sensitive-data policy.

### 10.3 Runtime state

Record each attempt:

- learner ID
- course, node, exercise, and concept IDs
- response
- correct / partial / unscored
- misconception selected
- attempt number
- response time
- scaffold level and difficulty
- feedback shown
- hint used
- completion timestamp

Maintain per-learner concept state:

- exposures
- successful retrievals
- successful transfer tasks
- consecutive errors
- last seen
- next due review
- current scaffold
- mastery status

Mastery requires multiple observations, including one delayed retrieval and one
transfer task. A single correct multiple-choice answer is practice evidence, not
mastery.

### 10.4 Lesson generator

Each lesson should use one primary outcome and this short arc:

1. **Retrieve:** one accessible prior concept.
2. **Predict:** commit before explanation.
3. **Model:** one bounded new idea.
4. **Guide:** discriminate or reconstruct with support.
5. **Apply:** realistic scenario with plausible alternatives.
6. **Produce:** short recall, explanation, or action.
7. **Consolidate:** interleave one due concept.
8. **Reflect:** optional personal connection.

Do not mechanically require all eight. A five-minute lesson can combine phases.
The highest challenge must test the lesson outcome, not word-count endurance.

### 10.5 Feedback pattern

Correct:

> Yes — a late nap reduces homeostatic sleep pressure. That can make bedtime
> sleepiness weaker.

Incorrect:

> Not quite. The clock may still support sleep, but the nap reduced the pressure
> built during wake. Try again: which process did the nap change?

After repeated error:

> Worked example: if pressure is 8 before a nap and the nap lowers it to 4, less
> pressure remains at bedtime.

Feedback names the mechanism, repairs the misconception, and makes the retry
easier without shaming.

### 10.6 Mental-health and sleep guardrails

- Use “can,” “often,” and “may,” not universal diagnosis.
- Do not infer a sleep stage from clock time alone.
- Do not tell a learner their sleep is normal or broken from one response.
- Separate education from clinical assessment.
- Personal reflections are optional and unscored.
- Alcohol prompts include a skip path.
- Mood ratings are not clinical measures unless validated and governed as such.
- Every factual module receives sleep-medicine review and citations.

## 11. Recommended Exercise Mix

For a typical seven-interaction lesson:

| Action | Target | Examples |
| --- | ---: | --- |
| Brief model | 1 | cards, annotated diagram |
| Retrieval | 2 | short recall, reconstruction |
| Discrimination | 1 | close multiple choice, identify mistake |
| Application | 1–2 | scenario, prediction, cause/effect |
| Personal transfer | 0–1 | optional action plan |
| Self-report | 0–1 | only when instructionally useful |

Overused now:

- multiple choice;
- true/false;
- end-of-lesson rating;
- passive cards followed by answer spotting.

Underused now:

- prediction before explanation;
- identify and correct the mistake;
- short uncued recall;
- causal reconstruction;
- ordering a mechanism;
- comparing close cases;
- changed-context scenarios;
- delayed mixed review;
- implementation intentions;
- learner-created examples.

## 12. Prioritized Improvement Roadmap

| Priority | Recommendation | Learning impact | Retention | Engagement | Effort |
| --- | --- | --- | --- | --- | --- |
| P0 | Implement answer → feedback → retry → resolve lifecycle | Very high | High | High | M |
| P0 | Persist attempts and concept evidence | Very high | Very high | Medium | M |
| P0 | Enforce typed correctness contracts for every module | High | Medium | Medium | M |
| P0 | Fix matching/quiz/builder and remove unsupported registry claims | High | Medium | Medium | S |
| P0 | Correct sleep claims with clinical review | Very high | High | Trust-critical | M |
| P0 | Build a real checkpoint with concept coverage | Very high | High | High | M |
| P1 | Add concept mastery and due-review scheduling | Very high | Very high | High | L |
| P1 | Rewrite lessons around retrieval → model → apply → produce | Very high | High | High | L |
| P1 | Add misconception-specific distractors and feedback | High | High | Medium | M |
| P1 | Add short recall and error-correction exercise contracts | High | High | High | M |
| P1 | Make reflection optional and separate sensitive self-report | Medium | Medium | High | S |
| P1 | Instrument exercise and learning analytics | High | High | Medium | M |
| P1 | Add runtime, schema, content, and checkpoint tests | High | High | Low | M |
| P2 | Render authored diagrams and improve contextual delight | Medium | Medium | High | M |
| P2 | Reduce rating checks and vary lesson endings | Medium | Medium | High | S |
| P2 | Add learner-calibrated difficulty after sufficient data | High | High | High | L |

### Shipping milestones

#### Milestone 1 — Honest correctness

- typed response contract;
- exercise-specific feedback;
- retry and worked-example states;
- no advance while an error is unresolved;
- responses persisted;
- matching and quiz fixed;
- pass threshold computed.

#### Milestone 2 — Teachable Section 1

- claims clinically reviewed;
- nine nodes rewritten;
- every lesson has an observable outcome;
- scored production or recall added;
- checkpoint covers every required concept;
- reflection optional;
- content QA tests pass.

#### Milestone 3 — Retention loop

- concept state;
- due-review selection;
- support increase/decrease;
- delayed retrieval;
- transfer evidence;
- learner-facing capability progress.

#### Milestone 4 — Production optimization

- analytics dashboards;
- item difficulty calibration;
- misconception rates;
- retention checks;
- A/B tests for pacing and delight;
- accessibility and simulator QA.

## 13. Verification Checklist

### Runtime

- [ ] Every scored module returns a typed evaluation result.
- [ ] Correct and incorrect feedback render from content.
- [ ] Wrong answers cannot silently advance.
- [ ] Retry changes support after an error.
- [ ] Attempts persist beyond the screen.
- [ ] Node score and pass threshold are computed.
- [ ] Unscored reflection never affects mastery.

### Learning

- [ ] Every lesson has one observable outcome.
- [ ] Every outcome has aligned evidence.
- [ ] Every important concept has immediate, delayed, and transfer retrieval.
- [ ] Checkpoint covers all declared concepts.
- [ ] Distractors map to real misconceptions.
- [ ] No answer is revealed by length or tone.
- [ ] Difficulty rises by cognition, not copy length.

### Safety

- [ ] Sleep-medicine reviewer approves every factual claim.
- [ ] Caffeine calculations are correct.
- [ ] No universal cutoff or diagnosis is presented as fact.
- [ ] No clock time is equated with a definite sleep stage.
- [ ] Alcohol and personal-sleep prompts allow opt-out.
- [ ] Mood and reflection data have explicit governance.

### Product evidence

- [ ] Exercise attempt, retry, hint, and feedback events exist.
- [ ] Concept retention can be measured after a delay.
- [ ] Checkpoint validity is monitored by concept.
- [ ] Completion is not used as a proxy for mastery.
- [ ] Item difficulty and distractor selection rates are observable.
- [ ] Learner drop-off is visible by exercise position and type.

## 14. Definition of Done

This system is production-ready only when:

1. a wrong answer reliably produces corrective teaching and a supported retry;
2. the system stores enough evidence to distinguish exposure, practice,
   retention, and mastery;
3. each lesson progresses toward an observable capability;
4. every core concept is retrieved after a delay and applied in a changed
   context;
5. the checkpoint validates all declared outcomes without requiring personal
   disclosure;
6. sleep content has passed clinical and factual review;
7. automated tests cover every registered exercise contract and the complete
   node lifecycle;
8. simulator QA verifies feedback, retry, progress, keyboard, accessibility,
   and completion behavior;
9. analytics can answer whether learners improve, not merely whether they tap
   through;
10. the published lesson count and actual course content agree.

Until those conditions hold, the correct release decision remains **REJECT**.

## Sources

- [Duolingo Method: five teaching principles](https://blog.duolingo.com/duolingo-teaching-method/)
- [Duolingo Birdbrain and personalized difficulty](https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain/)
- [Duolingo Chess: scaffolded progression and open-ended challenges](https://blog.duolingo.com/chess-course/)
- [Settles & Meeder (2016), trainable spaced repetition](https://research.duolingo.com/papers/settles.acl16.pdf)
- [Roediger & Karpicke (2006), test-enhanced learning](https://www.psychologicalscience.org/journals/psychological-science/j.1467-9280.2006.01693.x/)
- [Slamecka & Graf (1978), generation effect](https://doi.org/10.1037/0278-7393.4.6.592)
- [Cepeda et al. (2006), distributed practice meta-analysis](https://pubmed.ncbi.nlm.nih.gov/16719566/)
- [Butler (2010), retrieval practice and transfer](https://doi.org/10.1037/a0019902)
- [NHLBI: sleep phases, stages, and typical cycles](https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep)
- [Drake et al. (2013), caffeine timing and sleep](https://pmc.ncbi.nlm.nih.gov/articles/PMC3805807/)
- [AASM insomnia guideline: alcohol and sleep](https://aasm.org/resources/clinicalguidelines/040515.pdf)
