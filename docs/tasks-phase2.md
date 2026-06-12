# Phase 2 Tasks — CBT Exercises V2: Polish

> **Goal:** Make exercises beautiful, clinically richer, and remove friction for users in distress.
> **Timeline:** ~4 weeks
> **Reference:** `docs/prd-cbt-exercises-v2.md` § Phase 2 (5.5–5.9)
> **Prerequisite:** Phase 1 complete ✓

---

## Track A: Thought Reframing UI Redesign (P1)

### ✅ TASK-015 — Elevate Thought Reframing to custom step components

**Files to create:**

- `src/exercises/thoughtReframing/customSteps.tsx`

**Files to modify:**

- `src/exercises/thoughtReframing/config.ts`

**Background:**
ABC Analysis has beautiful custom Duolingo-style steps (`src/exercises/abcAnalysis/customSteps.tsx`) — 3D cards, suggestion pickers, emoji accents, helper tips, inline PrimaryButton. Thought Reframing is the app's clinically deepest exercise but uses generic step components. This task brings it up to the same visual quality.

The existing `ThoughtReframingScreen/` (legacy screen at `src/screens/ThoughtReframingScreen/`) has reusable components we can leverage:

- `DistortionCard` — `src/screens/ThoughtReframingScreen/components/DistortionCard.tsx`
- `EmotionChip` — `src/screens/ThoughtReframingScreen/components/EmotionChip.tsx`
- `VoiceTextInput` — `src/screens/ThoughtReframingScreen/components/VoiceTextInput.tsx`
- `COGNITIVE_DISTORTIONS` data — `src/screens/ThoughtReframingScreen/data/cognitiveDistortions.ts`
- `EMOTION_OPTIONS` data — `src/screens/ThoughtReframingScreen/data/emotions.ts`

The new `customSteps.tsx` should use the existing `StepProps<ThoughtReframingResponse>` interface and work within the `ExerciseFlowScreen` runner, NOT the legacy ThoughtReframingScreen.

**Steps to redesign (7 content steps):**

**Step 1 — Situation** (`id: "situation"`)

- Replace generic `TextInputStep` with custom layout
- Use `VoiceTextInput` instead of plain `TextInput` (voice already wired via `useAudioRecording` + `useTranscribeAudio`)
- Add helper card: "Describe only what happened — not what you thought or felt. Just facts a camera could record."
- Design: same layout as `ABCActivatingEventStep` (Header → title/subtitle → helper tip → VoiceTextInput → Continue button)

**Step 2 — Automatic Thought** (`id: "automatic_thought"`)

- Use `VoiceTextInput`
- Add helper tip: "Write the exact thought, word for word. Even if it sounds dramatic — especially then."
- 3 quick-pick suggestion cards (tappable, fill the field):
  - `{ label: "I'm not good enough", emoji: "😔" }`
  - `{ label: "This is going to go badly", emoji: "😟" }`
  - `{ label: "They don't like me", emoji: "😞" }`

**Step 3 — Initial Intensity** (`id: "intensity"`)

- Keep `SliderStep` — no custom step needed here

**Step 4 — Emotions** (`id: "emotions"`)

- Replace `MultiChoiceStep` with custom layout using existing `EmotionChip` component
- Import `EMOTION_OPTIONS` from `src/screens/ThoughtReframingScreen/data/emotions.ts`
- Show chips in a `flexWrap` row layout
- Show AI suggestions with a "Suggested" label chip above the grid
- Max 3 selections enforced with disabled state on remaining chips once 3 reached
- Helper tip: "Name what you felt in that moment. You can select up to 3."

**Step 5 — Cognitive Distortions** (`id: "distortions"`)

- Replace `MultiChoiceStep` with custom layout using existing `DistortionCard` component
- Import `COGNITIVE_DISTORTIONS` from `src/screens/ThoughtReframingScreen/data/cognitiveDistortions.ts`
- AI-suggested distortions float to the top with a "🤖 AI detected" badge
- Max 2 selections
- Helper tip: "These are thinking patterns the mind falls into under stress. Pick the ones that feel familiar."
- Each `DistortionCard` already shows label + description + example — great clinical depth built in

