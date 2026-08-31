# Specification: JS-Driven Exercise Config for Journey Map Exercises

## 1. Context & Scope

**Background**: The journey map exercises (course exercises/microlearning) currently map a specific `CourseExerciseCategoryEnum` to a React engine via `courseExerciseCategoryEngineRegistry.ts`. However, behavior configuration and validation are scattered across the codebase using `if (category === ...)` checks, particularly in `microlearningContentValidation.ts` and UI wrappers.

**Goal**: Apply the `js-driven-exercise-config` architectural pattern to enforce the rule: "Exercise identity selects configuration. Components consume configuration."

**Out of Scope**: 
- Modifying the visual design of existing exercises.
- Changing the backend payload schemas.
- Adding new exercise types.

## 2. User Scenarios & Flow

1. **Adding a New Exercise Category (Developer Flow)**:
   - A developer creates a new exercise engine.
   - Instead of modifying `microlearningContentValidation.ts` and `CourseExerciseShell.tsx`, the developer simply defines a `CourseExerciseCategoryConfig` object overriding specific default behaviors (e.g., `presentation.showSubtitle = true`) and providing a `validation` callback.
   - The developer registers the config in `courseExerciseCategoryEngineRegistry.ts`.

2. **Rendering an Exercise (User Flow)**:
   - When the user launches a journey exercise, the generic wrapper components (like `CourseExerciseShell`) read the resolved configuration for the exercise category.
   - The shell determines whether to show instructions, skip buttons, and specific progress indicators purely based on the configuration fields, unaware of the specific exercise identity.

## 3. Functional Requirements

- **FR-1: Expanded Configuration Interface**
  - `CourseExerciseCategoryConfig` MUST be updated to include standard semantic configuration blocks: `presentation`, `layout`, `progress`, `interaction`, `feedback`, `actions`, `capabilities`, and `validation`.
- **FR-2: Global Configuration Defaults**
  - A central `DEFAULT_COURSE_EXERCISE_CONFIG` MUST be defined to represent the baseline behavior for most exercises, preventing repetition in the registry.
- **FR-3: Configuration Resolution**
  - A `resolveCourseExerciseConfig` function MUST be implemented to merge the global defaults with a category's specific configuration overrides.
- **FR-4: Config-Driven Validation**
  - The `validateMicrolearningContent` function MUST dynamically invoke the `validation` callback from the resolved configuration instead of hardcoding `if (category === ...)` statements for each category.
- **FR-5: Config-Driven UI Wrappers**
  - The `CourseExerciseShell` and other layout components MUST consume configuration flags (e.g., `config.presentation.showSubtitle`) rather than checking `CourseExerciseCategoryEnum`.
- **FR-6: Registry Migration**
  - `courseExerciseCategoryEngineRegistry.ts` (and its sub-registries) MUST be updated to define these configurations for all 30+ existing exercise engines.

## 4. Success Criteria

- **Maintainability Metric**: 0 instances of `if (category === ...)` inside `microlearningContentValidation.ts`.
- **Migration Completeness**: 100% of the active course exercise categories in `courseExerciseCategoryEngineRegistry.ts` are migrated to the new configuration interface.
- **Visual Regression**: 0 unintended visual or behavioral changes to the existing exercises on iOS simulator.
- **Complexity Metric**: Cyclomatic complexity of `validateMicrolearningContent` is reduced to O(1) for category dispatch.

## 5. Assumptions & Dependencies

- **Assumptions**: 
  - All existing exercise categories can be mapped to the semantic config fields (e.g., `presentation`, `interaction`) without requiring complex new config structures.
- **Dependencies**: 
  - Depends on the existing `CourseExerciseCategoryEnum` and `courseExerciseCategoryEngineRegistry.ts` architecture.
