# Research Findings: UI Style Polish

## Component Paths & Variables
- **Decision**: The specific UI tweaks will be applied to:
  - `src/components/exercise/CourseExerciseFeedbackPanel.tsx` (feedback icon size)
  - `src/components/exercise/IntuitionCheckCategoryEngine.tsx` (feedback reveal icon size)
  - `src/components/exercise/CourseExerciseShell.tsx` (CTA depth, Skip button typography)
- **Rationale**: These are the direct components rendering the journey map exercise UI wrappers and feedback cards.
- **Alternatives considered**: Global stylesheet overrides were considered but rejected because React Native and Expo Router rely on component-scoped `StyleSheet` objects and `courseExerciseTheme.ts` tokens.