**Step 6 — Evidence For** (`id: "evidence_for"`)

- Use `VoiceTextInput`-powered multi-item entry (type/speak, tap + to add)
- Helper tip: "Even if the evidence feels flimsy, write it. We're looking at ALL the data."
- Can have 0 items (optional)

**Step 7 — Evidence Against** (`id: "evidence_against"`)

- Same pattern as Evidence For
- Helper tip: "Your brain's threat system actively ignores evidence against feared thoughts. This step fights that bias."
- Highlight that if the list is shorter than Evidence For, gently note: "Our anxious minds often see more against us than for us. That's the bias we're working with."

**Step 8 — Balanced Thought** (`id: "balanced_thought"`)

- Custom layout with `VoiceTextInput` plus AI suggestion cards
- AI suggestions displayed as styled cards with text + rationale (same pattern as `ABCAlternativeBeliefStep`)
- Helper tip: "A balanced thought doesn't have to be positive. It just needs to be more fair and accurate than the original."
- Sage-pill card styling for selected AI suggestion

**Step 9 — Re-evaluate** (`id: "re_evaluate"`)

- Keep `SliderStep` — no custom step needed

**In config.ts:**

- Replace the 7 `createStep(TextInputStep/MultiChoiceStep/AITextInputStep, ...)` calls with `createStep(ThoughtReframingXxxStep, {})` using the new custom steps
- Intensity and re-evaluate slider steps remain unchanged

**Acceptance criteria:**

- [ ] All 7 content steps use custom layouts matching ABC Analysis visual quality
- [ ] `VoiceTextInput` present on all text-entry steps
- [ ] Emotion chips render in color-coded flexWrap grid
- [ ] Distortion cards show icon + description + example (reusing existing `DistortionCard`)
- [ ] AI suggestions styled as tappable cards (not dropdown/generic list)
- [ ] No regression: exercise still completes, saves, and loads correctly

---

## Track B: Psychoeducation Micro-Cards (P1)

### ✅ TASK-016 — Create PsychoeducationCard component

**File (new):** `src/components/exercise/PsychoeducationCard.tsx`

**What it does:** An expandable "Why this helps →" card that sits below the step subtitle. Collapsed by default. Expands inline on tap to show 1-2 sentences of clinical insight.

**Props:**

```typescript
interface PsychoeducationCardProps {
  content: string;
  className?: string;
}
```

**Design spec — collapsed state:**

```
Why this helps  →
(sage-700, 13px, underlined or with chevron-right icon)
```

**Design spec — expanded state:**

```
┌─────────────────────────────────────────┐
│ 💡  "Naming your thinking traps makes   │
│     them easier to spot next time.       │
│     Like learning to recognize a        │
│     magician's tricks."          ▲ Less │
└─────────────────────────────────────────┘
```

- Background: `bg-sage-50`, border `border-sage-200/50`, `rounded-2xl`, `p-4`
- Expand/collapse with `LayoutAnimation` (smooth height change)
- Collapsed trigger: small `Text` with `ChevronRight01Icon` from HugeIcons
- Expanded: shows `Idea01Icon` + text + "Less ▲" collapse trigger
- Non-blocking — user never has to interact with it to proceed
- Renders between subtitle and the main step content

**Acceptance criteria:**

- [ ] Tap to expand, tap to collapse
- [ ] Smooth animation (no jump)
- [ ] Accessible (`accessibilityRole="button"` on trigger, `accessibilityHint="Expand to learn why this step helps"`)
- [ ] Invisible when `content` is empty string

---

### ✅ TASK-017 — Add `psychoeducationText` prop to step components and wire content

**Files to modify:**

- `src/components/exercise/steps/TextInputStep.tsx`
- `src/components/exercise/steps/MultiTextInputStep.tsx`
- `src/components/exercise/steps/SliderStep.tsx`
- `src/components/exercise/steps/MultiChoiceStep.tsx`
- Exercise configs listed below

