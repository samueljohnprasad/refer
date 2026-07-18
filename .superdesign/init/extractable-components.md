# Extractable Components

## ExerciseFlowShell
- Source: `src/screens/ExerciseFlowScreen/ExerciseFlowScreen.tsx`
- Category: layout
- Description: Native exercise shell with progress header, scroll body, and sticky action footer.
- Extractable props: progress, isValid, nextLabel, canGoBack.
- Hardcoded: safe-area behavior, close icon, progress treatment, Continue and Back positions.

## StepTitle
- Source: `src/exercises/thoughtReframing/customSteps.tsx`
- Category: basic
- Description: Cormorant screen title and Geist subtitle.
- Extractable props: title, subtitle.
- Hardcoded: typography variants and vertical rhythm.

## EmotionChip
- Source: `src/screens/ThoughtReframingScreen/components/EmotionChip.tsx`
- Category: basic
- Description: Checkbox-like emotion choice with emoji and selected state.
- Extractable props: label, emoji, isSelected, disabled.
- Hardcoded: 44px minimum target, sage selection treatment.

## DistortionCard
- Source: `src/screens/ThoughtReframingScreen/components/DistortionCard.tsx`
- Category: basic
- Description: Cognitive-pattern choice with icon, title, description, and check state.
- Extractable props: label, description, icon, isSelected, disabled.
- Hardcoded: typography and sage selection treatment.

