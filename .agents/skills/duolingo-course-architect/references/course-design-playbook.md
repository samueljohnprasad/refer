# Course design playbook

Use this reference to turn a learning goal into a coherent microlearning course.
Treat numeric ranges as defaults to adapt, not universal requirements.

## Contents

1. [Course hierarchy](#1-course-hierarchy)
2. [Objectives and concept map](#2-objectives-and-concept-map)
3. [Sequencing](#3-sequencing)
4. [Scaffolding ladder](#4-scaffolding-ladder)
5. [Lesson arc](#5-lesson-arc)
6. [Difficulty curve](#6-difficulty-curve)
7. [Assessment and mastery](#7-assessment-and-mastery)
8. [Adaptation rules](#8-adaptation-rules)
9. [Motivation layer](#9-motivation-layer)
10. [Configurable course profile](#10-configurable-course-profile)
11. [Build sequence](#11-build-sequence)
12. [Quality checks](#12-quality-checks)
13. [Anti-patterns](#13-anti-patterns)
14. [Mental-health adaptation](#14-mental-health-adaptation)

## 1. Course hierarchy

Use each level for a distinct planning horizon:

| Level | Function | Typical scope |
| --- | --- | --- |
| Course | Identity and terminal capability | Weeks or months |
| Section | Coherent learning arc | Several units |
| Unit | Near-term capability | Several lessons |
| Lesson | One primary outcome | 3-10 minutes |
| Exercise | One learner action | 15-90 seconds |

Keep hierarchy only when product needs it. For a five-lesson course, sections
and units may add needless ceremony.

Define completion through demonstrated capability. Content exposure, time spent,
and points earned are not mastery.

## 2. Objectives and concept map

Write objectives with observable verbs:

- identify
- distinguish
- recall
- explain
- order
- apply
- create
- evaluate

Avoid vague objectives such as *understand*, *know*, or *learn* unless followed
by observable evidence.

For each concept, record:

```yaml
concept:
  id: phishing-sender-check
  objective: Distinguish a real sender domain from a lookalike domain.
  prerequisites: [email-address-parts]
  misconceptions:
    - A familiar display name proves sender identity.
  mastery_evidence:
    - Correctly classify varied sender examples.
    - Explain which address detail determined the choice.
```

Use prerequisites to create a directed concept graph. Resolve cycles by
splitting broad concepts or teaching a minimal shared foundation first.

Prioritize concepts by:

1. importance to terminal outcome
2. prerequisite centrality
3. frequency of real-world use
4. harm caused by misunderstanding
5. opportunity for repeated practice

## 3. Sequencing

Introduce foundations before dependent skills. Move from concrete examples to
abstract rules, then return to varied realistic contexts.

Use four sequencing moves:

1. **Model:** Show what good performance looks like.
2. **Contrast:** Compare close examples and misconceptions.
3. **Retrieve:** Ask learner to recall without rereading.
4. **Transfer:** Change surface details while preserving underlying skill.

Avoid teaching all of topic A before any topic B when learners must later
distinguish A from B. First teach each clearly, then interleave after
discrimination becomes possible.

Plan review across expanding gaps:

```text
Introduction
Short-gap retrieval
Medium-gap retrieval
Longer-gap retrieval
Transfer in a new context
```

Use [spacing-algorithm.md](spacing-algorithm.md) for scheduling mechanics.

## 4. Scaffolding ladder

Move from support to independent transfer:

### Level 1: Model

Present concept or demonstrate process. Require no scored response.

### Level 2: Easy recognition

Ask learner to identify correct example among clearly different alternatives.

### Level 3: Close discrimination

Use plausible distractors based on real misconceptions.

### Level 4: Guided production

Provide steps, word bank, partial solution, hint, or worked example.

### Level 5: Independent production

Ask learner to recall, explain, order, create, or perform without embedded
answer cues.

### Level 6: Contextual application

Apply skill to unfamiliar or realistic scenario containing irrelevant details.

Do not force every concept through all six levels. Choose levels needed by
objective. A factual label may stop at retrieval; a safety skill needs transfer.

Reduce support after stable evidence, not one lucky response. Restore support
after repeated errors. Never interpret an unscored reflection as failure.

## 5. Lesson arc

Use this emotional and cognitive arc when it fits:

| Phase | Purpose | Typical activity |
| --- | --- | --- |
| Recall | Activate prior learning and confidence | Easy retrieval |
| Model | Introduce one idea or process | Short explanation or demonstration |
| Guide | Practice with support | Recognition, ordering, guided action |
| Apply | Reach highest useful challenge | Scenario or independent response |
| Consolidate | Mix new and prior learning | Interleaved retrieval |
| Reflect | Name takeaway or next use | Unscored reflection |

For very short lessons, combine model with guide and apply with consolidate.

Lesson rules:

- Start with accessible work, not a trick.
- Introduce one primary concept; add a second only when tightly coupled.
- Make hardest exercise serve objective.
- Teach through feedback after errors.
- End with clarity and agency, not manufactured suspense.
- Estimate total interaction time, including reading and feedback.
- Split lesson if learner cannot complete it within session budget.

## 6. Difficulty curve

Raise difficulty by changing one or more levers:

1. reduce hints or answer cues
2. increase similarity of distractors
3. add steps or interacting concepts
4. vary context and surface features
5. require explanation or production
6. delay retrieval
7. add time pressure only when speed belongs to real skill

Increase difficulty within a coherent arc. At section boundaries, use retrieval
and integration before introducing another large jump.

```text
difficulty
    rising practice      rising practice
       /----\               /----
  ----      \review---------
       section boundary
```

Do not confuse longer copy, obscure wording, or tricky options with productive
difficulty.

## 7. Assessment and mastery

Align assessment with objective:

| Objective | Strong evidence |
| --- | --- |
| Identify | Classification across varied examples |
| Recall | Uncued or lightly cued retrieval |
| Explain | Accurate causal explanation |
| Perform | Correct ordered action |
| Apply | Success in new scenario |
| Create | Artifact meeting explicit criteria |

Use several observations where consequences matter. Separate:

- practice feedback
- lesson completion
- concept mastery
- course outcome

Do not make every exercise scored. Models, reflections, mood checks, journaling,
and personal disclosure should usually be unscored.

Possible mastery model:

```yaml
mastery:
  required_evidence:
    - two successful retrievals
    - one delayed retrieval
    - one transfer task
  recovery:
    repeated_error: restore-support
    isolated_error: explain-and-continue
```

## 8. Adaptation rules

Use transparent, recoverable actions:

| Signal | Adaptation |
| --- | --- |
| Repeated error on same misconception | Show contrast and worked example |
| Slow but correct response | Keep concept; remove time pressure |
| Fast stable success | Reduce support or widen context |
| Errors after long delay | Schedule nearer review |
| Accessibility conflict | Change interaction, not mastery judgment |
| Learner opts out | Preserve progress and offer alternate path |

Do not lower path because learner skips reflection, declines disclosure, uses
assistive technology, or needs more reading time.

## 9. Motivation layer

Prefer signals tied to learning:

- capability gained
- concepts retained
- meaningful milestone reached
- personal goal advanced
- next useful action available

Points, streaks, badges, reminders, and social comparison are optional product
mechanics. Evaluate them against autonomy, accessibility, and user well-being.

### Honest progress

Show both distance travelled and distance remaining:

- capability or lessons completed
- current location in course
- lessons until next meaningful checkpoint
- next available action

After an interruption, offer to continue from saved location. After a completed
session, show an optional next lesson without creating fake urgency or implying
learner should continue immediately.

Count only earned progress:

- Credit onboarding as Lesson 1 only when learner completed real instruction or
  practice.
- Use placement results to skip mastered material only when assessment supports
  that inference.
- Never initialize progress at an arbitrary percentage to manufacture momentum.
- Preserve completed work after missed days or course pauses.

Good recovery language preserves prior effort:

```text
You missed a day. Your learning is still here. Continue when ready.
```

Avoid:

- shame or threat
- fake scarcity
- punitive streak destruction
- rewards that hide needed content
- random reinforcement presented as educational value
- forced public commitment
- making exit or rest feel costly

## 10. Configurable course profile

Record design defaults before generating lessons. Treat ranges as starting
points and explain meaningful deviations.

```yaml
course_profile:
  path:
    default: linear
    remediation_optional: true
    challenge_optional: true
  lesson:
    duration_minutes: [5, 15]
    primary_new_concepts: 1
    maximum_new_concepts: 2
    target_success_range: [0.75, 0.90]
    review_share_range: [0.20, 0.40]
    reflection: optional
    next_step: optional
  checkpoints:
    interval_lessons: [4, 6]
    purpose: retrieval-and-integration
  exercises:
    minimum_types: null
    selection_rule: match-objective
  completion:
    required_reward: capability-progress
    points_or_xp: optional
```

Do not enforce profile mechanically:

- Short courses may need no sections or checkpoints.
- First lessons should be accessible, but need not guarantee correctness.
- Review share depends on how much prior content exists.
- One interaction type may be enough for a narrow objective.
- Reflection belongs where personal meaning or planning helps.
- Checkpoints may be harder or easier depending on assessment purpose.
- Course difficulty should deepen capability; review lessons may intentionally
  be easier.

## 11. Build sequence

For a new course:

1. Define learner, terminal outcome, and boundaries.
2. List observable subskills and misconceptions.
3. Map prerequisites.
4. Group concepts into sections and units only where useful.
5. Assign one primary outcome per lesson.
6. Choose practice and assessment evidence.
7. Add delayed retrieval and transfer.
8. Set adaptation rules.
9. Add optional motivation layer.
10. Validate coverage, time, accessibility, and safety.
11. Generate YAML only after architecture holds.

For a single lesson:

1. Read course position and prior concepts.
2. Select new and review concepts.
3. Set observable lesson outcome.
4. Choose scaffold entry and exit levels.
5. Build lesson arc.
6. Estimate duration.
7. Write feedback.
8. Verify next review placement.

## 12. Quality checks

### Lesson

- First activity is accessible.
- Primary outcome is observable.
- Every exercise serves outcome or retrieval.
- New concepts fit cognitive budget.
- Support decreases deliberately.
- Distractors reflect misconceptions.
- Feedback explains, not merely marks.
- Hardest task tests useful transfer.
- Reflection is unscored.
- Duration includes reading and feedback.
- Ending communicates earned progress and an optional next action.

### Course

- Terminal outcome is specific.
- Every lesson contributes to terminal outcome.
- Prerequisites precede dependent concepts.
- Important concepts receive delayed retrieval.
- Interleaving follows initial discrimination.
- Difficulty grows through cognition, not wording.
- Section boundaries consolidate learning.
- Mastery uses more than content exposure.
- Adaptation rules are recoverable.
- Motivation mechanics preserve autonomy.
- Progress shows completed work and remaining distance honestly.
- Accessibility and localization constraints are explicit.
- Health or safety claims have appropriate evidence and scope.

## 13. Anti-patterns

| Anti-pattern | Replace with |
| --- | --- |
| Card deck labeled as course | Retrieval and application |
| Same interaction repeated | Objective-matched practice |
| Arbitrary exercise variety | Different cognitive actions |
| Difficulty spike | Scaffolded progression |
| Review bolted onto final quiz | Retrieval across lessons |
| 100% accuracy gate | Multiple evidence over time |
| Longer lesson means harder | Deeper reasoning or transfer |
| Reflection scored as correct | Unscored meaning-making |
| Badge for every action | Meaningful capability milestone |
| Harsh streak loss | Progress-preserving recovery |
| Arbitrary head-start progress | Credit only completed learning |
| Endless next-lesson pressure | Optional next action and clean stopping point |
| Fixed course for every learner | Support and pacing adaptation |
| Clinical promise | Bounded psychoeducation |

## 14. Mental-health adaptation

Use additional safeguards:

- Use simple, literal, non-diagnostic language.
- Treat lived experience as context, not answer key.
- Do not mark feelings or personal disclosures wrong.
- Treat mood checks as sensitive self-report, not clinical measurement, unless
  using a validated instrument with appropriate governance.
- Teach evidence-based skills with appropriate citations.
- Separate psychoeducation, self-guided practice, and treatment.
- Offer choice before emotionally intense prompts.
- Avoid pressure to disclose trauma or symptoms.
- Let learner pause without losing progress.
- End activating lessons with grounding and clear next steps.
- Include professional or emergency support guidance when content scope requires
  it.

Adapt scaffolding:

1. Present brief psychoeducation.
2. Identify pattern in neutral scenario.
3. Distinguish close patterns.
4. Practice technique with guidance.
5. Practice independently.
6. Apply voluntarily in personal context.

Progress may mean recognition, flexible coping, or behavior change. Never define
progress only as symptom reduction, streak length, or positive mood.
