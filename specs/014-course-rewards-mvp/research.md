# Research: Course Rewards MVP — Repository Discovery Report

**Feature:** `specs/014-course-rewards-mvp`
**Branch:** `014-course-rewards-mvp`
**Date:** 2026-09-03

---

## 1. Existing Project Hierarchy and Completion Rules

### Hierarchy
```
Course → Section → Unit → Node (lesson / checkpoint / chest)
```

All entities are stored in Supabase and loaded into Redux via normalized entity adapters in `journeySlice.ts`:
- `coursesAdapter`, `sectionsAdapter`, `unitsAdapter`, `nodesAdapter`
- Relationship indexes: `sectionsByCourse`, `unitsBySection`, `nodesByUnit`

### Completion Rules (server-authoritative)
- Node completion → `complete-journey-node` Supabase Edge Function (`supabase/functions/complete-journey-node/index.ts`)
- The edge function marks the node's progress row complete, resolves the next node, and applies XP/gem rewards.
- `CompleteNodeResponse` (in `src/types/journeyV5.ts`) returns flags: `unitCompleted`, `sectionCompleted`, `courseCompleted`, `nextNodeId`.
- Course status (`in_progress` | `completed`) is stored in `user_course_progress`. Node status is in `user_node_progress`.
- `DerivedStatus` for units/sections is **client-computed** in `journeyProgress.ts` from node progress — never stored directly.

---

## 2. Relevant File Paths and Module Responsibilities

| Path | Responsibility |
|------|---------------|
| `src/types/journeyV5.ts` | Canonical v5 types: `Course`, `Unit`, `Node`, `UserNodeProgress`, `UserCourseProgress`, `CompleteNodeResponse` |
| `src/types/journey/enums.ts` | `NodeStatus`, `NodeType`, `JourneyRewardType` enums |
| `src/types/journey/node.ts` | `PathNodeData`, `JourneyNode`, `JourneyReward` — FlashList node shapes |
| `src/domains/journey/state/journeySlice.ts` | Redux slice: entity stores, progress maps, UI state |
| `src/domains/journey/state/journeySelectors.ts` | Memoized selectors for all journey data |
| `src/lib/journey/journeyProgress.ts` | Client-side completion derivation (`resolveDerivedStatusFromNodeIds`) |
| `src/domains/journey/data/journeyApi.ts` | RTK Query endpoints: `completeNode`, `getCourseProgress` |
| `src/domains/journey/ui/hooks/useJourneyMapController.tsx` | Master controller for the journey map screen — owns `rewardNode`, `handleClaimReward`, `handleNodePress` |
| `src/domains/journey/ui/components/ChestNode.tsx` | Presentational chest node on the path |
| `src/domains/journey/ui/components/ChestRewardModal.tsx` | SwiftUI BottomSheet for chest claim |
| `src/domains/journey/ui/hooks/useChestRewardModalViewModel.ts` | Chest modal VM |
| `src/domains/journey/ui/hooks/useNodeCompletionModalViewModel.ts` | Lesson completion modal VM (existing shell) |
| `src/domains/journey/ui/hooks/useUnitCompleteModalViewModel.ts` | Unit complete modal VM (existing shell — uses `xpEarned`, not capability statement) |
| `src/data/journey/journeyConfig.ts` | **The config file** — NODE_VARIANT_REGISTRY, COLOR_THEME_REGISTRY, SECTION_CONFIGS, UNIT_CONFIGS; no reward authored copy here yet |
| `supabase/functions/complete-journey-node/` | Edge function: completion, reward application, next-node resolution |

---

## 3. Current Content Schema and Validators

- `Node.type` (in `journeyV5.ts`): `"lesson" | "story" | "quiz" | "exercise" | "practice" | "challenge" | "boss" | "mood_check" | "journal" | "checkpoint" | "chest" | "ai_insight"` — `"chest"` already exists.
- `NodeType` enum (in `enums.ts`): `LESSON`, `CHECKPOINT`, `CHEST` — chest is already a valid node type.
- `PathNodeData.rewards: JourneyReward[]` — already carries per-node reward metadata.
- No authored content schemas exist yet for: lesson takeaways, unit capability statements, unit insight card content, course capability summaries.
- `journeyConfig.ts` is the established config pattern. It holds authored UI data (mascot messages, node labels, etc.) as pure data objects updated via OTA.

---

## 4. Current Journey-Map Components and Visual States

