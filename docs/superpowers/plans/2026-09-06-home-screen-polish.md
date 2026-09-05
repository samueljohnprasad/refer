# Home Screen Visual Polish & Cohesion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the Home screen visual craft: replace raster emoji with in-house vector MoodIcon family, add active selection feedback, align weekly streak strip to a clean baseline grid with status dots, and tighten reflection hero card.

**Architecture:** Create reusable vector `MoodIcon` component, integrate selected mood state in `EmotionLogger`, redesign `WeeklyStreakWidget` into two-part row with status dots, tighten `FeaturedPromptCard` padding/insets, and tune greeting typography in `JournalCalendarScreen`.

**Tech Stack:** React Native, react-native-svg, NativeWind / Tailwind CSS, Expo Symbols, Reanimated.

## Global Constraints
- Strictly follow project styling standards: Tailwind CSS via NativeWind, no ad-hoc hex colors.
- Maintain minimum 44×44 pt touch targets for all interactive controls.
- Strictly use TypeScript everywhere, zero `any` types.
- No React component or helper file may exceed 300 lines.
- No test suite files (`dont write the test cases`). Verification via TypeScript checks and simulator screenshots.
- Every intentional simplification tagged with `// ponytail:`.

---

### Task 1: Create Vector MoodIcon Component
**Files:**
- Create: `src/components/MoodIcon/MoodIcon.tsx`
- Create: `src/components/MoodIcon/index.ts`

**Interfaces:**
- Consumes: `react-native-svg`, `SEMANTIC_COLORS`
- Produces: `MoodIcon` component and `MoodKey` type (`"terrible" | "bad" | "okay" | "good" | "great"`).

- [ ] **Step 1: Create MoodIcon.tsx**
Implement 5 expressive faces using SVG lines and arcs with unified 2pt stroke and 38×38pt circle:
```tsx
import React from "react";
import Svg, { Circle, Path, Line } from "react-native-svg";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

export type MoodKey = "terrible" | "bad" | "okay" | "good" | "great";

export interface MoodIconProps {
  mood: MoodKey;
  isSelected?: boolean;
  size?: number;
}

// ponytail: unified vector mood icon family replaces raster emojis
export const MoodIcon: React.FC<MoodIconProps> = ({
  mood,
  isSelected = false,
  size = 38,
}) => {
  const strokeColor = isSelected
    ? SEMANTIC_COLORS.brand.primary
    : SEMANTIC_COLORS.text.tertiary;

  const fillColor = isSelected
    ? "#E3EBE3"
    : SEMANTIC_COLORS.surface.canvas;

  return (
    <Svg width={size} height={size} viewBox="0 0 38 38">
      {/* Outer circle */}
      <Circle
        cx="19"
        cy="19"
        r="17.5"
        stroke={strokeColor}
        strokeWidth="2"
        fill={fillColor}
      />
      {/* Expressions */}
      {mood === "terrible" && (
        <>
          {/* Brow angles */}
          <Line x1="12" y1="12" x2="16" y2="14" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
          <Line x1="26" y1="12" x2="22" y2="14" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
          {/* Eyes */}
          <Circle cx="14" cy="17" r="1.8" fill={strokeColor} />
          <Circle cx="24" cy="17" r="1.8" fill={strokeColor} />
          {/* Downward frown */}
          <Path d="M 13 27 Q 19 21 25 27" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}
      {mood === "bad" && (
        <>
          <Circle cx="14" cy="16" r="1.8" fill={strokeColor} />
          <Circle cx="24" cy="16" r="1.8" fill={strokeColor} />
          <Path d="M 14 26 Q 19 22 24 25" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}
      {mood === "okay" && (
        <>
          <Circle cx="14" cy="16" r="1.8" fill={strokeColor} />
          <Circle cx="24" cy="16" r="1.8" fill={strokeColor} />
          <Line x1="14" y1="24" x2="24" y2="24" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {mood === "good" && (
        <>
          <Circle cx="14" cy="16" r="1.8" fill={strokeColor} />
          <Circle cx="24" cy="16" r="1.8" fill={strokeColor} />
          <Path d="M 13 23 Q 19 28 25 23" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}
      {mood === "great" && (
        <>
          {/* Happy arch eyes */}
          <Path d="M 12 16 Q 14.5 13 17 16" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <Path d="M 21 16 Q 23.5 13 26 16" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Wide open smile */}
          <Path d="M 13 22 Q 19 30 25 22 Z" stroke={strokeColor} strokeWidth="1.8" fill={isSelected ? strokeColor : "none"} />
        </>
      )}
    </Svg>
  );
};
```

- [ ] **Step 2: Create index.ts export**
```typescript
export * from "./MoodIcon";
```

- [ ] **Step 3: Verify TypeScript correctness**
Run `npx tsc --noEmit` on `MoodIcon.tsx`.

- [ ] **Step 4: Commit**
```bash
git add src/components/MoodIcon
git commit -m "feat(ui): add cohesive vector MoodIcon family"
```

---

### Task 2: Integrate MoodIcon and Selection State in EmotionLogger
**Files:**
- Modify: `src/components/EmotionLogger.tsx`

**Interfaces:**
- Consumes: `MoodIcon`, `useEmotionLogger`, `PressableScale`
- Produces: Polished mood check-in with selection feedback and consistent visual weight.

