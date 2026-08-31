# Implementation Tasks: Global Semantic Color System Refactor

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the new centralized `src/theme/` directory and foundational contracts before migrating components.

- [X] T001 Create `src/theme/palette.ts` to export neutralized primitive colors (e.g., `SAGE`, `NEUTRAL`, `RED`, `ORANGE`). Ensure legacy external brand names (like `TERRACOTTA`) and semantic intent (like `SAGE.selected`) are omitted.
- [X] T002 [P] Create `src/theme/colors.ts` to implement the `SemanticColors` contract and `AdaptiveColor` helper (with `highContrastLight`/`highContrastDark` support).
- [X] T003 [P] Create `src/theme/elevation.ts`, `src/theme/typography.ts`, `src/theme/spacing.ts`, and `src/theme/radius.ts` to house the remaining design tokens.
- [X] T004 Bridge the semantic color palette into `global.css` using CSS variables within `@layer theme` and the `@theme` block to support native Tailwind v4 utility classes.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Wire the new architecture and execute the hard deletion of legacy tokens.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Refactor `src/components/exercise/courseExerciseTheme.ts` to re-export `SEMANTIC_COLORS` directly from `src/theme/colors.ts`, ensuring the exercise engine remains stable.
- [X] T006 [P] Delete legacy primitive usage (`SAGE.selected`, `SAGE.pill`, opacity aliases like `faint`/`mist`) and unused external palettes from `lib/tokens.ts` (or fully deprecate the file if empty).
- [X] T007 [P] Delete legacy `BRAND_CANVAS`, `BRAND_SURFACE`, `CREAM`, `WARM_WHITE`, and `BRAND_DARK` from their respective definition files (e.g., `lib/tokens.ts` or `constants/Colors.ts`).
- [X] T008 [P] Delete the duplicate `THEME` object, `LIGHT_TOKENS`, and `DARK_TOKENS` from the codebase to force a hard cutover.

**Checkpoint**: Foundation ready. Legacy tokens are destroyed. The app is likely broken at this stage and ready for the migration wave.

---

## Phase 3: User Story 1 - App-Wide Semantic Migration (Priority: P1) 🎯 MVP

**Goal**: Migrate all remaining screens and components to consume the new `src/theme/colors.ts` API or NativeWind classes, fixing the broken imports from Phase 2.

**Independent Test**: The app builds without TypeScript errors, and navigating through Onboarding, Journal Entries, and Settings renders correctly in light and dark mode.

### Implementation for User Story 1

- [X] T009 [P] [US1] Sweep `src/components/` (excluding the already migrated `exercise/` folder) to replace all legacy token imports with `SEMANTIC_COLORS` or equivalent Tailwind classes.
- [X] T010 [P] [US1] Sweep `src/screens/` to replace legacy `THEME` and primitive color imports with `SEMANTIC_COLORS` or Tailwind classes.
- [X] T011 [P] [US1] Sweep `src/domains/` to replace legacy token usage with `SEMANTIC_COLORS` or Tailwind classes.
- [X] T012 [P] [US1] Sweep `app/` (Expo Router layout files) to replace legacy token usage with `SEMANTIC_COLORS` or Tailwind classes.

**Checkpoint**: At this point, User Story 1 should be fully functional, and the app should successfully compile.

---

## Phase 4: User Story 2 - Verify High-Contrast & Tailwind Integration (Priority: P2)

**Goal**: Ensure that `global.css` classes are actively working and that accessibility contrast variants respond to system settings.

**Independent Test**: A component styled exclusively with `className="bg-brand-primary text-text-primary"` renders identically to one styled with `style={{ backgroundColor: SEMANTIC_COLORS.brand.primary }}`.

### Implementation for User Story 2

- [X] T013 [P] [US2] Update a representative component (e.g., a core Button or Card) to use the new NativeWind v4 classes (e.g., `bg-surface-primary border-border-default`) instead of runtime JS colors.
- [X] T014 [US2] Configure iOS Simulator to "Increase Contrast" and verify that the `AdaptiveColor` hook successfully falls back to `highContrastLight` or `highContrastDark`.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validation and code cleanliness.

- [X] T015 Run `npx tsc --noEmit` to guarantee absolutely zero `Cannot find name 'THEME'` or `Property does not exist` errors remain across the entire repository.
- [X] T016 Run Quickstart validation (Light Mode, Dark Mode, High Contrast Mode).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion. Breaks the build by deleting legacy.
- **User Stories (Phase 3+)**: Depend on Foundational. Will fix the build.
- **Polish**: Depends on all stories.

### Parallel Opportunities

- Creation of the new theme files (T002, T003) can be done in parallel.
- The destruction of legacy tokens (T006, T007, T008) can be done in parallel.
- The massive refactoring sweeps (T009-T012) can be executed in parallel across different directories by different agents or scripts.

## Parallel Example: User Story 1

```bash
# Launch migration sweeps in parallel across boundaries:
Task: "Sweep src/components/ to replace legacy..."
Task: "Sweep src/screens/ to replace legacy..."
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup the new `src/theme` structure and `global.css`.
2. Complete Phase 2: Nuke the old `THEME` and aliases.
3. Complete Phase 3 (US1): Fix all the resulting compiler errors by migrating to `SEMANTIC_COLORS`.
4. **STOP and VALIDATE**: Ensure the app builds and renders.

## Phase 6: Convergence
- [X] T017 Migrate remaining `@/lib/tokens` usages in `src/exercises/`, `src/hooks/`, and `src/lib/` to `SEMANTIC_COLORS` per FR-3 (partial)
- [X] T018 Fix remaining compiler errors caused by straggler legacy color references (e.g., `BRAND_DARK`, `OTTER_BLUE_TINT`, `TERRACOTTA_TINT`, `BRAND_BORDER`, `DANGER`) across `app/`, `src/components/`, and `src/exercises/` per FR-3 (partial)
- [X] T019 Delete `lib/useThemeColor.ts` (as dynamic colors are now natively handled by `SEMANTIC_COLORS`) and refactor its remaining usages in `src/components/ui/Text.tsx`, `src/components/FeaturedPromptCard/FeaturedPromptCard.tsx`, and `src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx` to directly consume `SEMANTIC_COLORS` per FR-1 and FR-2 (missing/partial)
