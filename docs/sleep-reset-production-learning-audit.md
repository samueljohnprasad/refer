# Sleep Reset Exercise System — Production Learning Audit

**Date:** 2026-07-29  
**Scope:** Registered exercise runtime + nodes in `src/data/mock/sleep-reset-flat.ts`  
**Review posture:** Production gate consumer sleep-learning product  
**Decision:** **REJECT**

Source audit only. No simulator obs, learner testing, retention data, or clinical review.

Separate step CBT exercise framework `src/components/exercise/steps/` outside audit. Sleep Reset not reach it via `ExerciseRegistry`.

## 1. Executive Summary

System not ready for millions learners. Not Duolingo quality.

66 interactions, 8 lessons, 1 checkpoint. Illusion of depth. Learning engine absent:

- 38 scored, but wrong answer advance on next tap.
- Authored explanations exist on 33 of 38 scored interactions, runtime hide them.
- Pass thresholds declared, never calculated or enforced.
- Responses collected locally, discarded on node complete.
- No concept mastery state, retry history, misconception track, delayed review, or adaptive difficulty.
- Checkpoint test 1 of 7 concepts with scored question.
- All 38 scored interactions use recognition or guided reconstruction. Zero scored independent recall.
- Health claims inaccurate, overconfident, contradictory, or act like diagnosis.

### Release scores

| Dimension | Score | Verdict |
| --- | ---: | --- |
| Learning effectiveness | 3/10 | Exposure + recognition, not demonstrated learning |
| Engagement | 4/10 | Surface variety; repetitive cognitive action |
| Retention design | 2/10 | Almost no delayed retrieval or mastery evidence |
| Cognitive challenge | 3/10 | Correct answers visible or obvious |
| Interaction quality | 4/10 | Usable taps, broken answer lifecycle |
| Feedback quality | 1/10 | Authored teaching feedback discarded |
| Replay value | 2/10 | Fixed sequence, fixed answers, no adaptation |
| Production polish | 3/10 | Attractive shell, broken learning behavior |
| **Duolingo-quality bar** | **2.5/10** | **Significantly weaker** |
| **Production readiness** | **2/10** | **Reject** |

### What learners may leave with

- **Recognize:** Some sleep terms + obvious cause/effect.
- **Recall unaided:** Not demonstrated.
- **Explain:** Requested in reflections, never evaluated/corrected.
- **Apply:** Simulated by leading multiple-choice, not proven.
- **Remember next week:** Unsupported. No delayed retrieval loop.

Cannot fix via copy only. Fix answer, feedback, scoring, persistence, mastery loop. Then rewrite course.

## 2. Audit Benchmark

Duolingo published method: learn by doing, personalized difficulty, important skills focus, bite-sized progress motivation, delight. Progression from guided to open-ended. Use performance to choose exercise difficulty.

Learning-science bar:
- retrieval improve retention > repeated study
- generated answers replace reading when objective recall or explain
- spaced practice revisit concepts after delay
- feedback correct model, not just label answer
- transfer require apply concept to changed context

Design requirements, not automatic mechanics.

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

Implementation facts:
- `NodeEngine` decide correctness only via `currentResponse?.isCorrect`.
- First press on scored exercise show generic success/error.
- Second press advance after error.
- `LessonScreen` show only **Awesome!** or **Incorrect**.
- Exercise explanations + option feedback not passed to footer.
- `handleComplete` receive responses, not send to `completeNode`.
- `completeNode` mark complete without score.
- `passThreshold` dead data.
- Content type `Record<string, any>`, registry use `ComponentType<any>`. Invalid contracts compile.

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
| Unscored written production | 10 | 15% | Useful, no correction/evidence |
| Self-report | 9 | 14% | Overused as lesson ending |

All 38 scored exercises = recognition or guided reconstruction. Zero independent recall, causal explanation, action planning.

## 4. Exercise-by-Exercise Production Critique

Score order: `learning / engagement / retention / challenge / interaction / feedback / replay / polish`

### `concept` — `3 / 2 / 2 / 1 / 3 / 1 / 1 / 3`
Model only. Learner do nothing. Ready immediately, no check. Good exposure, weak evidence, low replay.

### `quiz` — `2 / 3 / 2 / 2 / 4 / 1 / 2 / 2`
Return numeric index, not `isCorrect`. `NodeEngine` treat all wrong. `correctIndex` unused. Broken module, not shippable.

