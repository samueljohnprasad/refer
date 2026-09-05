# Journal + Habits + Calendar UI & Cognitive Load Polish Design Spec

**Date:** 2026-09-05  
**Topic:** Journal + Habits + Calendar Polish  
**Status:** Approved by User  

---

## 1. Overview & Goal

Refine the Journal, Habits, and Calendar screens to eliminate excessive visual noise and reduce cognitive load while preserving existing information architecture:
- **Calendar = WHEN**
- **Journal / Habits = WHAT**
- **Bottom Tabs = WHERE IN THE APP**

Key targets:
- Soften the empty mood slot under dates from a prominent dashed button to a subtle placeholder.
- Soften the month header dominance and tighten vertical calendar spacing without reducing touch targets.
- Standardize selected date styling between week and month views.
- Scale down empty-state mascot illustrations (~15%) and tighten grouping between illustration and copy.
- Shorten Habits empty-state copy to immediate value proposition.

---

## 2. Component Specifications

### 2.1 `MoodBadge.tsx` (Mood Slot & Emojis)
- **Recorded Moods**: Retain raster emoji images (`terrible`, `bad`, `fine`, `good`, `great`) for days with logged moods.
- **Empty Slot Placeholder**:
  - Remove spinning Reanimated logic (`plusRotation`).
  - Render a delicate, subtle ring with 1px border.
  - Render a compact 10px `Add01Icon` with `strokeWidth={1.5}` in `SEMANTIC_COLORS.text.tertiary`.
  - Opacity:
    - Default (Week view): `0.22`.
    - Month view (`displayOnly = true`): `0.12` to prevent 30+ dates from creating visual noise.

### 2.2 `DailyNotesHeader.tsx` (Week Calendar Header)
- **Month Title Typography**:
  - Change "August 2026" from 28px `h1` to `h2` (`21px`).
  - Keeps month/year orientation clear and centered without competing with content below.
- **Vertical Spacing**:
  - Reduce week day container margin-bottom from `mb-3` to `mb-1.5`.
  - Tighten container padding to bring Journal/Habits content up sooner.
  - Maintain 44×44 pt minimum touch targets for all day buttons.

### 2.3 `CalendarPicker.tsx` (Expanded Month View)
- **Unified Selection Style**:
  - Align selected day circle container to use `SEMANTIC_COLORS.selection.surface` and `SEMANTIC_COLORS.selection.foreground` border, matching week view.
- **Month Navigation Controls**:
  - Slightly quiet the previous/next chevron buttons (`h-9 w-9` with subtle background).

### 2.4 `EmptyState.tsx` (Mascot & Spacing)
- **Mascot Scale**:
  - Reduce size from `140` to `120` (~15% reduction) so the illustration doesn't overpower the action area.
- **Grouping Spacing**:
  - Reduce bottom margin under mascot from `mb-8` to `mb-4`.
  - Group illustration closely with title and description text.

### 2.5 `HabitsSection.tsx` (Habits Empty State)
- **Empty State Copy**:
  - Update description from `"Build healthy routines with daily tracking and streaks."` to `"Build routines with simple daily tracking."`.
  - Retain `"+ Add Habit"` as the clean, single primary CTA.

### 2.6 `EntryCardsView.tsx` (Journal Empty State)
- **Copy & Actions**:
  - Retain `"A private space to capture your thoughts."`.
  - Retain `"Record Voice"` (primary brand button) and `"Write Text"` (secondary outline button).

---

## 3. Verification & Testing

- **TypeScript Compilation**: Run `npx tsc --noEmit` to verify zero type errors in touched files.
- **Visual & Interaction Check**:
  - Verify week strip displays quiet `+` slot for unlogged dates and emojis for logged dates.
  - Verify month picker has faint empty slots and consistent selection tokens.
  - Verify EmptyState in both Journal and Habits tabs displays balanced 120px mascot and tightened copy.
- **Knowledge Graph**: Run `graphify update .` to update codebase knowledge graph.
