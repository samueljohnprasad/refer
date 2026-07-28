# Output schema

Use this schema when the user requests machine-readable course output. Omit
unused optional fields. Keep IDs stable, lowercase, and hyphenated.

## Course

```yaml
course:
  id: string
  title: string
  learner:
    description: string
    prior_knowledge: [string]
    accessibility_needs: [string]
  outcome: string
  constraints:
    session_minutes: [minimum, maximum]
    sessions_per_week: number
    duration_weeks: number
    supported_exercise_types: [string]
  concepts:
    - id: string
      objective: string
      prerequisites: [concept-id]
      misconceptions: [string]
      mastery_evidence: [string]
  sections: [section]
  review_plan: [review-event]
  adaptation_rules: [adaptation-rule]
  motivation:
    milestones: [milestone]
    reminders_optional: true
    missed_day_policy: string
```

## Section and lesson

```yaml
section:
  id: string
  title: string
  outcome: string
  units:
    - id: string
      title: string
      outcome: string
      lessons:
        - id: string
          title: string
          outcome: string
          estimated_minutes: number
          new_concepts: [concept-id]
          review_concepts: [concept-id]
          exercises: [exercise]
          next_step: string
```

## Exercise

```yaml
exercise:
  id: string
  type: string
  phase: recall | model | guide | apply | reflect
  concept: concept-id | null
  prompt: string
  estimated_seconds: number
  support:
    level: full | partial | none
    hint: string | null
  response:
    options: [string]       # when applicable
    correct: string | number | boolean | null
  feedback:
    correct: string | null
    incorrect: string | null
  scoring:
    mode: objective | unscored
```

Use `unscored` for reflection, mood, journaling, and personal disclosure.

## Review event

```yaml
review_event:
  concept: concept-id
  after_lesson: lesson-id
  exercise_type: string
  support_level: full | partial | none
  reason: string
```

## Adaptation rule

```yaml
adaptation_rule:
  signal: string
  condition: string
  action: string
  safeguard: string
```

Define safeguards that prevent one response, accessibility need, or unscored
reflection from lowering a learner's path.

## Validation summary

```yaml
validation:
  objective_coverage: pass | needs_revision
  prerequisite_order: pass | needs_revision
  retrieval_coverage: pass | needs_revision
  session_budget: pass | needs_revision
  accessibility: pass | needs_revision
  safety: pass | needs_revision | not_applicable
  notes: [string]
```
