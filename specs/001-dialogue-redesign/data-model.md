# Data Model: Dialogue Exercise Redesign

**Phase**: 1 | **Date**: 2026-08-24

---

## Entities

### DialogueBeat (passive)

| Field        | Type              | Constraints                     |
|--------------|-------------------|---------------------------------|
| `id`         | string            | Stable, globally unique, non-empty |
| `speaker`    | string            | Non-empty display name          |
| `side`       | `"left" \| "right"` | Positioning                   |
| `message`    | string            | Non-empty message text          |
| `type`       | `"passive"`       | Discriminant                    |
| `historySummary` | string       | Short label used in Earlier row |

### DialogueBeat (decision)

Extends passive with:

| Field        | Type                  | Constraints                       |
|--------------|-----------------------|-----------------------------------|
| `type`       | `"decision"`          | Discriminant                      |
| `options`    | `DialogueOption[]`    | Length 2–3                        |

### DialogueOption

| Field       | Type    | Constraints                |
|-------------|---------|----------------------------|
| `id`        | string  | Stable, unique within beat |
| `label`     | string  | Non-empty                  |
| `feedback`  | string  | Non-punitive response text |

### DialogueContent (exercise.content)

| Field       | Type             | Constraints                       |
|-------------|------------------|-----------------------------------|
| `title`     | string           | ≤ 7 words                         |
| `instruction` | string         | ≤ 12 words                        |
| `beats`     | `DialogueBeat[]` | Length 2–4                        |
| `insight`   | string           | Shown after last beat is revealed |

**Validation rules:**
- `beats.length` MUST be 2–4.
- Decision beats count: MUST be ≤ 2.
- Each beat `id` MUST be unique within the exercise.
- Each option `id` MUST be unique within its beat.
- `options.length` on decision beats MUST be 2–3.
- `historySummary` MUST be non-empty on all beats.

---

### DialogueResponse (saved state)

| Field              | Type                        | Notes                                    |
|--------------------|-----------------------------|------------------------------------------|
| `format`           | `"dialogue"`                | Constant discriminant                    |
| `phase`            | `"active" \| "complete"`   | `complete` when last beat is passed      |
| `beatIndex`        | number                      | 0-based; clamped to `beats.length - 1`  |
| `selectedOptionIds`| `Record<string, string>`    | Map of beat ID → chosen option ID        |
| `isCorrect`        | `true`                      | Always true (non-scored exercise)        |

**State transitions:**

```
beatIndex=0, phase="active"
  → tap "Next message" on passive beat → beatIndex++
  → tap option on decision beat → selectedOptionIds[beatId]=optionId, ready=true (unchosen options vanish)
  → tap "Next message" → beatIndex++
  → beatIndex === beats.length - 1, phase="active"
  → tap "Continue" → phase="complete", ready=true (final Continue fires)
  → Note: "Skip for now" remains active in all states above until feedback/complete.
```

**Restore rules:**
- If `beatIndex >= beats.length`: clamp to `beats.length - 1`, phase stays `"active"`.
- If `phase === "complete"` but `beatIndex < beats.length - 1`: repair to `beatIndex = beats.length - 1`, phase `"active"`.
- `selectedOptionIds` keys not referencing a known decision beat ID are ignored.

---

## Earlier Summary Logic

```
visibleBeats:
  if beatIndex <= 1:
    fullBubbles: beats[0..beatIndex]
    earlierSummary: none
  else:
    fullBubbles: beats[beatIndex-1], beats[beatIndex]
    earlierSummary: single row summarising beats[0..beatIndex-2]
```

Earlier row label: `"Earlier"` + concatenated `historySummary` of collapsed beats, separated by `" · "`.