- [ ] **Step 1: Update EmotionLogger.tsx**
1. Replace raster imports with `MoodIcon` and `MoodKey`.
2. Map `EMOTIONS` array to include `moodKey`:
   ```typescript
   const EMOTIONS: { id: number; name: string; moodKey: MoodKey }[] = [
     { id: 1, name: "Terrible", moodKey: "terrible" },
     { id: 2, name: "Bad", moodKey: "bad" },
     { id: 3, name: "Okay", moodKey: "okay" },
     { id: 4, name: "Good", moodKey: "good" },
     { id: 5, name: "Great", moodKey: "great" },
   ];
   ```
3. Add `selectedMoodId` state in `EmotionLogger` (initialized from existing date emotion if present).
4. Update `EmotionItem` to render `<MoodIcon mood={emotion.moodKey} isSelected={isSelected} size={40} />`.
5. Update label typography: `text-[12px] font-semibold`, colored `text-brand-primary` if selected, `text-ink-soft` if unselected.
6. Add `// ponytail: vector mood icon with active selection feedback`.

- [ ] **Step 2: Verify TypeScript correctness**
Run `npx tsc --noEmit` on `EmotionLogger.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/components/EmotionLogger.tsx
git commit -m "style(mood): integrate custom vector MoodIcon and active selection state"
```

---

### Task 3: Redesign WeeklyStreakWidget to Baseline Grid
**Files:**
- Modify: `src/components/Streak/WeeklyStreakWidget.tsx`

**Interfaces:**
- Consumes: `useStreak`, `SEMANTIC_COLORS`, `APP_FONT_FAMILIES`, `AnimatedFireIcon`
- Produces: Aligned, high-contrast streak counter with 7-column status dots.

- [ ] **Step 1: Update WeeklyStreakWidget.tsx**
1. Left side: `🔥 {currentStreak} day streak` in `text-[16px] font-bold text-ink`.
2. Right side: 7 vertical columns (`gap-3`):
   - Day initial `S M T W T F S` in `text-[11px] font-bold text-ink-soft` (darker contrast).
   - Below letter: 8×8 pt indicator:
     - Completed: filled forest circle (`w-2 h-2 rounded-full bg-brand-primary`).
     - Incomplete: hollow circle (`w-2 h-2 rounded-full border-[1.5px] border-border-default bg-transparent`).
3. Add `// ponytail: aligned streak row with clean status dots`.

- [ ] **Step 2: Verify TypeScript correctness**
Run `npx tsc --noEmit` on `WeeklyStreakWidget.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/components/Streak/WeeklyStreakWidget.tsx
git commit -m "style(streak): align streak row and use clean status dots"
```

---

### Task 4: Inset Refresh Button and Tighten FeaturedPromptCard
**Files:**
- Modify: `src/components/FeaturedPromptCard/FeaturedPromptCard.tsx`

**Interfaces:**
- Consumes: `Card`, `BeginButton`, `Feather`, `SEMANTIC_COLORS`
- Produces: Proportioned reflection hero card with comfortable insets.

- [ ] **Step 1: Update FeaturedPromptCard.tsx**
1. Refresh button container: change `right-2 top-2` to `right-3.5 top-3.5`.
2. Card content padding: `contentClassName="min-h-[150px] p-4 pt-3.5 pb-4"`.
3. BeginButton top margin: change from `marginTop: 14` to `marginTop: 10`.
4. Add `// ponytail: inset prompt refresh button and tighten card vertical whitespace`.

- [ ] **Step 2: Verify TypeScript correctness**
Run `npx tsc --noEmit` on `FeaturedPromptCard.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/components/FeaturedPromptCard/FeaturedPromptCard.tsx
git commit -m "style(hero): inset prompt refresh button and tighten card padding"
```

---

### Task 5: Refine Greeting Typography in JournalCalendarScreen
**Files:**
- Modify: `src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx`

**Interfaces:**
- Consumes: `Greeting`, `FeaturedPromptCard`, `EmotionLogger`, `WeeklyStreakWidget`
- Produces: Calibrated typography hierarchy where prompt question is the clear hero.

- [ ] **Step 1: Update JournalCalendarScreen.tsx**
1. Update `Greeting` component text:
   Change `text-[28px] font-semibold tracking-tight text-ink` to `text-[22px] font-bold tracking-tight text-ink`.
2. Update eyebrow text:
   Change `text-[13px] font-bold tracking-wider text-ink-soft uppercase` to `text-[12px] font-bold tracking-wider text-ink-soft uppercase`.
3. Add `// ponytail: calibrated greeting scale to emphasize prompt hero`.

- [ ] **Step 2: Verify TypeScript correctness**
Run `npx tsc --noEmit` on `JournalCalendarScreen.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx
git commit -m "style(home): refine greeting typography hierarchy"
```

---

### Task 6: End-to-End Verification & Knowledge Graph Sync
**Files:**
- No file changes

- [ ] **Step 1: Full TypeScript verification**
Verify clean compilation of all files.

- [ ] **Step 2: iOS Simulator Screenshot**
Capture screenshot via `argent` MCP tool to verify visual polish in live app.

- [ ] **Step 3: Update Knowledge Graph**
Run `graphify update .` to sync AST knowledge graph.
