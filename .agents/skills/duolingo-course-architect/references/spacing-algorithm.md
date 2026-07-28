# Spacing Algorithm Reference

## Spaced Repetition Implementation for Course Design

---

## 1. Core Algorithm (Simplified Half-Life Regression)

Inspired by Duolingo's published research (Settles & Meeder, ACL 2016) and the
SM-2 algorithm family. The fixed intervals below are a product heuristic, not a
direct reproduction of either model. Tune them using learner data and course
cadence.

### Concept: Memory Half-Life

Every concept has a "half-life" — the time after which there's a 50% chance the user has forgotten it.

```
P(recall) = 2^(-t/h)

Where:
  t = time since last review
  h = memory half-life for this concept-user pair
```

### Simplified Implementation for Course Generation

Rather than real-time adaptive scheduling, use this **lesson-interval model** for course generation:

```yaml
spacing_intervals:
  # After introduction (first exposure)
  review_1: next_lesson # +1 lesson (immediate reinforcement)
  review_2: current + 3 # +3 lessons later
  review_3: current + 7 # +7 lessons later
  review_4: current + 14 # +14 lessons later
  review_5: current + 30 # +30 lessons later (if course is long enough)

  # On failure (user gets review wrong)
  failure_reset: next_lesson # Reset to +1 interval

  # On easy success (user answers instantly with high confidence)
  easy_advance: skip_one_interval # Jump ahead one step
```

### Visual Timeline

```
Lesson:  1  2  3  4  5  6  7  8  9  10  11  12  13  14  15 ...
         │
Concept  ■──R─────R─────────────R────────────────────────────R
A intro  │  │     │             │                             │
         │  +1    +3            +7                           +14
         │
Concept     ■──R─────R─────────────R
B intro     │  │     │             │
            │  +1    +3            +7
```

---

## 2. Scaffold Level Integration

Spaced repetition interacts with scaffolding. Reviews should test at the user's CURRENT scaffold level, not always at the same level.

```yaml
review_scaffold_progression:
  review_1: # +1 lesson
    scaffold_level: same_as_introduction # Reinforce at same level

  review_2: # +3 lessons
    scaffold_level: current + 1 # Slightly harder recall

  review_3: # +7 lessons
    scaffold_level: current + 1 # Push toward production

  review_4: # +14 lessons
    scaffold_level: 5 or 6 # Should be at free production/application by now

  review_5: # +30 lessons
    scaffold_level: 6 # Application in new context
```

**Example:**

- Lesson 3: Box breathing introduced at Level 1 (learn cards)
- Lesson 4 (review +1): Multiple choice at Level 2 ("Which describes box breathing?")
- Lesson 6 (review +3): Fill-in-blank at Level 3 ("Box breathing uses a **_-_**-**_-_** pattern")
- Lesson 10 (review +7): Timer exercise at Level 5 ("Do 3 rounds now")
- Lesson 17 (review +14): Scenario at Level 6 ("It's 11pm and you're anxious. What technique and why?")

---

## 3. Review Allocation Per Lesson

Each lesson has a **review budget**: 30% of exercises should be reviews.

### For a 10-exercise lesson:

- 7 exercises: Current topic (new content)
- 3 exercises: Review of prior concepts

### How to Select Which Concepts to Review:

Priority order (highest first):

1. **Failed concepts** — Anything the user got wrong in a previous session (immediate retry)
2. **Due for review** — Concepts whose interval has arrived (scheduled review)
3. **Related concepts** — Prerequisites or related concepts to today's new content (priming)
4. **Oldest unseen** — Concepts with longest gap since last review (prevent decay)

```python
def select_reviews(lesson_number, max_reviews=3):
    candidates = []

    # Priority 1: Failed in last session
    failed = get_concepts_failed_last_session()
    candidates.extend(failed)

    # Priority 2: Due for scheduled review
    due = get_concepts_due_for_review(lesson_number)
    candidates.extend(due)

    # Priority 3: Related to today's new content
    today_new = get_new_concepts(lesson_number)
    related = get_prerequisites(today_new)
    candidates.extend(related)

    # Priority 4: Oldest unseen
    oldest = get_concepts_sorted_by_last_seen(ascending=True)
    candidates.extend(oldest)

    # Deduplicate and take top N
    return deduplicate(candidates)[:max_reviews]
```

---

## 4. Interleaving Strategy

### Within-Lesson Interleaving

Don't cluster all review at the start or end. Weave it in:

```
Exercise 1:  REVIEW (warm-up, easy)
Exercise 2:  NEW (introduction)
Exercise 3:  NEW (recognition)
Exercise 4:  REVIEW (consolidation)
Exercise 5:  NEW (guided production)
Exercise 6:  NEW (peak difficulty)
Exercise 7:  REVIEW (interleave)
Exercise 8:  NEW (consolidation)
Exercise 9:  REVIEW (or NEW easy)
Exercise 10: NEW (cool-down)
```