### `builder` — `1 / 1 / 1 / 1 / 1 / 1 / 1 / 1`
Map payload to `ConceptExercise`, shapes differ. Placeholder. Remove or implement.

### `free_text` — `5 / 4 / 5 / 5 / 5 / 1 / 4 / 4`
Best generation potential. Completion = "typed enough words", not "useful answer". No hints, feedback. Forced word count turn reflection to homework.

### `guided_response` — `6 / 5 / 6 / 5 / 5 / 1 / 5 / 4`
Strongest format via sub-prompts. Validate only length + mood. Cannot ID misconception or reflect answer. Mood + learning mixed.

### `learn_cards` — `3 / 5 / 2 / 1 / 5 / 1 / 2 / 5`
Clear, passive. Ignore authored `visual_url`. Tapping reveal text, no prediction/retrieval. 9 sets too many.

### `matching` — `5 / 6 / 5 / 5 / 6 / 3 / 5 / 4`
Good association, only module with immediate error recovery. Force trial, no `isCorrect` returned. Completed match give generic **Incorrect** footer. Elimination make last pair free.

### `multiple_choice` — `3 / 4 / 3 / 3 / 5 / 1 / 3 / 4`
Functional selection, weak instruction. Distractors absurd/moral/short. Component send correct, runtime discard authored feedback. Wrong answers advance immediately. Test answer spotting.

### `ordering` — `5 / 5 / 5 / 5 / 6 / 1 / 5 / 4`
Useful reconstruction. Random sort can start correct. No partial credit, hint, or retry. Only 1 instance in course.

### `rating_check` — `2 / 3 / 2 / 1 / 4 / 1 / 3 / 4`
Valid optional reflection, not knowledge evidence. End 8 of 9 nodes, dull rhythm. Prompts steer to agreement. Measure compliance.

### `scenario` — `5 / 5 / 4 / 4 / 5 / 1 / 4 / 4`
Best transfer format. Current scenarios = recognition with obvious answers. Authored feedback ignored. "Wrong" options deny variation, medically overconfident.

### `slider_rating` — `1 / 2 / 1 / 1 / 2 / 1 / 2 / 3`
Default midpoint, ready on mount. Learner can bypass. Not exercise. Self-report. Should require intentional touch.

### `true_false` — `2 / 3 / 2 / 2 / 4 / 1 / 2 / 4`
50% guess pass. Useful if follow by explanation. Runtime hide explanation, destroy value. Repetitive binary tap.

### `fill_in_the_blank` — `4 / 5 / 4 / 4 / 5 / 1 / 4 / 4`
Option-bank placement, not recall. Correctness encoded via target slot. No synonyms, hints, retry. With 2 options, guess easy.

## 5. Complete Lesson Flow Review

### Unit 1 — Your Brain at Night

#### Lesson 1: Welcome to Sleep School — **3/10 ready**
**Intended:** Distinguish N3 vs REM, describe night distribution.
**Current:** cards → true/false → multiple choice → matching → scenario → multiple choice → fill blank → true/false → reflection → rating.
**Breaks:**
- Start instruction, no retrieval. (Acceptable lesson 1)
- Repeat "early body / late mind" 7 times in 5 mins.
- "Two stages deep repair; two dreams" inaccurate.
- Treat clock time as exact sleep stage.
- "Sleep cycle exactly as it should" diagnose generic scenario.
**Better sequence:** predict → two-card model w/ diagram → close discrimination → explain memory difference → varied scenario → optional observation → recap.

#### Lesson 2: The 90-Minute Cycle — **4/10 ready**
**Intended:** Explain sleep cycles repeat/change.
**Current:** easy review → cards → true/false → ordering → matching → true/false → multiple choice → written reflection → true/false → multiple choice → fill blank → slider → cards.
**Breaks:**
- 13 interactions massed on few facts.
- Range memorized, not pattern.
- Erase individual variation ("100% normal", "exactly as they should").
- End with cards = reread, not retrieve.
**Better sequence:** retrieve early/late → predict change in cycle 4 → model variation → order night → diagnose hypnogram → explain late awaken feel → reflect → 1-sentence recall.

