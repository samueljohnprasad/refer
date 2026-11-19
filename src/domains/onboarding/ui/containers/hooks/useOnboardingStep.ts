// ponytail: step navigation + the continuous stage bar ported from .agents/onboarding.html's
// STAGES/FROM/TO/stage()/inch(). Each answer inches the bar toward its stage's end, never past it.
import { useState, useCallback, useRef } from 'react';
import { OnboardingStep } from '../../../domain/enums';

const STAGES = ['Picking a topic', 'Seeing one', 'Your turn', 'Saved'] as const;
const FROM = [.08, .2, .6, 1] as const;
const TO = [.2, .6, .9, 1] as const;

export interface UseOnboardingStepReturn {
  step: OnboardingStep;
  progressFill: number;
  progressLabel: string;
  goToStep: (nextStep: OnboardingStep, stageIndex: number, reset?: boolean) => void;
  enterStage: (stageIndex: number, reset?: boolean) => void;
  inchProgress: () => void;
  goBack: () => void;
}

export function useOnboardingStep(): UseOnboardingStepReturn {
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.Hello);
  const [progressFill, setProgressFill] = useState<number>(0);
  const stageIndex = useRef<number>(0);

  const setStage = useCallback((n: number, reset = false): void => {
    stageIndex.current = n;
    setProgressFill((prev) => (reset ? FROM[n] : Math.max(prev, FROM[n])));
  }, []);

  const enterStage = useCallback((n: number, reset = false): void => setStage(n, reset), [setStage]);

  const goToStep = useCallback((nextStep: OnboardingStep, n: number, reset = true): void => {
    setStep(nextStep);
    setStage(n, reset);
  }, [setStage]);

  const inchProgress = useCallback((): void => {
    setProgressFill((prev) => prev + (TO[stageIndex.current] - prev) * .35);
  }, []);

  const goBack = useCallback((): void => {
    if (step === OnboardingStep.Saved) goToStep(OnboardingStep.Chat, 2);
    else if (step === OnboardingStep.Chat) goToStep(OnboardingStep.GoalPick, 0);
    else if (step === OnboardingStep.GoalPick) goToStep(OnboardingStep.Hello, 0);
  }, [step, goToStep]);

  return {
    step,
    progressFill,
    progressLabel: `${STAGES[stageIndex.current]}, step ${stageIndex.current + 1} of ${STAGES.length}`,
    goToStep,
    enterStage,
    inchProgress,
    goBack,
  };
}