**What:** Add optional `psychoeducationText?: string` prop to `TextInputStep`, `MultiTextInputStep`, `SliderStep`, and `MultiChoiceStep`. When provided, render `<PsychoeducationCard content={psychoeducationText} />` between the `StepHeader` (title/subtitle) and the main step content. Placement is inside `StepLayout` children, after the `ValidationMessage`.

**In StepLayout:** `StepLayout` receives children — the card goes in at the top of children, so each step component renders it first before its own content. Add to each component's render output between `ValidationMessage` and the input/slider.

**Psychoeducation content to wire (pass as `psychoeducationText` via `createStep`):**

| Exercise               | Step ID                | Content                                                                                                                               |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Thought Reframing      | `distortions`          | "Naming your thinking traps makes them easier to spot next time. Like learning to recognise a magician's tricks."                     |
| Thought Reframing      | `evidence_against`     | "Your brain's threat system actively ignores positive evidence. This step forces it to look at the full picture."                     |
| Thought Reframing      | `re_evaluate`          | "After reframing, your belief score often drops. That shift is real — it means your rational mind just got louder."                   |
| Decatastrophizing      | `probability`          | "Anxiety inflates probability estimates. Explicitly rating likelihood activates your rational brain and deflates the fear."           |
| Decatastrophizing      | `time_perspective`     | "Anxiety narrows your time horizon to right now. Most feared events feel far smaller after just one week."                            |
| Decatastrophizing      | `coping_plan`          | "Having a plan reduces anxiety even if you never use it. Your brain settles when it knows you have a response ready."                 |
| Worry Decision Tree    | `can_I_act`            | "Around 80% of worries are about things outside our control. Sorting them is the first step to letting them go."                      |
| Fear Ladder            | `plan_exposure`        | "Each safe exposure updates your brain's threat map. Anxiety decreases predictably with repetition — it's not courage, it's science." |
| Worry Time             | `set_worry_time`       | "Postponing worry to a fixed window breaks the habit of constant background worrying that drains energy all day."                     |
| ABC Analysis           | `belief`               | "The same event can trigger completely different emotions depending on the belief attached to it. Beliefs are changeable."            |
| ABC Analysis           | `alternative_belief`   | "A balanced belief doesn't have to be positive. It just needs to be more accurate and less absolute than the original."               |
| Recognizing Rumination | `theme_identification` | "Naming the theme of a thought loop creates distance from it. You shift from being inside it to observing it."                        |
| Detached Mindfulness   | `label_it`             | "Labelling a thought as 'a thought' weakens its grip. The thought doesn't change — your relationship to it does."                     |
| Attention Training     | `sound_1`              | "Self-focused attention maintains anxiety. Training your attention to move outward interrupts the anxiety cycle at its source."       |

**Acceptance criteria:**

- [ ] `PsychoeducationCard` renders for all 14 configured steps
- [ ] Collapsed by default — users who don't want it can ignore it
- [ ] Does not add required taps or block flow
- [ ] No card renders when `psychoeducationText` is undefined

---

## Track C: Coping Card Deck (P1)

### ✅ TASK-018 — Define CopingCard data model and Supabase table

**Files to modify:**

- `src/types/exerciseFlow.ts` (add `CopingCard` interface)
- Supabase migration (new `coping_cards` table)

**TypeScript interface (add to `exerciseFlow.ts`):**

```typescript
export interface CopingCard {
  id: string;
  user_id: string;
  exercise_type: ExerciseType;
  exercise_entry_id?: string;
  original_thought?: string;
  reframe_text: string;
  reframe_label: string;
  starred: boolean;
  archived: boolean;
  created_at: string;
}
```

**Supabase table schema:**