#### Lesson 3: Your Internal Clock — **4/10 ready**
**Intended:** Explain circadian timing, choose wake-time anchor.
**What works:** Review sleep cycle, weekend scenario, personal connect.
**Breaks:**
- "Wake time master anchor" repeated absolute rule. Ignore light, chronotype, work, need.
- Correct option longer/specific.
- Learner never generate mechanism unprompted.
- Rating replace end retrieval.
**Better sequence:** retrieve late REM → predict Monday drift → model circadian bounded → compare schedules → choose response (shift vs regular) → plan cue → recall mechanism.

#### Lesson 4: Early vs Late Sleep — **2/10 ready**
**Intended:** Compare early/late composition.
**Breaks:**
- Only 5 interactions, 2 scored.
- Repeat Lesson 1/2.
- Precise % unverified.
- "Final cycle = pure REM; recovery complete" unsafe overclaim.
- No independent recall, varied scenario, misconception correct.
**Better sequence:** draw arc from memory → reference model → compare hypnograms → correct "4am = REM" → apply variable bedtime → recap.

### Unit 2 — What's Stealing Your Sleep

#### Lesson 5: The Sleep Pressure System — **4/10 ready**
**Intended:** Explain homeostatic pressure vs circadian timing.
**What works:** Tank metaphor, nap scenario.
**Breaks:**
- `circadian_rhythm` listed, never tagged/retrieved.
- "Miss either = insomnia" diagnose.
- Reject "You're just anxious", though sleep onset multi-causal.
- Mechanism told before select.
**Better sequence:** retrieve circadian → predict late nap effect → model Process S/C → manipulate timeline → compare naps → choose bounded action → explain mechanism no labels.

#### Lesson 6: Caffeine: The Pressure Blocker — **2/10 ready**
**Intended:** Explain caffeine vs adenosine, choose cutoff.
**Blocking factual:** Half-life math wrong. 200mg @ 2pm, 5-6h half-life = 90-100mg at 8pm (not 50mg), 50-60mg at 11pm (not 25mg). 3pm example also wrong.
**Breaks:**
- Universal 2pm cutoff, ignore dose/tolerance/bedtime/pregnancy.
- Ask calculations after teach bad math.
- Correct obvious, feedback hidden.
**Better sequence:** retrieve sleep pressure → predict dose/timing → teach half model w/ correct example → calculate time blocks → compare 2 people → choose personal experiment → recall mechanism.

#### Lesson 7: Alcohol: The Sleep Saboteur — **2/10 ready**
**Intended:** Explain alcohol short onset, disrupt later sleep.
**Blocking content:**
- Acetaldehyde sole cause REM rebound.
- Deny individual variation ("Everyone experiences").
- "Timing doesn't fix it" absolute.
- "One beer barely disrupts" conflict later claim.
- Dramatic language ("Saboteur", "destroys"), not clinical.
**Better sequence:** predict onset vs second-half → model sedation/fragmentation bounded → compare alcohol/placebo/timing → ID overclaim → choose low-pressure observation/opt-out → recall tradeoff.

#### Lesson 8: Light, Stress & Irregular Wake Times — **2.5/10 ready**
**Intended:** Distinguish 3 disruptors, choose response.
**Breaks:**
- 3 concepts compressed 5 interactions.
- Scored practice only wake time. Light/stress stated only.
- "Bright screen tell brain 10am" false precision.
- Correct answer deny sleep amount, treat timing sole cause.
- Personal response before practice 2 of 3 mechanisms.
**Better sequence:** Split to 2 lessons. Light: predict → model → compare → evening choice. Stress: body-signal ID → distinguish arousal/pressure → practice. Interleave wake-time.

#### Checkpoint: Sleep Science Checkpoint — **1/10 ready**
**Intended:** Validate 7 concepts, choose experiment.
**Reality:**
- 1 scored question test stage names.
- 6 concepts no scored evidence.
- `sleep_composition` omitted.
- 50-word disclosure required.
- Writing cannot fail, treated as completion.
- 0.85 pass never computed.
- No delayed recall, misconception diagnosis, transfer gate.
**Better sequence:** 6-8 tasks: uncued stage retrieve, cycle order, Process S/C predict, caffeine math, alcohol misconception, matching, novel multi-cause scenario, optional action. Separate concept evidence from reflection.

## 6. Learning Science Audit