- **ChestNode.tsx** — renders `🔒` (locked) or `🎁` (unlocked). Has `shineStyle` (pulse glow) and `shakeStyle` animations.
- **ChestRewardModal.tsx** — SwiftUI `BottomSheet` with `Claim Rewards` button. Currently shows "Treasure Chest!" generic copy — not authored insight content.
- **Chest status** — `NodeStatus.LOCKED`, `NodeStatus.ACTIVE` (= available), `NodeStatus.COMPLETED`. Three visual states exist. The spec requires four: Locked / Available / Opening (transient) / Claimed.
  - **Gap**: No distinct "Claimed" state render exists. Post-claim the node status becomes `completed` server-side; client just hides the modal.
  - **Gap**: No "Opening" transient animation state.
- **Unit complete modal** — `useUnitCompleteModalViewModel.ts` exists with trophy scale animation and confetti, but renders lesson/checkpoint/chest counts and XP — no authored capability statement.
- **Lesson completion modal** — `useNodeCompletionModalViewModel.ts` exists, renders `node.rewards` badges — no takeaway content field.
- **Course completion** — ❌ No course-completion surface exists yet.

---

## 5. Canonical Progress Source and Data Flow

```
[User action] → completeNode RTK mutation
    → complete-journey-node Edge Function
        → marks node complete in DB
        → resolves next node / unit / course completion
        → returns { unitCompleted, courseCompleted, nextNodeId, ... }
    → client dispatches setCourseProgress with fresh progress refetch
    → Redux selectors derive unit/section statuses client-side
    → UI re-renders
```

The completion flags `unitCompleted` and `courseCompleted` are returned by the edge function but **currently unused client-side** — only `nextNodeId` drives navigation. The rewards module reads the flags but only for XP/gem application.

**Decision:** These existing server-returned flags are the hook point for triggering reward celebrations. No new API is needed.

---

## 6. Existing Offline/Sync Behavior

- App does **not** have full offline lesson completion support. Completion requires network call to `complete-journey-node`.
- Progress is fetched fresh after each completion via `getCourseProgress` forced refetch.
- No local-first queue or offline sync infrastructure exists.
- **Decision:** Reward state persistence will follow the same online-first pattern. Chest claim and trophy states are durable server-side via existing `user_node_progress` table (completed status = claimed).

---

## 7. Existing Primitives

| Primitive | Location | Status |
|-----------|----------|--------|
| SwiftUI BottomSheet | `@expo/ui/swift-ui` BottomSheet | ✅ Used in ChestRewardModal |
| `@gorhom/bottom-sheet` BottomSheetModal | Used in UnitCompleteModal, NodeCompletionModal | ✅ Available |
| Confetti | `useUnitCompleteModalViewModel` references `showConfetti` | ✅ Exists (Lottie or library) |
| Trophy scale spring animation | `useUnitCompleteModalViewModel` | ✅ Exists |
| Haptics | `expo-haptics`, `lib/haptics/hapticUtils.ts` | ✅ Full suite |
| Reanimated spring/sequence | `react-native-reanimated` | ✅ Used throughout |
| Moti / Pressto | Listed in AGENTS.md | ✅ Available |
| Design tokens | `src/theme/colors.ts` (SEMANTIC_COLORS), `src/theme/radius.ts` (RADIUS) | ✅ Available |
| Reduce Motion | Custom in-app preference + system | ✅ Haptic utils already guard on it |

---

## 8. Existing Theme Tokens and Reusable Components

- **Colors:** `SEMANTIC_COLORS` (`brand.primary`, `warning.foreground`, `border.selected`, etc.) in `src/theme/colors.ts`
- **Typography:** `APP_FONT_FAMILIES` in `src/theme/typography.ts`; Nunito via `Text` component
- **SvgAppButton:** Physical 3D button in `src/domains/journey/ui/components/svg-app-button/`
- **AnimatedNodeButton:** Reusable animated node button wrapper
- **ChestNode / ChestRewardModal:** Reusable but need authored content support added

---

## 9. Existing Analytics and Tests

- No existing unit or integration tests found for journey completion flows.
- Analytics: no structured event system found; logging is via `console.error` in edge functions.
- **Decision:** Use `console.log` for minimal analytics events as per spec FR-17 (not in this spec but referenced in PRD). No new analytics infrastructure needed.

---

## 10. Production Progress and Migration

- Production users have `user_node_progress` and `user_course_progress` records.
- **Schema additions are additive** — adding new columns to content tables or new authored JSON config does not break existing rows.
- No migration is required for the progress tables themselves.
- The `journeyConfig.ts` additions (authored reward content) are OTA-safe — new fields simply won't exist for old content and the feature must fail open gracefully (FR-5.6).

