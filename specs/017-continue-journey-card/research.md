# Research & Architecture Decisions: Continue Your Journey Card

**Feature**: `017-continue-journey-card`
**Date**: 2026-09-08
**Status**: Completed

## 1. Active Course & Next Activity Resolution

### Decision
Reuse existing authoritative selectors and hooks from `src/domains/journey/`:
- `useActiveCourse()` to resolve `courseId` from enrollment and catalog state.
- `useJourneyMap(courseId)` to ensure the normalized Redux course tree is loaded without duplicating network requests.
- `selectCourse(state, courseId)` to retrieve the active course entity (title, iconUrl, colorHex).
- `selectCurrentNodeForCourse(state, courseId)` which uses `findCurrentNodeIdInCourse()` to traverse course units and locate the first non-completed progression node, skipping automated milestone nodes (e.g. trophies).

### Rationale
- Zero code duplication: `findCurrentNodeIdInCourse()` already implements the canonical traversal logic, skipping trophies and respecting completion statuses (`completed`, `in_progress`, `attempted`).
- O(1) index lookups: The Redux store maintains normalized relationship indexes (`sectionsByCourse`, `unitsBySection`, `nodesByUnit`), preventing O(N) entity scans.
- Reactivity: When an activity completes or updates in Redux (`optimisticSetNodeStatus` or `setCourseProgress`), the memoized selector invalidates and re-derives immediately, achieving the <500ms sync requirement (SC-002) with zero manual refresh logic.

### Alternatives Considered
- *Custom traversal hook in Home*: Rejected because duplicating progression logic risks divergence from the Journey map and violates the single source of truth rule.
- *Async API fetch on Home mount*: Rejected because the normalized Redux store already caches loaded trees; issuing redundant network calls increases latency, server load, and risks flashing stale progress.

---

## 2. Card Presentation States & Container-Presenter Architecture

### Decision
Implement a pure presentation component (`ContinueJourneyCardView`) driven by a custom controller hook (`useContinueJourneyViewModel`). The hook resolves one of five mutually exclusive states:
1. `State A: ActiveWithNextActivity` — Active course + next progression node found.
2. `State B: NoActiveCourse` — No active course enrolled or selected.
3. `State C: CourseCompleted` — Active course loaded, but `selectCurrentNodeForCourse` returns null (all required nodes completed).
4. `State D: Loading` — Enrollment resolution or course tree fetch in progress.
5. `State E: ErrorFallback` — Network/data failure loading course or progress.

### Rationale
- Clean separation of concerns: Presenter handles only Tailwind layouts, typography, pressed states, and accessibility props.
- Predictable UI state: Discriminated union ensures only one state renders at any time, eliminating flash-of-empty-content (SC-003).
- Strict line count adherence: Separating view and view model guarantees each file remains well under the 300-line ceiling (Principle VII).

### Alternatives Considered
- *Single monolith component*: Rejected because combining Redux selectors, navigation hooks, Haptics, and 5 visual states would approach or exceed the 300-line limit.
- *Conditional child screens*: Rejected as over-engineering for a compact secondary card.

---

## 3. Visual Sizing, Spacing & Cognitive Hierarchy

### Decision
Place the card in `src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx` directly beneath the `WeeklyStreakWidget` container (`mt-8`).
- Card layout: A compact, rounded container (`rounded-2xl border border-sand/40 bg-surface-card p-4`) using the calm forest/sage/cream palette (`SEMANTIC_COLORS`).
- Visual hierarchy:
  1. Section Eyebrow: "CONTINUE YOUR JOURNEY" (`text-[11px] font-semibold tracking-wider text-ink-muted/80 uppercase`).
  2. Course Identity: Course artwork thumbnail + course title (`happy-font-heading text-[16px] text-ink`).
  3. Next Activity metadata: "Next: [Title]" (`happy-font-body-bold text-[14px] text-ink-soft`), with optional duration pill ("3 min").
  4. Primary Action Button: "Continue learning" with forward arrow (`happy-font-body-bold text-[13px] text-brand-primary`), full card surface tappable with standard pressed feedback.
- Sizing constraints: Maximum height ~140px on standard viewports, keeping Today's Reflection prominently visible above the fold.

### Rationale
- Aligns with `DESIGN.md` and Home screen redesign specs: Reflection card remains the dominant hero; Continue Journey card acts as a quiet, secondary resume affordance.
- Impeccable tap target: Entire card surface is interactive (≥48x48pt accessibility standard) with subtle scale/pressed opacity feedback.

### Alternatives Considered
- *Prominent Duolingo-style 3D floating button*: Rejected because Home screen guidelines require calm adult tone; oversized bright buttons would compete with Today's Reflection.
- *Horizontal card carousel*: Explicitly out of scope; creates cognitive clutter.

---

## 4. Navigation & Route Handling

### Decision
- **State A (Continue learning)**: `router.push({ pathname: "/tabs/screens/journey-flow", params: { courseId, nodeId } })`. Preserves in-progress session and triggers standard exercise engine.
- **State B (Explore journeys)**: `router.push("/tabs/(tabs)/journeys")`. Switches active bottom tab to Journeys where user can browse the catalog.
- **State C (Review your skills)**: `router.push("/tabs/(tabs)/journeys")`. Switches to Journeys tab where user can review completed milestones and course map.
- **State E (Open journeys)**: `router.push("/tabs/(tabs)/journeys")`. Safe fallback.

### Rationale
- Uses existing Expo Router typed paths without introducing new routes.
- Switching to `/tabs/(tabs)/journeys` leverages Expo Router's native tab switching behavior cleanly.

### Alternatives Considered
- *Presenting CourseCatalogSheet directly on Home*: Rejected during clarification (Session 2026-09-08, Q2); switching to Journeys tab maintains the Journey screen as the single authoritative place for full exploration.

---

## 5. Analytics & Observability

### Decision
Use existing PostHog client (`usePostHog` from `posthog-react-native`) already present in `JournalCalendarScreen.tsx`:
- `home_journey_card_viewed`: fired on initial mount / state resolution with `{ state, course_id }`.
- `home_journey_card_tapped`: fired on card press with `{ action, course_id, activity_id }`.

### Rationale
- Adheres to Principle V: Persists only identifiers and state enums, zero therapeutic copy.
- No new dependencies or analytics SDKs required.
