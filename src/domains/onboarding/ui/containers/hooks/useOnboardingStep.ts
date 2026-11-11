// ponytail: step navigation and progress state
import { useState, useCallback } from 'react';
import { OnboardingStep } from '../../../domain/enums';

export interface UseOnboardingStepReturn {
  step: OnboardingStep;
  progressFill: number;
  goToStep: (nextStep: OnboardingStep, progress: number) => void;
  goBack: () => void;
}

export function useOnboardingStep(): UseOnboardingStepReturn {
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.Hello);
  const [progressFill, setProgressFill] = useState<number>(0.08);

  const goToStep = useCallback((nextStep: OnboardingStep, progress: number): void => {
    setStep(nextStep);
    setProgressFill(progress);
  }, []);

  const goBack = useCallback((): void => {
    if (step === OnboardingStep.Saved) {
      setStep(OnboardingStep.Chat);
      setProgressFill(0.7);
    } else if (step === OnboardingStep.Chat) {
      setStep(OnboardingStep.GoalPick);
      setProgressFill(0.2);
    } else if (step === OnboardingStep.GoalPick) {
      setStep(OnboardingStep.Hello);
      setProgressFill(0.08);
    }
  }, [step]);

  return { step, progressFill, goToStep, goBack };
}
