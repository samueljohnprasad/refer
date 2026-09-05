# Home Screen UI & Cognitive Hierarchy Redesign Spec

**Date:** 2026-09-06  
**Topic:** Home Screen (JournalCalendarScreen) Cognitive Hierarchy Polish  
**Status:** Approved by User (Option A: Keep raster mood emojis)  

---

## 1. Overview & Core Philosophy

The Home screen transitions from an unfocused dashboard with multiple competing containers to an action-first guided experience inspired by Apple HIG and Duolingo's core learning path:
1. **Context & Greeting**: Orientation ("Time to wind down, Friend").
2. **Hero Action (Behavior)**: "TODAY'S REFLECTION" — The primary task for the day.
3. **Secondary Check-In (Self-Awareness)**: "How are you feeling?" — Lightweight mood check-in directly beneath reflection.
4. **Reinforcement (Progress)**: Compact streak strip — Motivational feedback placed after behavior.

---

## 2. Component Specifications

### 2.1 Header Toolbar (`src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx`)
- **Reduce Cognitive Clutter**:
  - Remove Timeline (`chart.bar.doc.horizontal`) and Awards (`rosette`) buttons from `Stack.Toolbar`.
  - Retain single Settings button (`gearshape.fill`, `accessibilityLabel="Settings"`).

### 2.2 Reordering & Page Layout (`src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx`)
- **Visual Order**:
  1. `Greeting`
  2. `TODAY'S REFLECTION` (`FeaturedPromptCard`)
  3. `How are you feeling?` (`EmotionLogger`)
  4. `Streak` (`WeeklyStreakWidget`)
- **Spacing**:
  - Spacing between sections: `mt-8` for calm, breathable visual rhythm without arbitrary giant gaps.

### 2.3 Today's Reflection (`src/components/FeaturedPromptCard/FeaturedPromptCard.tsx`)
- **Label**: "TODAY'S REFLECTION" (eyebrow uppercase, `happy-font-body-bold text-[13px] tracking-wider text-ink-soft`).
- **Container Sizing**:
  - Reduce `min-h-[220px]` to `min-h-[170px]`.
  - Content padding tightened (`p-5 pt-4 pb-5`).
  - Text container: `min-h-[72px]` instead of `min-h-[112px]`, font size 24-26px for balanced prominence without vertical bloat.
- **Actions**:
  - Refresh button: Secondary icon with `accessibilityLabel="New prompt"`, positioned top-right.
  - Primary button: `Start reflection` with `SEMANTIC_COLORS.brand.primary` fill, title case.

### 2.4 Mood Logger (`src/components/EmotionLogger.tsx`)
- **Headline**: "How are you feeling?" (`variant="h3"` or `happy-font-heading text-[18px] text-ink`).
- **Container**:
  - Remove outer `<Card>` container. Group using whitespace (`flex-row justify-between py-2`).
- **Visuals**:
  - Retain raster emojis (`terrible`, `bad`, `fine`, `good`, `great`) per user approval.
  - Retain labels (`Terrible`, `Bad`, `Okay`, `Good`, `Great`).

### 2.5 Streak Widget (`src/components/Streak/WeeklyStreakWidget.tsx`)
- **Container**:
  - Remove outer `<Card>` tile and giant 46px number box.
  - Transform into a compact reinforcement row:
    - Left: Compact pill/badge or inline text `🔥 {currentStreak} day streak` (Nunito bold).
    - Right: Compact horizontal weekday dots `S M T W T F S` with active flame / muted indicator.
    - Full width tap target preserving navigation to `/tabs/screens/xp-history`.

---

## 3. Verification & Acceptance Criteria
- **TypeScript**: Zero errors (`npx tsc --noEmit`).
- **Visual Hierarchy**:
  - Home screen presents Greeting $\rightarrow$ Today's Reflection $\rightarrow$ How are you feeling? $\rightarrow$ Streak.
  - No outer cards on Mood and Streak; reflection remains the single hero surface.
  - Top header toolbar contains only Settings.
- **Knowledge Graph**: Run `graphify update .`.