---

## 11. Smallest Schema Additions Necessary

### Client-side config schema (bundled JSON in `journeyConfig.ts` or a new `rewardsConfig.ts`)

```typescript
// New authored content shape per unit
interface UnitRewardContent {
  unitId: string;
  capabilityStatement: string;          // "You can now…" — FR-3.3
  insightCard: {
    title: string;
    body: string;
  };
  chestEnabled?: boolean;               // FR-2.3 — author can omit
  chestPositionOverride?: number;       // FR-2.3 — 0-based node index override
}

// New authored content shape per lesson node
interface LessonTakeaway {
  nodeId: string;
  takeaway: string;                     // FR-1.2/FR-1.3
}

// New authored content shape per course
interface CourseRewardContent {
  courseId: string;
  capabilitySummary: string[];          // 3–5 bullet strings — FR-4.3
  acknowledgement: string;             // warm acknowledgement — FR-4.3
}
```

### Redux state additions (inside `journeySlice`)
- None to core progress state (progress stays server-authoritative).
- Add to UI state:
  ```typescript
  pendingCelebration: Record<string, 'lesson' | 'unit' | 'course' | null>;
  courseFinaleSeenByCourse: Record<string, boolean>;
  ```

### No new DB tables needed for MVP.
- Chest claim state = `user_node_progress.status === 'completed'` for chest-type nodes (already tracked).
- Unit trophy state = all unit nodes completed (already derivable from existing data).
- Course completion state = `user_course_progress.status === 'completed'` (already tracked).
- Course finale "seen" flag: store in Redux + `AsyncStorage` key `course_finale_seen_<courseId>`.

---

## 12. Smallest Set of Implementation Slices

1. **Slice A — Authored content config** (`rewardsConfig.ts`): Define schema, add authored data for sleep-reset course, add gap-detection logging.
2. **Slice B — Celebration Orchestrator hook** (`useCelebrationOrchestrator.ts`): Reads `CompleteNodeResponse` flags, selects correct celebration level, emits one event.
3. **Slice C — Lesson completion surface**: Upgrade `ChestRewardModal`-pattern to a new `LessonCompleteSheet` using the takeaway from config.
4. **Slice D — Chest insight reveal**: Extend `ChestRewardModal` to show authored insight card title/body instead of generic text. Add "Claimed" visual state to `ChestNode`.
5. **Slice E — Unit trophy surface**: Upgrade `UnitCompleteModal` to display capability statement from config instead of XP counts.
6. **Slice F — Course finale surface**: New `CourseFinaleScreen` (full-screen, not a sheet). Add "seen" persistence.
7. **Slice G — Journey map integration**: Wire orchestrator into `useJourneyMapController`, render correct surface per celebration level.

---

## 13. Contradictions with Current Architecture

| Spec requirement | Current architecture | Resolution |
|-----------------|---------------------|-----------|
| Four chest states (Locked / Available / Opening / Claimed) | Three states only (`locked`, `active`, `completed`) | Add transient `opening` local UI state in `useChestNodeViewModel`; `claimed` maps to existing `completed` status with a distinct visual |
| `unitCompleted` / `courseCompleted` consumed client-side | Flags returned but ignored | Read from `completeNode` RTK mutation result in `useJourneyMapController` |
| Lesson takeaway from authored metadata | No takeaway field on Node | Add to `rewardsConfig.ts` keyed by nodeId; fail-open to neutral text if absent |
| Course finale shown once, restored after app closure | No persistence for "seen" | `AsyncStorage` key + Redux UI state |
| Chest content is authored (not generic) | Modal shows "Treasure Chest!" hardcoded | Replace with config lookup in `ChestRewardModal` |
| Capability statement authored per unit | UnitCompleteModal shows XP + lesson/checkpoint counts | Upgrade modal to use config lookup; keep XP display |

---

## 14. Unresolved Product Decisions

None — all clarification questions were answered in the spec (Session 2026-09-03). Implementation can proceed.

---

## Summary

The existing codebase has strong structural foundations for this feature:
- Chest node infrastructure (ChestNode, ChestRewardModal, claim flow) already exists but lacks authored content.
- Unit complete and node completion modals already exist but lack authored copy.
- `completeNode` already returns `unitCompleted` and `courseCompleted` flags — just unused.
- Config-driven pattern (`journeyConfig.ts`) is established and OTA-safe.

The MVP adds **authored content config + celebration orchestration** on top of existing plumbing. No new state library, DB table, currency, or generalized reward platform is required.
