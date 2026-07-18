# Page Dependency Trees

## Thought Reframing Exercise Flow

Entry: `app/tabs/screens/exercise-flow.tsx`

Dependencies:
- `src/screens/ExerciseFlowScreen/ExerciseFlowScreen.tsx`
  - `src/data/exerciseRegistry.ts`
    - `src/exercises/thoughtReframing/config.ts`
      - `src/exercises/thoughtReframing/customSteps.tsx`
        - `src/components/ui/Text.tsx`
        - `src/components/ui/Card.tsx`
        - `src/components/GlowyInput.tsx`
        - `src/components/exercise/SuggestionCards.tsx`
        - `src/screens/ThoughtReframingScreen/components/EmotionChip.tsx`
        - `src/screens/ThoughtReframingScreen/components/DistortionCard.tsx`
        - `src/screens/ThoughtReframingScreen/components/BulletListInput.tsx`
        - `src/screens/ThoughtReframingScreen/data/emotions.ts`
        - `src/screens/ThoughtReframingScreen/data/cognitiveDistortions.ts`
        - `lib/tokens.ts`
      - `src/exercises/thoughtReframing/ThoughtReframingSummary.tsx`
  - `src/components/exercise/ExerciseRenderer.tsx`
  - `src/screens/ThoughtReframingScreen/components/StepHeader.tsx`
  - `src/components/ui/Button.tsx`
  - `src/components/ui/Text.tsx`
  - `lib/tokens.ts`
- `global.css`

Target render branches:
- `TREmotionsStep` in `customSteps.tsx`
- `TRDistortionsStep` in `customSteps.tsx`

