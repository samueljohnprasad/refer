# Journal + Habits + Calendar UI & Cognitive Load Polish Phase 2 Design Spec

**Date:** 2026-09-06  
**Topic:** Journal + Habits + Calendar Refinement (Phase 2)  
**Status:** Approved by User (Keeping raster mood emojis; executing points 2-5)  

---

## 1. Overview & Goals

Following Phase 1 improvements, this phase resolves remaining cognitive load and density issues in the Calendar, Journal, and Habits views:
1. **Eliminate Future-Date Mood Slot Clutter**: Do not display empty mood slots (`+`) under future dates. Days that haven't occurred cannot be logged, eliminating ~70% of redundant placeholders in the month grid and week strip.
2. **Soften Past & Today Empty Mood Slots**:
   - Week view: Subtle 1px ring with faint `Add01Icon` (`opacity: 0.22`, preserving 44×44pt hit target).
   - Month view: Faint placeholder (`opacity: 0.12`).
   - Recorded moods: Retain existing raster emoji artwork (`terrible`, `bad`, `fine`, `good`, `great`) at full opacity (User explicitly instructed to keep raster emoji artwork).
3. **Unify Selection State Tokens**:
   - Week day pill and Month day circle both use `SEMANTIC_COLORS.selection.surface` for background, `SEMANTIC_COLORS.selection.foreground` for border, and `SEMANTIC_COLORS.brand.pressed` for selected day text.
4. **Predictable "Today" Button Visibility**:
   - Hidden when: Current week is displayed AND today is the active selected date.
   - Visible when: The user navigates away from the current week OR selects any date other than today.
   - Action: Tapping returns to the current week, selects today, and hides the pill.
5. **Focused Month Date-Picker**:
   - When the month view expands, it focuses user attention on date browsing; selecting any date immediately updates selection and smoothly collapses back to week view centered on that date.
6. **Floating Assistant Clutter Prevention**:
   - When Journal or Habits screen is in an empty state displaying the large panda mascot, hide the floating assistant bubble (`FloatingHappyAssistant`) to avoid two competing pandas on screen.
   - When entries exist, floating assistant displays normally.
7. **Empty State Spacing**:
   - Tighten spacing between empty state mascot and copy.

---

## 2. Detailed Technical Specifications

### 2.1 Mood Slot Logic (`src/components/MoodBadge.tsx`, `src/screens/DailyNotesScreen/DailyNotesHeader.tsx`, `src/screens/DailyNotesScreen/CalendarPicker.tsx`)
- **Future Date Rule**:
  - In `CalendarPicker.tsx` / `DayCell`: If `disabled` (i.e. `isAfter(startOfDay(day), startOfDay(today))`) and `mood === undefined`, do NOT render any empty mood slot. Render an empty spacer with same height to preserve vertical alignment.
  - In `DailyNotesHeader.tsx`: If `dayData.disabled` and `dayData.mood === undefined`, pass `hideEmptySlot={true}` or render empty spacer so future week days don't show `+`.
- **MoodBadge Props**:
  - Add optional prop: `hideEmptySlot?: boolean`. If true and `!moodscore`, render null or empty placeholder with same dimensions so layout doesn't jump.
  - Keep `moodEmojiMap` with raster emoji PNGs as requested.

### 2.2 Selection State Tokens (`src/screens/DailyNotesScreen/CalendarPicker.tsx`, `src/screens/DailyNotesScreen/DayButtonComponent.tsx`)
- Month `DayCell`:
  - Selected circle: `backgroundColor: SEMANTIC_COLORS.selection.surface`, `borderColor: SEMANTIC_COLORS.selection.foreground`, `borderWidth: 1`.
  - Selected text: bold Nunito with `SEMANTIC_COLORS.brand.pressed` color (matching week view).
- Week `DayButtonComponent`:
  - Selected morphing pill already uses `SEMANTIC_COLORS.selection.surface` and `SEMANTIC_COLORS.selection.foreground`. Text uses `SEMANTIC_COLORS.brand.pressed`.

### 2.3 "Today" Pill Logic (`src/screens/DailyNotesScreen/DailyNotesHeader.tsx`)
- Update `showTodayPill` calculation:
  ```typescript
  const showTodayPill = useMemo(() => {
    const isCurrentWeek = isSameWeek(currentWeekViewSafe, new Date(), { weekStartsOn: 0 });
    const isTodaySelected = isSelectedDateValid && isToday(selectedDate);
    // Only show when navigated away from current week OR today is not selected
    return !isCurrentWeek || !isTodaySelected;
  }, [currentWeekViewSafe, isSelectedDateValid, selectedDate]);
  ```

### 2.4 Floating Panda Assistant Visibility (`src/screens/DailyNotesScreen/DailyNotesScreen.tsx`)
- In `DailyNotesScreen.tsx`, check whether current active tab is in empty state:
  - Journal: `tabFilter === "journal" && journalCount === 0`
  - Habits: `tabFilter === "habits" && habitsCount === 0`
- Dispatch `setVisible(!isEmptyState)` to Redux `happyAssistantSlice` on state change, or dispatch `setVisible(true)` on cleanup when unmounting.

### 2.5 Empty State Layout Tightening (`src/components/ui/EmptyState.tsx`)
- Mascot container: `mb-3` (tightened from `mb-4`).
- StaggeredText / Title container: `mb-1.5`.

---

## 3. Verification & Acceptance Criteria
- **TypeScript**: Zero errors (`npx tsc --noEmit`).
- **Visual Behavior**:
  - Future dates in week strip and month grid have no `+` symbol under them.
  - Past & today dates with unlogged mood show subtle `+`.
  - Logged moods show existing raster emoji artwork.
  - "Today" button is hidden on launch when today is selected, and appears immediately when selecting another day or swiping weeks.
  - Floating panda is hidden when empty state panda is visible.
- **Knowledge Graph**: Run `graphify update .`.
