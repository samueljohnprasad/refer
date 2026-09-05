# Journal + Habits + Calendar Phase 2 UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate visual noise on future dates, unify week/month selection styling, enforce accurate "Today" button behavior, avoid floating panda duplication in empty states, and tighten empty state spacing.

**Architecture:** Extend MoodBadge with `hideEmptySlot` support, suppress empty mood affordance on future dates in week and month grids, align selection styling tokens, gate floating assistant visibility on empty state presence, and tighten EmptyState layout.

**Tech Stack:** React Native, NativeWind / Tailwind CSS, Hugeicons, Redux Toolkit, Jotai.

## Global Constraints
- Strictly follow project styling standards: Tailwind CSS via NativeWind, no ad-hoc hex colors.
- Maintain minimum 44×44 pt touch targets for all date and interactive cells.
- Keep raster emoji mood images (`bad`, `fine`, `good`, `great`, `terrible`) intact — do not replace with vector glyphs.
- No file or component over 300 lines.
- No test suite files (`dont write the test cases`). Verification via TypeScript compilation and runtime checking.
- Every intentional simplification tagged with `// ponytail:`.

---

### Task 1: Suppress Empty Mood Slots on Future Dates
**Files:**
- Modify: `src/components/MoodBadge.tsx`
- Modify: `src/screens/DailyNotesScreen/DailyNotesHeader.tsx`
- Modify: `src/screens/DailyNotesScreen/CalendarPicker.tsx`

**Interfaces:**
- Consumes: `SEMANTIC_COLORS`, `isAfter`, `startOfDay`
- Produces: `MoodBadge` with `hideEmptySlot?: boolean` prop that preserves layout dimensions without rendering a visible empty border/plus on future dates.

- [x] **Step 1: Update MoodBadge.tsx**
Add optional `hideEmptySlot?: boolean` to `MoodBadgeProps`.
When `!moodscore` and `hideEmptySlot` is true, render an empty `<View style={{ width: diameter, height: diameter }} />` (or return early with an invisible box matching dimensions) so that cells retain vertical alignment without visual clutter.
Add `// ponytail: suppress empty mood affordance when hideEmptySlot is active`.

- [x] **Step 2: Update DailyNotesHeader.tsx**
Pass `hideEmptySlot={dayData.disabled && dayData.mood === undefined}` to `<MoodBadge />` in the week row so future dates show clean date numbers without `+`.

- [x] **Step 3: Update CalendarPicker.tsx**
In `DayCell`: When `disabled` (future date) and `mood === undefined`, pass `hideEmptySlot` to `MoodBadge` (or skip rendering the visible empty placeholder).

- [x] **Step 4: Verify type correctness**
Run `npx tsc --noEmit` on modified files to ensure zero type errors.

- [x] **Step 5: Commit**
```bash
git add src/components/MoodBadge.tsx src/screens/DailyNotesScreen/DailyNotesHeader.tsx src/screens/DailyNotesScreen/CalendarPicker.tsx
git commit -m "style(calendar): suppress empty mood slots on future dates"
```

---

### Task 2: Refine "Today" Button Visibility Rule
**Files:**
- Modify: `src/screens/DailyNotesScreen/DailyNotesHeader.tsx`

**Interfaces:**
- Consumes: `isSameWeek`, `isToday`, `isSelectedDateValid`, `selectedDate`, `currentWeekViewSafe`
- Produces: Clean, predictable `showTodayPill` boolean.

- [x] **Step 1: Update DailyNotesHeader.tsx showTodayPill**
Update `showTodayPill` memo in `DailyNotesHeader.tsx`:
```typescript
const showTodayPill = useMemo(() => {
  const isCurrentWeek = isSameWeek(currentWeekViewSafe, new Date(), {
    weekStartsOn: 0,
  });
  const isTodaySelected = isSelectedDateValid && isToday(selectedDate);
  // ponytail: show today recovery shortcut only when navigated away
  return !isCurrentWeek || !isTodaySelected;
}, [currentWeekViewSafe, isSelectedDateValid, selectedDate]);
```

- [x] **Step 2: Verify type correctness**
Run `npx tsc --noEmit` to confirm clean compilation.

- [x] **Step 3: Commit**
```bash
git add src/screens/DailyNotesScreen/DailyNotesHeader.tsx
git commit -m "fix(calendar): show today button only when navigated away"
```

---

### Task 3: Unify Month DayCell Selection Text & Styling
**Files:**
- Modify: `src/screens/DailyNotesScreen/CalendarPicker.tsx`

**Interfaces:**
- Consumes: `SEMANTIC_COLORS.selection.surface`, `SEMANTIC_COLORS.selection.foreground`, `SEMANTIC_COLORS.brand.pressed`
- Produces: Harmonized month day selected state matching week day selection.

- [x] **Step 1: Update CalendarPicker.tsx DayCell styling**
Ensure `textColorVariant` or text styling for `isSelected` in `DayCell` uses `SEMANTIC_COLORS.brand.pressed` (or color variant `"sage"` matching brand pressed token), with `variant="body-bold"` for emphasis.
Add `// ponytail: align month selected day text style with week view`.

- [x] **Step 2: Verify type correctness**
Run `npx tsc --noEmit` to verify zero errors in `CalendarPicker.tsx`.

- [x] **Step 3: Commit**
```bash
git add src/screens/DailyNotesScreen/CalendarPicker.tsx
git commit -m "style(calendar): unify month selected day text style with week view"
```

---

### Task 4: Hide Floating Panda on Empty States and Tighten Empty State Spacing
**Files:**
- Modify: `src/screens/DailyNotesScreen/DailyNotesScreen.tsx`
- Modify: `src/components/ui/EmptyState.tsx`

**Interfaces:**
- Consumes: `useAppDispatch`, `setVisible` from `happyAssistantSlice`
- Produces: Dual-panda conflict resolution and tighter vertical grouping.

- [x] **Step 1: Update DailyNotesScreen.tsx**
Import `useAppDispatch` and `setVisible` from `@/src/store/slices/happyAssistantSlice`.
Determine if current screen is in empty state:
```typescript
const isEmptyState =
  (tabFilter === "journal" && journalCount === 0) ||
  (tabFilter === "habits" && habitsCount === 0);
```
Add `useEffect`:
```typescript
// ponytail: hide floating assistant when screen already shows mascot illustration
useEffect(() => {
  dispatch(setVisible(!isEmptyState));
  return () => {
    dispatch(setVisible(true));
  };
}, [dispatch, isEmptyState]);
```

- [x] **Step 2: Update EmptyState.tsx Spacing**
In `src/components/ui/EmptyState.tsx`:
Tighten mascot container margin from `mb-4` to `mb-3`.
Tighten title container margin from `mb-2` to `mb-1.5`.
Add `// ponytail: tighten vertical rhythm between mascot and text`.

- [x] **Step 3: Verify type correctness**
Run `npx tsc --noEmit` on touched files.

- [x] **Step 4: Commit**
```bash
git add src/screens/DailyNotesScreen/DailyNotesScreen.tsx src/components/ui/EmptyState.tsx
git commit -m "style(journal): hide floating panda during empty states and tighten spacing"
```

---

### Task 5: Final Verification & Knowledge Graph Sync
**Files:**
- No file changes

- [x] **Step 1: Full TypeScript Verification**
Run `npx tsc --noEmit` to confirm no new errors in any touched files.

- [x] **Step 2: Update Knowledge Graph**
Run `graphify update .` to update code graph.
