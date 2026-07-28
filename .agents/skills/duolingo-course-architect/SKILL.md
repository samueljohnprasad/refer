---
name: duolingo-course-architect
description: Design or revise gamified microlearning courses, curricula, learning paths, skill trees, lesson sequences, and exercise sets. Use for course architecture, curriculum mapping, lesson planning, scaffolding, spaced retrieval, interleaving, adaptive difficulty, exercise generation, checkpoints, progress systems, or retention loops in education and mental-health learning. Produces implementation-ready YAML when requested.
---

# Duolingo Course Architect

Build short, motivating courses around real learning transfer. Borrow useful
microlearning patterns without copying Duolingo branding, content, or product
mechanics.

## Read only what task needs

- Read [course-design-playbook.md](references/course-design-playbook.md) when
  designing or auditing a full course, section, unit, or lesson sequence.
- Read [exercise-taxonomy.md](references/exercise-taxonomy.md) when selecting or
  generating exercise types.
- Read [spacing-algorithm.md](references/spacing-algorithm.md) when scheduling
  review or specifying adaptive review logic.
- Read [psychology-principles.md](references/psychology-principles.md) when the
  user asks for behavioral rationale. Treat claims as hypotheses to verify, not
  settled product requirements.
- Read [output-schema.md](references/output-schema.md) before producing YAML.
- Use `courses/sleep-reset/` only as a structural example. Do not treat its
  health claims, wording, or parameters as authoritative.

## Workflow

### 1. Establish contract

Extract or infer:

- learner and prior knowledge
- observable course outcome
- domain and content boundaries
- session length, cadence, and total duration
- delivery constraints and supported interactions
- assessment, accessibility, safety, and localization needs
- desired artifact: outline, path, lesson, exercises, audit, or YAML

State consequential assumptions. Ask only when missing information would change
the architecture materially.

### 2. Build concept map

List atomic concepts and skills. For each, define:

- observable objective
- prerequisite concepts
- common misconception
- evidence of mastery
- suitable practice mode

Order by prerequisites and transfer value. Split concepts that cannot be taught
and practiced inside one short lesson.

### 3. Shape course

Use hierarchy:

```text
Course
  Section: coherent learning arc
    Unit: near-term capability
      Lesson: one primary outcome
        Exercise: one learner action
```

Prefer a clear primary path. Add optional remediation or challenge only when the
product supports adaptation.

Default lesson:

1. Recall: easy retrieval of prior learning.
2. Model: explain or demonstrate one new idea.
3. Guide: practice with support.
4. Apply: use idea in a realistic context.
5. Reflect: name takeaway or plan next use.

Keep defaults adjustable:

- 3-10 minutes per lesson
- 1 primary new concept; 2 only when tightly linked
- 4-10 exercises
- 20-40% retrieval of earlier material after enough material exists
- 3 or more interaction modes when supported and instructionally useful

Do not pad lessons to hit counts.

For detailed scaffolding ladders, lesson arcs, difficulty curves, sequencing,
mastery rules, and course checks, use
[course-design-playbook.md](references/course-design-playbook.md).

### 4. Plan retrieval and adaptation

Schedule each important concept for repeated retrieval across increasing
intervals. Interleave related concepts after learners can distinguish them.

Treat numeric targets as starting hypotheses:

- target success: roughly 75-90%
- easier first encounter
- more support after repeated errors
- less support after stable success

Never gate progress on one noisy score. Use multiple attempts or evidence types.
For exact review-state logic, use [spacing-algorithm.md](references/spacing-algorithm.md).

### 5. Design exercises

Match interaction to objective:

- recognition for early discrimination
- recall for retention
- ordering for procedures
- scenario for transfer
- creation or explanation for production
- reflection for personal meaning, never objective scoring

Write plausible distractors based on misconceptions. Give brief explanatory
feedback. Avoid trick questions and cosmetic variety.

For full type contracts, use
[exercise-taxonomy.md](references/exercise-taxonomy.md).

### 6. Add motivation ethically

Make progress legible and meaningful:

- show capability gained, not only points earned
- offer small milestones and useful next steps
- preserve progress after missed days
- make reminders and social features optional
- reward practice without crowding out intrinsic goals

Do not use shame, fake scarcity, punitive streak loss, misleading randomness,
forced social comparison, or mechanics designed to make leaving costly. Never
withhold needed health or safety content to manufacture return.

### 7. Validate

Check:

- Every lesson maps to an observable objective.
- Every objective receives practice and later retrieval.
- Prerequisites appear before dependent skills.
- Difficulty rises through scaffolding, not surprise.
- Exercise types fit cognitive work.
- Feedback teaches after errors.
- Estimates fit session budget.
- Completion reflects capability, not content exposure.
- Accessibility and localization constraints are explicit.
- Motivation mechanics remain optional, honest, and recoverable.

For mental-health content, also check:

- Use simple, non-diagnostic language.
- Separate psychoeducation from treatment.
- Do not score feelings, disclosures, or journaling as right or wrong.
- Cite evidence-based interventions when making clinical claims.
- Include escalation or professional-care guidance when scope requires it.
- Avoid promises of outcomes or substitution for care.

## Output

Match user request. For a full design, return:

1. assumptions
2. learner outcome
3. concept and prerequisite map
4. course path
5. lesson specifications
6. review plan
7. adaptation rules
8. motivation layer
9. validation notes

Use [output-schema.md](references/output-schema.md) for machine-readable YAML.
Keep rationale short unless user asks for research detail.