| Principle | Current status | Evidence |
| --- | --- | --- |
| Active recall | **Weak** | No scored independent recall |
| Retrieval practice | **Weak** | Immediate recognition checks; little delayed retrieval |
| Generation effect | **Partial** | 10 written responses, unassessed, length-gated |
| Desirable difficulty | **Weak** | Obvious distractors; difficulty metadata inert |
| Transfer | **Weak** | 5 leading scenarios; no open application |
| Misconception correction | **Broken** | Explanations authored but hidden |
| Scaffolding | **Cosmetic** | `scaffoldLevel` metadata only; no adapt |
| Spaced reinforcement | **Weak** | Next-lesson review; no due-review system |
| Feedback-driven learning | **Broken** | Generic label, no retry/reteach |
| Long-term retention | **Unsupported** | No delayed evidence or concept state |

### Spacing map verdict
Hand-authored adjacent review exist. Not spaced-repetition system. Runtime not track concept last retrieve, correctness, scaffold, or due date. 32 declared lessons, only 8 + 1 checkpoint exist. 8-week retention arc absent.

## 7. Duolingo Production Comparison

| Dimension | Relative level | Why |
| --- | --- | --- |
| Learn by doing | **Significantly weaker** | Select obvious answer |
| Exercise surface diversity | **Equivalent on count** | 11 types |
| Cognitive diversity | **Significantly weaker** | Recognition dominate; zero scored production |
| Pacing | **Weaker** | 4-13 interactions, uncalibrated time |
| Progressive difficulty | **Significantly weaker** | Difficulty/scaffold inert |
| Immediate feedback | **Significantly weaker** | Generic labels; explanations hidden |
| Meaningful correction | **Significantly weaker** | Wrong answer advance, no repair |
| Personalization | **Significantly weaker** | Fixed sequence |
| Review integration | **Significantly weaker** | No data-driven delayed review |
| Mastery validation | **Significantly weaker** | Thresholds ignored; checkpoint not assessment |
| Motivation | **Weaker** | Progress bar/mascot not tied to capability |
| Delight | **Weaker** | Predictable rating ending, same mascot |
| Real-world relevance | **Mixed** | Sleep scenarios relevant, but leading/overconfident |
| Mental-health adaptation | **Weaker** | Forced disclosure, diagnostic certainty |

Quality from progression, correction, repeated evidence, not component count.

## 8. Engagement and Retention Audit

### Engagement arc

| Desired feeling | Current result |
| --- | --- |
| Curiosity | Briefly in mechanisms |
| Momentum | Bar work, errors no useful next action |
| Surprise | Low; correct answer longest/specific |
| Confidence | Fake high, wrong answers no consequence |
| Flow | Cannot adapt; difficulty inert |
| Meaningful challenge | Rare |
| Satisfaction | Generic "Awesome!" disconnected |
| Desire to continue | Repetitive ratings weaken endings |

### Exact disengagement points
1. First wrong scored answer: **Incorrect**, no explanation, advance.
2. 3rd/4th restatement "early deep, late REM": learner spot pattern.
3. Written "peak" exercises: ask 15-50 words, no feedback.
4. Lesson endings: agreement rating.
5. Checkpoint: 1 easy question, writing assignment, no mastery.

### Recognition versus durable learning
Immediate familiarity. Cannot show durable learning (evidence discarded).
- Recognition: supported
- Cued reconstruction: lightly supported
- Uncued recall: absent
- Causal explanation: requested, unevaluated
- Near transfer: simulated
- Far transfer / Delayed retention: absent

## 9. Prioritized Gap Analysis

### P0 — Release blockers
1. **Feedback discarded.** Errors no teach.
2. **Wrong answers advance.** No correction loop.
3. **Responses discarded.** No learning state.
4. **Pass thresholds + checkpoint mastery fake.**
5. **Matching + legacy quiz contracts broken.**
6. **Health content factual errors + unsafe certainty.**
7. **Metadata promise 32 lessons, only 9 exist.**

### P1 — Major learning failures
1. Recognition dominate.
2. No delayed retrieval scheduler.
3. No progression model -> independent production.
4. No misconception IDs / targeted remediation.
5. No adaptive difficulty / support restoration.
6. Checkpoint coverage empty.
7. Light/stress introduced, not practised.
8. Personal disclosure required.
9. Schema untyped.
10. No analytics or tests.

### P2 — Quality and engagement gaps
1. Correct answers long/specific.
2. Rating checks overused.
3. True/false overused for nuance.
4. Ordering, predict, contrast, error correct, short recall underused.
5. Authored visual assets ignored.
6. Generic feedback / panda flatten delight.
7. Lesson endings measure agreement.

