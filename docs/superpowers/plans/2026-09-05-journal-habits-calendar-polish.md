# Journal + Habits + Calendar UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the Journal, Habits, and Calendar interfaces to reduce cognitive load and visual noise while preserving core information architecture.

**Architecture:** Polish the week/month calendar headers and mood badge empty states, align selection tokens between calendar views, reduce empty-state mascot scale, and tighten copywriting.

**Tech Stack:** React Native, NativeWind / Tailwind CSS, Reanimated, Hugeicons.

## Global Constraints
- Strictly follow project styling standards: Tailwind CSS via NativeWind, no ad-hoc hex colors.
- Maintain minimum 44×44 pt touch targets for all date and action buttons.
- No file or component over 300 lines.
- No unit test suite required as per repository guidelines (`dont write the test cases`). Verification via TypeScript compilation and runtime checking.

---

### Task 1: Quiet Empty Mood Slot in MoodBadge
**Files:**
- Modify: `src/components/MoodBadge.tsx`

**Interfaces:**
- Consumes: `SEMANTIC_COLORS`, `HugeiconsIcon`, `Add01Icon`
- Produces: Updated `MoodBadge` component with quiet empty state (no spinning animation, opacity 0.22 for week, 0.12 for month/displayOnly)

- [x] **Step 1: Update MoodBadge.tsx**
Remove the `plusRotation` Reanimated hook and animation. Update the empty slot rendering to a delicate 1px border ring with a small 10px `Add01Icon` at opacity 0.22 (or 0.12 when `displayOnly` is true).

- [x] **Step 2: Verify type correctness**
Run `npx tsc --noEmit src/components/MoodBadge.tsx` (or grep `npx tsc --noEmit` log) to ensure no type errors.

- [x] **Step 3: Commit**
```bash
git add src/components/MoodBadge.tsx
git commit -m "style(journal): soften empty mood slot in MoodBadge"
```

---

### Task 2: Soften Month Title and Compress Week Spacing in DailyNotesHeader
**Files:**
- Modify: `src/screens/DailyNotesScreen/DailyNotesHeader.tsx`

**Interfaces:**
- Consumes: `Text`, `SEMANTIC_COLORS`
- Produces: Softer month title header and tighter day button container spacing

- [x] **Step 1: Update DailyNotesHeader.tsx**
Change month title from 28px `variant="h1"` to `variant="h2"` (21px).
Change day container bottom margin from `mb-3` to `mb-1.5` to bring Journal/Habits content up sooner.

- [x] **Step 2: Verify type correctness**
Run `npx tsc --noEmit` to ensure no errors in `DailyNotesHeader.tsx`.

- [x] **Step 3: Commit**
```bash
git add src/screens/DailyNotesScreen/DailyNotesHeader.tsx
git commit -m "style(calendar): soften month title and compress week spacing"
```

---

### Task 3: Standardize Month View Selection and Quiet Controls in CalendarPicker
**Files:**
- Modify: `src/screens/DailyNotesScreen/CalendarPicker.tsx`

**Interfaces:**
- Consumes: `SEMANTIC_COLORS.selection.surface`, `SEMANTIC_COLORS.selection.foreground`
- Produces: Unified selection appearance across week and month views

- [x] **Step 1: Update CalendarPicker.tsx**
Ensure selected day circle uses `backgroundColor: SEMANTIC_COLORS.selection.surface` and `borderColor: SEMANTIC_COLORS.selection.foreground`.
Soften month navigation buttons.

- [x] **Step 2: Verify type correctness**
Run `npx tsc --noEmit` to ensure no errors in `CalendarPicker.tsx`.

- [x] **Step 3: Commit**
```bash
git add src/screens/DailyNotesScreen/CalendarPicker.tsx
git commit -m "style(calendar): align month selection style to week view"
```

---

### Task 4: Scale Mascot and Refine Copy in Empty States
**Files:**
- Modify: `src/components/ui/EmptyState.tsx`
- Modify: `src/components/habits/HabitsSection.tsx`

**Interfaces:**
- Consumes: `Mascot`, `Button`
- Produces: Better-proportioned empty states with concise copy

- [x] **Step 1: Update EmptyState.tsx**
Scale mascot size from 140 to 120 (~15% reduction).
Tighten gap between mascot and title from `mb-8` to `mb-4`.

- [x] **Step 2: Update HabitsSection.tsx**
Change description to `"Build routines with simple daily tracking."`.

- [x] **Step 3: Verify type correctness**
Run `npx tsc --noEmit` to ensure zero errors.

- [x] **Step 4: Commit**
```bash
git add src/components/ui/EmptyState.tsx src/components/habits/HabitsSection.tsx
git commit -m "style(ui): scale down empty state mascot and shorten habits copy"
```

---

### Task 5: Final Verification & Knowledge Graph Update
**Files:**
- No file changes

- [x] **Step 1: Full TypeScript Verification**
Run `npx tsc --noEmit` and confirm all modified files compile cleanly.

- [x] **Step 2: Update Knowledge Graph**
Run `graphify update .` to update the AST and relationship graph.