```sql
create table coping_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_type text not null,
  exercise_entry_id uuid references exercise_entries(id) on delete set null,
  original_thought text,
  reframe_text text not null,
  reframe_label text not null default 'Your reframe',
  starred boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

alter table coping_cards enable row level security;
create policy "Users manage own coping cards"
  on coping_cards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

**Acceptance criteria:**

- [ ] `CopingCard` type exported from `src/types/exerciseFlow.ts`
- [ ] Supabase table created with RLS enabled
- [ ] Table accessible only to the owning user

---

### ✅ TASK-019 — Create useCopingCards hook

**File (new):** `src/hooks/useCopingCards.ts`

**What:** React Query hook for fetching, saving, starring, and archiving coping cards.

**Interface:**

```typescript
interface UseCopingCardsReturn {
  cards: CopingCard[];
  isLoading: boolean;
  saveCard: (
    card: Omit<
      CopingCard,
      "id" | "user_id" | "created_at" | "starred" | "archived"
    >,
  ) => Promise<CopingCard>;
  toggleStar: (id: string) => Promise<void>;
  archiveCard: (id: string) => Promise<void>;
  unarchiveCard: (id: string) => Promise<void>;
}
```

**Implementation details:**

- Use `@tanstack/react-query` (already used throughout the app — see `useExerciseMutation.ts` for pattern reference)
- Query key: `['coping_cards']`
- `saveCard` optimistically adds to cache before server round-trip
- `toggleStar` / `archiveCard` optimistically mutate in cache
- Filter out archived cards by default (show active cards only); archived accessible via `showArchived` param

**Acceptance criteria:**

- [ ] `useQuery` fetches cards sorted by `created_at DESC`
- [ ] `saveCard` inserts and invalidates query cache
- [ ] Optimistic updates — UI updates immediately, rolls back on error
- [ ] Hook re-exports correct TypeScript types

---

### ✅ TASK-020 — Wire "Save as coping card" into DynamicSummary

**Files to modify:**

- `src/components/exercise/steps/createDynamicSummaryStep.tsx`
- `src/components/exercise/DynamicSummary.tsx`

**What:** The `DynamicSummary` already has an `onSaveCopingCard` prop and renders a "Save as coping card" button. Currently the handler is not wired up — it's undefined. This task makes it functional.

**In `createDynamicSummaryStep.tsx`:**

1. Import `useCopingCards` hook
2. Call `useCopingCards()` to get `saveCard`
3. Build `handleSaveCopingCard`:
   ```typescript
   const handleSaveCopingCard = async () => {
     const takeaway = Array.isArray(keyTakeaway) ? keyTakeaway[0] : keyTakeaway;
     if (!takeaway?.trim()) return;
     await saveCard({
       exercise_type: opts.exerciseType,
       exercise_entry_id: undefined,
       original_thought: undefined,
       reframe_text: takeaway,
       reframe_label: opts.keyTakeawayLabel ?? "Your reframe",
     });
     // Show brief confirmation
     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
   };
   ```
4. Pass `onSaveCopingCard={handleSaveCopingCard}` to `DynamicSummary`

**Button state changes:** After saving, the button should change to "Saved ✓" (disabled) for the remainder of the session. Track with local `useState<boolean>` in the step component.

**Exercises where coping card save applies** (has `keyTakeawayKey` defined):

- `thought_catcher` (balanced thought)
- `thought_reframing` (balanced thought)
- `abc_analysis` (alternative belief)
- `decatastrophizing` (coping plan)
- `worry_decision_tree` (action plan)
- `fear_ladder` (habituation insight)
- `detached_mindfulness` (observed thought)

**Acceptance criteria:**

- [ ] Tapping "Save as coping card" calls `saveCard` and shows "Saved ✓"
- [ ] Card appears in `useCopingCards` query result
- [ ] Button is hidden for exercises without a key takeaway
- [ ] No double-save: button disables after first tap

---

### ✅ TASK-021 — Build CopingCardsScreen

**Files to create:**

- `src/screens/CopingCardsScreen/CopingCardsScreen.tsx`
- `src/screens/CopingCardsScreen/components/CopingCardItem.tsx`
- `app/tabs/screens/coping-cards.tsx` (route file)

**What:** A scrollable screen showing all the user's saved coping cards — the "wisdom they've generated".

**Layout:**

```
┌─────────────────────────────────────────┐
│  ← My Coping Cards              [+]     │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ 🧠  Thought Catcher              │   │
│  │ Jun 3                            │   │
│  │                                  │   │
│  │ "Even if the meeting is about    │   │
│  │  me, I can handle whatever       │   │
│  │  comes next."                    │   │
│  │                                  │   │
│  │  [★ Star]           [Archive]   │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ ✨  Thought Reframing    ★        │   │
│  │ Jun 2                            │   │
│  │                                  │   │
│  │ "This situation is temporary     │   │
│  │  and I've handled harder         │   │
│  │  things before."                 │   │
│  └──────────────────────────────────┘   │
│                                          │
│  [Show archived]                         │
└─────────────────────────────────────────┘
```

**CopingCardItem component props:**

```typescript
interface CopingCardItemProps {
  card: CopingCard;
  onToggleStar: () => void;
  onArchive: () => void;
}
```

**Design details:**

- Card background: white with `border-brand-border`, `rounded-2xl`, `p-5`, depth shadow
- Exercise type shown as small chip (exercise emoji + name)
- `reframe_label` as small uppercase caption above the text
- `reframe_text` as 16px body text, max 4 lines with "Read more" expansion
- Date formatted as "Jun 3" using existing `date.ts` utils
- Star button: `BookmarkAdd01Icon` (unfilled) / `BookmarkRemove01Icon` (filled) from HugeIcons
- Archive: ghost "Archive" text button in muted color
- Starred cards shown first in the list

**Empty state:**

```
🌱
"You haven't saved any coping cards yet.
Complete an exercise and save your reframes here."
```

**Acceptance criteria:**

- [ ] Screen renders all active (non-archived) cards
- [ ] Starred cards appear first
- [ ] Star toggle works with optimistic UI
- [ ] Archive moves card off the main list
- [ ] "Show archived" toggle at bottom reveals archived cards
- [ ] Empty state shown when no cards exist
- [ ] Screen accessible from somewhere in main navigation (exercises tab or profile)

---

## Track D: Voice Input for TextInputStep (P1)

### ✅ TASK-022 — Wire VoiceTextInput into TextInputStep

**Files to modify:**

- `src/components/exercise/steps/TextInputStep.tsx`

**Background:**
`VoiceTextInput` already exists at `src/screens/ThoughtReframingScreen/components/VoiceTextInput.tsx` and is fully functional — it uses `useAudioRecording` and `useTranscribeAudio` hooks. It handles tap-to-record, stop, transcription, and appending text. We just need to integrate it into `TextInputStep`.

**What:** Replace the plain `TextInput` inside `TextInputStep` with `VoiceTextInput`. The prop interface of `VoiceTextInput` matches: `value`, `onChangeText`, `placeholder`, `maxLength`.

**Steps:**

1. Import `VoiceTextInput` from `@/src/screens/ThoughtReframingScreen/components/VoiceTextInput`
2. Replace the `TextInput` block (lines 78-98 in the current file) with `<VoiceTextInput>` using the same props
3. Keep the character count display that `VoiceTextInput` already provides (`showCharCount={true}`)
4. Remove the manual character count display below the TextInput (VoiceTextInput has it built in)
5. Keep the focus border styling — VoiceTextInput accepts `className` prop for the wrapper

**Note:** `VoiceTextInput` currently uses `border-slate-100` / `border-red-200` for its border styling. When replacing, check if the sage-themed focus border from the original `TextInputStep` needs to be preserved. If so, pass a `className` with the sage border classes.

**Acceptance criteria:**

- [ ] Mic button visible inside all `TextInputStep` instances
- [ ] Tapping mic starts recording (haptic feedback)
- [ ] Tapping again stops and transcribes
- [ ] Transcribed text appends to existing text with a newline separator
- [ ] "Transcribing..." indicator visible during API call
- [ ] Max length respected for transcribed text
- [ ] No regression on existing typing behavior

---

## Track E: Fix Decatastrophizing Time Perspective (P1)

### ✅ TASK-023 — Split time perspective into 3 guided steps

**Files to modify:**

- `src/exercises/decatastrophizing/config.ts`

**Current state:** A single `TextInputStep` with `fieldKey: "perspective1Week"` and placeholder "In a week: ... In a month: ... In a year: ...". Users are asked to answer 3 different questions in one field — confusing and under-utilized.

**`DecatastrophizingResponse`** already has separate fields (`perspective1Week`, `perspective1Month`, `perspective1Year`) in the type definition — they just aren't being used as separate steps.

**New steps (replace the single `time_perspective` step with 3 steps):**

```typescript
{
  id: "perspective_1_week",
  component: createStep(TextInputStep, {
    title: "In One Week",
    subtitle: "How will this situation look in 7 days?",
    fieldKey: "perspective1Week",
    placeholder: "In a week, this will probably...",
    tipText: "Most feared events feel less urgent after just a few days.",
    psychoeducationText: "Anxiety narrows your time horizon to right now. Zooming out reveals that most threats shrink with time.",
    validationMessage: "That's a helpful perspective shift. Keep going.",
  }),
  label: "One week perspective",
  validate: (r) => r.perspective1Week.trim().length >= 1,
},
{
  id: "perspective_1_month",
  component: createStep(TextInputStep, {
    title: "In One Month",
    subtitle: "What else will have happened by then?",
    fieldKey: "perspective1Month",
    placeholder: "In a month, I'll probably...",
    tipText: "Life keeps moving — what else might change by then?",
  }),
  label: "One month perspective",
  validate: (r) => r.perspective1Month.trim().length >= 1,
},
{
  id: "perspective_1_year",
  component: createStep(TextInputStep, {
    title: "In One Year",
    subtitle: "How much will this matter in the bigger picture?",
    fieldKey: "perspective1Year",
    placeholder: "In a year, this will...",
    tipText: "A year from now, how much mental space will this take up?",
  }),
  label: "One year perspective",
  validate: (r) => r.perspective1Year.trim().length >= 1,
},
```

**Schema migration:** The existing `perspective1Week` field may have been used as a catch-all by users who completed the exercise with the old single-step. Bump `schemaVersion` to 3 and add a migration that tries to split existing content:

```typescript
migrate: (old, fromVersion) => {
  if (fromVersion < 3) {
    return {
      ...INITIAL,
      ...old,
      perspective1Month: old.perspective1Month ?? "",
      perspective1Year: old.perspective1Year ?? "",
    };
  }
  return old;
},
```

**Acceptance criteria:**

- [ ] 3 separate steps visible in the exercise flow instead of 1
- [ ] Each validates independently (user must fill all three to proceed)
- [ ] Old entries load without errors (migration handles missing fields)
- [ ] Summary shows all 3 perspectives (update `createDynamicSummaryStep` call to use first perspective as takeaway)
- [ ] Progress bar accounts for the 2 extra steps

---

## Implementation Order & Dependencies

```
TASK-016 ─┐
           ├──► TASK-017 (need component before wiring)
           │
TASK-018 ─┐
           ├──► TASK-019 (need type before hook)
           │    └──► TASK-020 (need hook before wiring)
           │         └──► TASK-021 (need save wired before deck useful)
           │
TASK-022 ──── (independent — replaces plain TextInput)
TASK-023 ──── (independent — config change only)
TASK-015 ──── (independent — new custom steps file)
```

**Suggested sequence:**

1. `TASK-023` — Quick config fix, unblocks nothing but is very low effort
2. `TASK-022` — Wire voice input, high user impact, no dependencies
3. `TASK-016` → `TASK-017` — Psychoeducation component then wire to all steps
4. `TASK-018` → `TASK-019` → `TASK-020` → `TASK-021` — Coping card data model, hook, wiring, screen
5. `TASK-015` — Thought Reframing redesign (most effort, tackle last in phase)

---

## Out of Scope (Phase 3 — not in this phase)

- Adaptive exercise recommendation engine
- "Your Thinking Patterns" analytics dashboard
- Weekly AI insights
- Safety Plan Builder exercise
- Behavioral Activation exercise
- Sleep Anxiety Module

---

_Tasks reference: `docs/prd-cbt-exercises-v2.md` § 5.5–5.9, § 7 (Phase 2)_