## 10. Recommended Production-Grade Framework

### 10.1 One release decision
No new exercise types. Build 1 correct loop:

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
Assessable exercise needs:

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

Reflections require `is_scored: false`, `optional: true`, sensitive-data policy.

### 10.3 Runtime state
Record attempt: learner ID, course/node/exercise/concept IDs, response, correct/partial, misconception, attempt #, response time, scaffold, feedback shown, hint used, completion timestamp.

Per-learner concept state: exposures, successful retrievals, transfer tasks, consecutive errors, last seen, next due, current scaffold, mastery status.

Mastery = multiple obs, delayed retrieval, transfer task.

### 10.4 Lesson generator
One primary outcome + short arc:
1. **Retrieve:** 1 prior concept.
2. **Predict:** commit before explain.
3. **Model:** 1 bounded new idea.
4. **Guide:** discriminate/reconstruct with support.
5. **Apply:** realistic scenario.
6. **Produce:** short recall, explain, action.
7. **Consolidate:** interleave 1 due concept.
8. **Reflect:** optional personal.

### 10.5 Feedback pattern
Correct: Yes — mechanism explain.
Incorrect: Not quite — repair misconception — prompt retry.
After repeated error: Worked example + mechanism.

### 10.6 Mental-health and sleep guardrails
- Use "can", "often", "may". No universal diagnosis.
- No infer sleep stage from clock time alone.
- Separate education from clinical assess.
- Personal reflection optional/unscored. Skip paths.
- Factual modules need sleep-medicine review/citations.

## 11. Recommended Exercise Mix
For 7-interaction lesson:

| Action | Target | Examples |
| --- | ---: | --- |
| Brief model | 1 | cards, annotated diagram |
| Retrieval | 2 | short recall, reconstruction |
| Discrimination | 1 | close multiple choice, identify mistake |
| Application | 1–2 | scenario, prediction, cause/effect |
| Personal transfer | 0–1 | optional action plan |
| Self-report | 0–1 | only when instructionally useful |

Overused: multiple choice, true/false, rating, passive cards.
Underused: prediction, mistake ID, short recall, causal reconstruct, order mechanism, compare close cases, changed context, delayed review, action plan.

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
- typed response contract; exercise feedback; retry states; no advance on unresolved error; persist response; fix match/quiz; compute pass threshold.

#### Milestone 2 — Teachable Section 1
- clinical review claims; rewrite 9 nodes; observable outcomes; scored recall; checkpoint covers concepts; reflection optional; QA pass.

#### Milestone 3 — Retention loop
- concept state; due-review select; support adapt; delayed retrieve; transfer evidence.

#### Milestone 4 — Production optimization
- analytics; difficulty calibrate; misconception rate; retention check; A/B tests; accessibility/QA.

## 13. Verification Checklist

### Runtime
- [ ] Scored module return typed result.
- [ ] Feedback render from content.
- [ ] Wrong answers no advance.
- [ ] Retry change support.
- [ ] Attempts persist.
- [ ] Score + threshold computed.
- [ ] Reflection not affect mastery.

### Learning
- [ ] Outcome observable.
- [ ] Outcome aligned evidence.
- [ ] Concept retrieved delayed/transfer.
- [ ] Checkpoint cover concepts.
- [ ] Distractors map misconceptions.
- [ ] Answer not revealed by length.
- [ ] Difficulty rise by cognition.

### Safety
- [ ] Reviewer approve facts.
- [ ] Caffeine math correct.
- [ ] No universal cutoff.
- [ ] No clock time stage equation.
- [ ] Skip paths alcohol/personal.
- [ ] Mood data governance.

### Product evidence
- [ ] Events track attempt/retry/hint/feedback.
- [ ] Retention delay measured.
- [ ] Checkpoint valid per concept.
- [ ] Completion != mastery.
- [ ] Difficulty + distractor rates observable.
- [ ] Learner drop-off visible.

## 14. Definition of Done

Ready only when:
1. wrong answer → teach + retry;
2. evidence separate exposure/practice/mastery;
3. lesson progress observable capability;
4. core concept delayed retrieval + transfer;
5. checkpoint validate outcomes without disclosure;
6. sleep content clinical review;
7. test cover exercise contract + node lifecycle;
8. QA verify feedback, retry, progress, complete;
9. analytics answer if learn, not tap;
10. published lesson count = actual content.

Until then, decision = **REJECT**.

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