### Cross-Lesson Interleaving

Within a unit covering multiple concepts, mix concepts across lessons:

```
Unit: "Evening Awareness" (3 concepts: A, B, C)

Lesson 1: Introduce A │ [A A A A A A A A A A]
Lesson 2: Introduce B │ [A B B B B B B B A B]  ← A reviewed
Lesson 3: Introduce C │ [B C C C C C C A B C]  ← A+B reviewed
Lesson 4: Practice    │ [A B C B A C B C A C]  ← All interleaved
Lesson 5: Checkpoint  │ [A B C A B C A B C -]  ← Equal distribution
```

---

## 5. Difficulty Adaptation Rules

### Per-Concept Tracking

```yaml
concept_state:
  id: "box_breathing"
  scaffold_level: 3 # Current level (1-6)
  times_seen: 5 # Total exposures
  times_correct: 4 # Correct responses
  accuracy: 0.80 # Running accuracy
  last_seen_lesson: 8 # Last lesson it appeared in
  next_review_lesson: 11 # When it's due next
  interval_step: 2 # Which interval we're on (0-4)
  consecutive_correct: 2 # For advancement decisions
  consecutive_wrong: 0 # For difficulty reduction
```

### Advancement Rules

```
IF consecutive_correct >= 2 AND accuracy >= 0.80:
  → Advance scaffold_level += 1
  → Advance interval_step += 1
  → Next review = current + intervals[interval_step]

IF consecutive_wrong >= 2:
  → Reduce scaffold_level -= 1 (never below 2)
  → Reset interval_step = 0
  → Next review = next_lesson

IF accuracy < 0.60 over last 3 exposures:
  → ALERT: Concept needs re-teaching
  → Schedule learn_cards re-introduction
  → Reset to scaffold_level = 1
```

---

## 6. Course-Level Spacing Map

When designing a full course, use this template to plan concept scheduling:

```
COURSE: "The Gentle Wind-Down" (30 lessons)

Concept Map:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Lesson:  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 ... │
│                                                                             │
│ NS_basics    ■  R  ·  R  ·  ·  R  ·  ·  ·  ·  ·  ·  R  ·  ·  ·  ...    │
│ Body_scan    ·  ■  R  ·  R  ·  ·  ·  R  ·  ·  ·  ·  ·  ·  R  ·  ...    │
│ Box_breath   ·  ·  ■  R  ·  R  ·  ·  ·  R  ·  ·  ·  ·  ·  ·  R  ...    │
│ Rumination   ·  ·  ·  ·  ■  R  ·  R  ·  ·  ·  R  ·  ·  ·  ·  ·  ...    │
│ Worry_time   ·  ·  ·  ·  ·  ·  ■  R  ·  R  ·  ·  ·  ·  R  ·  ·  ...    │
│ 478_breath   ·  ·  ·  ·  ·  ·  ·  ·  ■  R  ·  R  ·  ·  ·  ·  R  ...    │
│                                                                             │
│ Legend: ■ = Introduction, R = Review, · = Not present                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Constraints for Map:

- Max 3 reviews per lesson (don't overload)
- No concept should go unreviewed for more than 7 lessons after introduction
- At least 1 lesson gap between introduction and first review
- Checkpoint lessons (every 5th) should review ALL active concepts at assessment level

---

## 7. Review Exercise Selection

When a concept comes up for review, what exercise type to use depends on:

| Scaffold Level | Review Exercise Types                                    |
| -------------- | -------------------------------------------------------- |
| Level 2        | Multiple choice (easy distractors)                       |
| Level 3        | Multiple choice (hard distractors), True/False, Matching |
| Level 4        | Fill-in-blank, Ordering                                  |
| Level 5        | Free text, Timer exercise, Scenario (familiar context)   |
| Level 6        | Scenario (novel context), Application questions          |

**Rule:** Review exercises should be ONE scaffold level above where the concept was last successfully tested. This creates the "desirable difficulty" that strengthens memory.

---

## 8. Checkpoint Assessment Design

Every 4-6 lessons, a checkpoint assesses all concepts from that section:

```yaml
checkpoint:
  type: "assessment"
  concepts_tested: ["all concepts introduced in this section"]

  exercise_distribution:
    - 40% at user's current scaffold level (confirm mastery)
    - 30% at one level ABOVE current (test growth)
    - 30% at application level (transfer test)

  scoring:
    pass_threshold: 0.70 # 70% to pass checkpoint
    mastery_threshold: 0.90 # 90% for mastery badge

  on_pass:
    - Unlock next section
    - Award checkpoint badge
    - Show skills recap
    - Show mood comparison (start of section vs. now)

  on_fail:
    - Show which concepts need work
    - Schedule targeted review lessons
    - Encourage: "You're close! Let's strengthen a few areas."
    - Allow retry after 1 review lesson
```
