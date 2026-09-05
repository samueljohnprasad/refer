# Home Screen Visual Polish & Cohesion Design Specification

- **Date:** 2026-09-06
- **Status:** Approved
- **Scope:** Home Screen (`JournalCalendarScreen`), Mood Check (`EmotionLogger`), Streak Strip (`WeeklyStreakWidget`), Reflection Hero (`FeaturedPromptCard`).

---

## 1. Context & Motivation

The Home screen has achieved the correct behavioral hierarchy:
`Greeting` $\rightarrow$ `Today's Reflection` $\rightarrow$ `How are you feeling?` $\rightarrow$ `Streak Strip`.

This specification covers the final visual polish pass to ensure aesthetic cohesion, calm mental-health tone, and high-craft finishes:
1. Replace raster/crayon emoji artwork with an in-house vector `MoodIcon` family (Terrible, Bad, Okay, Good, Great) that harmonizes with the brand's sage/forest palette.
2. Provide a clear selected state for mood check-in (sage fill + forest border + darker label).
3. Align the streak counter and weekly 7-day pattern on a shared baseline grid with high-contrast day initials and simple filled/hollow status dots.
4. Tighten vertical padding and inset the prompt cycle button on `FeaturedPromptCard`.
5. Calibrate the greeting font size to let the prompt question stand out as the primary content hero.

---

## 2. Component Specifications

### 2.1 Custom Vector `MoodIcon` Component
- **File:** `src/components/MoodIcon/MoodIcon.tsx` (extracted for reusability across app)
- **Props:**
  ```typescript
  export type MoodKey = "terrible" | "bad" | "okay" | "good" | "great";

  export interface MoodIconProps {
    mood: MoodKey;
    isSelected?: boolean;
    size?: number; // default 38
  }
  ```
- **Styling & Geometry:**
  - Standard circular boundary: 38×38 pt, 2 pt stroke.
  - Colors:
    - Unselected: stroke `SEMANTIC_COLORS.text.tertiary` / `#8F9E8B`, fill `SEMANTIC_COLORS.surface.canvas` / `#F4F7F4`.
    - Selected: stroke `SEMANTIC_COLORS.brand.primary` / `#2F5233`, fill `#E3EBE3` (soft sage highlight).
  - Feature lines (eyes and mouth):
    - `terrible`: two dot eyes, downward curved frown arc, slight furrowed brow marks.
    - `bad`: two dot eyes, angled downturned mouth segment.
    - `okay`: two dot eyes, straight horizontal line mouth.
    - `good`: two dot eyes, gentle upturned smile arc.
    - `great`: two upward curved arch eyes, wide grinning open mouth arc.
  - Built with universal `react-native-svg` (`Svg`, `Circle`, `Path`, `Line`).

### 2.2 `EmotionLogger` Refinements
- **File:** `src/components/EmotionLogger.tsx`
- **Updates:**
  - Replace raster PNG imports (`terrible`, `bad`, `fine`, `good`, `great`) with `MoodIcon`.
  - Pass `isSelected={selectedMoodId === emotion.id}` based on recent logs or local session selection.
  - Active label text: `text-[12px]` in `happy-font-body-bold`, tinted `text-brand-primary` when selected, `text-ink-soft` when unselected.
  - Hit target: Outer `PressableScale` retains minimum 48×48 pt touch area.
  - Light haptic feedback on press (`Haptics.impactAsync(Light)`).

### 2.3 `WeeklyStreakWidget` Shared Baseline Grid
- **File:** `src/components/Streak/WeeklyStreakWidget.tsx`
- **Updates:**
  - Container: `flex-row items-center justify-between py-2 px-1`.
  - Left side:
    - Flame icon (20×20 pt) + `Text` (`{currentStreak} day streak` in `text-[16px] font-bold text-ink`).
  - Right side:
    - 7-column flex row (`gap-3`):
      - Column layout per day:
        1. Day letter (`S`, `M`, `T`, `W`, `T`, `F`, `S`) in `text-[11px] font-bold`, color `SEMANTIC_COLORS.text.secondary` (high-contrast neutral).
        2. Dot indicator (8×8 pt):
           - If `isCompleted`: Filled forest circle (`backgroundColor: SEMANTIC_COLORS.brand.primary`, `rounded-full`).
           - If incomplete: Clean hollow ring (`borderColor: SEMANTIC_COLORS.border.default`, `borderWidth: 1.5`, `rounded-full`, transparent background).
  - Eliminates secondary flame icons in the day dots for minimal cognitive noise.

### 2.4 `FeaturedPromptCard` Tightening
- **File:** `src/components/FeaturedPromptCard/FeaturedPromptCard.tsx`
- **Updates:**
  - Inset prompt refresh button: change from `right-2 top-2` to `right-3.5 top-3.5` (giving 14 pt inset from boundaries).
  - Tighten vertical whitespace:
    - Content wrapper padding: `p-4 pt-3.5 pb-4`.
    - Button top margin: reduce from `marginTop: 14` to `marginTop: 10`.
  - Preserve prompt question typography: 24 pt extraBold, -0.4 letter spacing, 28 pt line height.

### 2.5 Header & Greeting Hierarchy
- **File:** `src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx`
- **Updates:**
  - Greeting text: change from `text-[28px] font-semibold` to `text-[22px] font-bold tracking-tight text-ink`.
  - Eyebrow: `"Today's reflection"` styled in `text-[12px] font-bold tracking-wider text-ink-soft uppercase`.
  - Result: The 24 pt reflection question clearly anchors the screen as the primary task hero.

---

## 3. Data & State Flow

1. **Emotion Logging:**
   - User taps `MoodIcon`.
   - Local state immediately marks icon as selected with soft sage fill and border tint.
   - `handleLogEmotion` writes to database via existing `useEmotionLogger` hook.
   - Triggers light haptic feedback.
2. **Streak Reinforcement:**
   - `useStreak()` provides `{ currentStreak, weeklyProgress }`.
   - Grid renders day initials and completed/hollow status dots deterministically.

---

## 4. Verification & Constraints

- **Design System Tokens:** `SEMANTIC_COLORS`, `APP_FONT_FAMILIES`, NativeWind Tailwind classes.
- **Touch Sizing:** All touch targets $\ge 44 \times 44$ pt.
- **File Size Limits:** All files strictly under 300 lines.
- **Code Standards:** Strictly typed TypeScript, no `any`, `// ponytail:` tags on simplifications.
- **Verification Plan:**
  1. `npx tsc --noEmit` check.
  2. Capture simulator screenshot via `argent` MCP tool.
  3. Run `graphify update .` post-edit.
