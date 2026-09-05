# Home Screen Action-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Home screen from a container-heavy dashboard into a calm, action-first guided experience: Greeting $\rightarrow$ Today's Reflection $\rightarrow$ How are you feeling? $\rightarrow$ Compact Streak.

**Architecture:** Remove header toolbar clutter, tighten reflection hero card, remove outer card on mood logger and streak widget, and reorder sections in JournalCalendarScreen.

**Tech Stack:** React Native, NativeWind / Tailwind CSS, Expo Symbols, Reanimated.

## Global Constraints
- Strictly follow project styling standards: Tailwind CSS via NativeWind, no ad-hoc hex colors.
- Maintain minimum 44×44 pt touch targets for all interactive elements.
- Keep raster emoji mood images (`bad`, `fine`, `good`, `great`, `terrible`) intact per user choice (Option A).
- No file or component over 300 lines.
- No test suite files (`dont write the test cases`). Verification via TypeScript compilation and runtime checking.
- Every intentional simplification tagged with `// ponytail:`.

---

### Task 1: Simplify Header Toolbar in JournalCalendarScreen
**Files:**
- Modify: `src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx`

**Interfaces:**
- Consumes: `Stack.Toolbar`, `SEMANTIC_COLORS`
- Produces: Clean single-utility header toolbar.

- [ ] **Step 1: Update Stack.Toolbar in JournalCalendarScreen.tsx**
Remove Timeline (`chart.bar.doc.horizontal`) and Awards (`rosette`) toolbar buttons.
Keep only the Settings button (`gearshape.fill`, `accessibilityLabel="Settings"`).
Add `// ponytail: single settings action in header toolbar`.

- [ ] **Step 2: Verify type correctness**
Run `npx tsc --noEmit` on `JournalCalendarScreen.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx
git commit -m "style(home): simplify header toolbar to single settings action"
```

---

### Task 2: Tighten Reflection Card in FeaturedPromptCard
**Files:**
- Modify: `src/components/FeaturedPromptCard/FeaturedPromptCard.tsx`

**Interfaces:**
- Consumes: `Card`, `BeginButton`, `SEMANTIC_COLORS`, `APP_FONT_FAMILIES`
- Produces: Proportioned hero card with reduced vertical whitespace.

- [ ] **Step 1: Update FeaturedPromptCard.tsx**
Change `Card` `contentClassName="min-h-[220px] p-5"` to `contentClassName="min-h-[160px] p-5 pt-4 pb-5"`.
Change prompt text wrapper `min-h-[112px]` to `min-h-[64px]` and prompt text `fontSize: 30, lineHeight: 34` to `fontSize: 24, lineHeight: 28`.
Change refresh button `accessibilityLabel` to `"New prompt"`.
Add `// ponytail: tighter hero reflection card height`.

- [ ] **Step 2: Verify type correctness**
Run `npx tsc --noEmit` on `FeaturedPromptCard.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/components/FeaturedPromptCard/FeaturedPromptCard.tsx
git commit -m "style(home): tighten reflection card height and action layout"
```

---

### Task 3: Un-Card EmotionLogger and Rename Header
**Files:**
- Modify: `src/components/EmotionLogger.tsx`

**Interfaces:**
- Consumes: `EMOTIONS`, `useEmotionLogger`, `PressableScale`
- Produces: Lightweight mood check-in using whitespace instead of a card.

- [ ] **Step 1: Update EmotionLogger.tsx**
Change headline text from `"Daily mood log"` to `"How are you feeling?"`.
Remove the outer `<Card>` component wrapping the emotions list.
Render emotion items directly inside `<View className="flex-row justify-between py-1">`.
Add `// ponytail: remove outer card and use whitespace grouping for mood`.

- [ ] **Step 2: Verify type correctness**
Run `npx tsc --noEmit` on `EmotionLogger.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/components/EmotionLogger.tsx
git commit -m "style(home): un-card mood logger and update title to How are you feeling"
```

---

### Task 4: Compress WeeklyStreakWidget into Compact Strip
**Files:**
- Modify: `src/components/Streak/WeeklyStreakWidget.tsx`

**Interfaces:**
- Consumes: `useStreak`, `SEMANTIC_COLORS`, `APP_FONT_FAMILIES`
- Produces: Lightweight, cardless streak reinforcement strip.

- [ ] **Step 1: Update WeeklyStreakWidget.tsx**
Remove the outer `<Card>` wrapper and the giant 46px number box.
Render as a clean, interactive pressable row (`Pressable` with hitSlop and 44pt target):
- Left side: Inline streak text `🔥 {currentStreak} day streak` (font bold, text-ink 16px).
- Right side: Compact row of weekday indicators (`S M T W T F S`) with flame or muted dot (20×20 icon).
Add `// ponytail: compact lightweight streak strip replaces heavy card`.

- [ ] **Step 2: Verify type correctness**
Run `npx tsc --noEmit` on `WeeklyStreakWidget.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/components/Streak/WeeklyStreakWidget.tsx
git commit -m "style(home): compress weekly streak widget into compact strip"
```

---

### Task 5: Reorder Home Screen to Action-First Hierarchy
**Files:**
- Modify: `src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx`

**Interfaces:**
- Consumes: `Greeting`, `FeaturedPromptCard`, `EmotionLogger`, `WeeklyStreakWidget`
- Produces: Action-first home screen order: Greeting $\rightarrow$ Reflection $\rightarrow$ Mood $\rightarrow$ Streak.

- [ ] **Step 1: Reorder JSX in JournalCalendarScreen.tsx**
Update section order inside the content View:
1. `Greeting`
2. `TODAY'S REFLECTION`:
   ```tsx
   <View className="mt-8">
     <View className="mb-3 px-1">
       <Text className="happy-font-body-bold text-[13px] tracking-wider text-ink-soft uppercase">
         Today's reflection
       </Text>
     </View>
     <FeaturedPromptCard
       prompts={ALL_PROMPTS}
       onPress={(prompt) => handleQuickJournalPress(prompt)}
     />
   </View>
   ```
3. `How are you feeling?`:
   ```tsx
   <View className="mt-8">
     <EmotionLogger
       selectedDate={selectedEmotionDate}
       onEmotionLogged={handleEmotionLogged}
       showDepth={false}
     />
   </View>
   ```
4. `Streak`:
   ```tsx
   <View className="mt-8">
     <WeeklyStreakWidget
       showDepth={false}
       onPress={() => router.push("/tabs/screens/xp-history")}
     />
   </View>
   ```
Add `// ponytail: action-first home screen hierarchy`.

- [ ] **Step 2: Verify type correctness**
Run `npx tsc --noEmit` on `JournalCalendarScreen.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx
git commit -m "style(home): reorder home screen to action-first hierarchy"
```

---

### Task 6: Final Verification & Knowledge Graph Sync
**Files:**
- No file changes

- [ ] **Step 1: Full TypeScript Verification**
Run `npx tsc --noEmit` to confirm no new errors in any touched files.

- [ ] **Step 2: Update Knowledge Graph**
Run `graphify update .` to update code graph.
