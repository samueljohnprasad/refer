# Exercise System Architecture

## Overview

The unified exercise system supports **36 CBT/mindfulness exercises** across **12 categories**, all driven by a single registry, shared step primitives, and a generic flow screen.

---

## Directory Structure

```
src/
├── types/exerciseFlow.ts          # All types: ExerciseType, configs, responses, step defs
├── data/exerciseRegistry.ts       # Master registry with lookup helpers
├── exercises/<name>/config.ts     # Per-exercise config (36 files)
├── hooks/
│   ├── useExerciseFlow.ts         # Step navigation, validation, save payload
│   ├── useExerciseMutation.ts     # Upsert to exercise_entries table
│   ├── useExerciseQuery.ts        # Fetch single entry or history
│   └── useExerciseAI.ts           # Gemini AI suggestions per step
├── components/exercise/steps/     # 17 reusable step primitives + barrel
│   ├── StepLayout.tsx             # Shared layout (header, nav, keyboard, haptics)
│   ├── IntroStep.tsx
│   ├── TextInputStep.tsx
│   ├── SliderStep.tsx
│   ├── MultiTextInputStep.tsx
│   ├── ChoiceStep.tsx
│   ├── MultiChoiceStep.tsx
│   ├── BooleanStep.tsx
│   ├── AcknowledgeStep.tsx
│   ├── CountdownTimerStep.tsx
│   ├── BreathingTimerStep.tsx
│   ├── ChecklistStep.tsx
│   ├── TimePickerStep.tsx
│   ├── AITextInputStep.tsx
│   ├── SummaryStep.tsx
│   ├── RecordMapStep.tsx
│   ├── MultiFieldStep.tsx
│   ├── PlaceholderStep.tsx
│   └── index.ts                   # Barrel export
├── screens/
│   └── ExerciseFlowScreen/
│       └── ExerciseFlowScreen.tsx  # Generic shell rendering any exercise
└── utils/
    └── exerciseJourneyBridge.ts   # Optional bridge for journey integration

app/tabs/
├── screens/exercise-flow.tsx      # Route wrapper (reads ?type, ?entryId, ?readOnly)
└── _layout.tsx                    # Stack.Screen registered with slide_from_bottom
```

---

## Data Flow

```
User taps exercise card
  → router.push('/tabs/screens/exercise-flow?type=box_breathing')
  → exercise-flow.tsx reads params, lazy-loads ExerciseFlowScreen
  → ExerciseFlowScreen:
      1. getExerciseConfig(type)         → config with steps[]
      2. useExerciseFlow(config, entry?) → step state, navigation, validation
      3. useExerciseMutation()           → save(payload, id?)
      4. useExerciseAI(step.ai?)         → AI suggestions
      5. Renders config.steps[currentStepIndex].component with StepProps
```

---

## Categories (12)

| Category        | Count | Key               |
| --------------- | ----- | ----------------- |
| CBT Core        | 7     | `cbt_core`        |
| Mindfulness     | 5     | `mindfulness`     |
| Anxiety         | 4     | `anxiety`         |
| Overthinking    | 4     | `overthinking`    |
| Sleep           | 4     | `sleep`           |
| DBT Skills      | 4     | `dbt`             |
| ACT             | 2     | `act`             |
| Self-Compassion | 2     | `self_compassion` |
| Self-Esteem     | 1     | `self_esteem`     |
| Anger           | 1     | `anger`           |
| Productivity    | 1     | `procrastination` |
| Relationships   | 1     | `relationships`   |

---

## Key Interfaces

- **`ExerciseConfig<T>`** — defines type, category, title, icon, steps[], initialResponse, schemaVersion
- **`ExerciseStepDef<T>`** — id, component, label, validate(), optional next(), ai?, timerConfig?
- **`StepProps<T>`** — response, onUpdate, onNext, onBack, progress, aiSuggestions, etc.
- **`ExerciseSavePayload`** — what gets upserted to `exercise_entries`
- **`ExerciseEntry`** — DB row shape

---

## Step Primitives

Each primitive extends `StepProps` and renders inside `StepLayout` which provides:

- `StepHeader` (progress bar, title, subtitle)
- `StepNavigation` (back/next with double-tap guard + haptics)
- Keyboard dismiss on background tap
- `KeyboardAvoidingView` on iOS
- Optional `ScrollView` wrapping

---

## Database

Table: `exercise_entries` (with RLS, indexes, updated_at trigger)

| Column          | Type        |
| --------------- | ----------- |
| id              | uuid PK     |
| user_id         | uuid FK     |
| exercise_type   | text        |
| schema_version  | int         |
| status          | text        |
| current_step    | text        |
| completed_steps | jsonb       |
| step_index      | int         |
| response        | jsonb       |
| step_timings    | jsonb       |
| selected_date   | date        |
| completed_at    | timestamptz |
| created_at      | timestamptz |
| updated_at      | timestamptz |

---

## Adding a New Exercise

1. Add type to `ExerciseType` union in `exerciseFlow.ts`
2. Define response interface (e.g. `MyNewResponse`)
3. Add to `ExerciseResponseMap`
4. Create `src/exercises/myNew/config.ts` with `ExerciseConfig<MyNewResponse>`
5. Import + add to `ALL_CONFIGS` in `exerciseRegistry.ts`
6. Done — it auto-appears in Discover tab and works with the flow screen
