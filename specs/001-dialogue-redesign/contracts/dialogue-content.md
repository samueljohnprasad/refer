# Contract: DialogueContent (exercise.content)

**Type**: Exercise content schema (runtime + content authoring)
**Used by**: `DialogueCategoryEngine`, `validateDialogueContent`, seed SQL

---

## Schema

```typescript
interface DialogueContent {
  title: string;         // ≤7 words
  instruction: string;   // ≤12 words
  beats: DialogueBeat[]; // 2–4 items
  insight: string;       // shown after last beat
}

type DialogueBeat = PassiveBeat | DecisionBeat;

interface PassiveBeat {
  id: string;            // stable, unique within exercise
  type: "passive";
  speaker: string;
  side: "left" | "right";
  message: string;
  historySummary: string; // short label for Earlier row
}

interface DecisionBeat {
  id: string;
  type: "decision";
  speaker: string;
  side: "left" | "right";
  message: string;
  historySummary: string;
  options: DialogueOption[]; // 2–3 items
}

interface DialogueOption {
  id: string;      // stable, unique within beat
  label: string;
  feedback: string; // non-shaming explanation of likely effect
}
```

---

## Validation invariants

| Rule | Error message |
|------|---------------|
| `beats.length < 2` | "Dialogue must have at least 2 beats." |
| `beats.length > 4` | "Dialogue must have at most 4 beats." |
| Decision beats count > 2 | "Dialogue must have at most 2 decision beats." |
| Duplicate beat ID | `"Duplicate beat id \"<id>\"."` |
| Missing beat ID | "Beat id must be a non-empty string." |
| Decision beat options < 2 | "Decision beat must have at least 2 options." |
| Decision beat options > 3 | "Decision beat must have at most 3 options." |
| Duplicate option ID within beat | `"Duplicate option id \"<id>\" in beat \"<beatId>\"."` |

---

## DialogueResponse (saved state schema)

```typescript
interface DialogueResponse {
  format: "dialogue";
  phase: "active" | "complete";
  beatIndex: number;
  selectedOptionIds: Record<string, string>; // beatId → optionId
  isCorrect: true;
}
```

No therapeutic text — only IDs and enum phase are stored.
