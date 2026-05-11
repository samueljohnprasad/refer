import { useCallback, useMemo, useState } from "react";
import {
  OnboardingStepName,
  OnboardingStage,
  OnboardingFormData,
  MotivationAnswer,
  StressLevel,
  JournalExperience,
  StressTiming,
  DailyGoalMinutes,
  FeelingEmoji,
  NotificationTime,
  PricingTier,
} from "../types";
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from "../constants";

export interface UseOnboardingFlowReturn {
  currentStepIndex: number;
  currentStep: OnboardingStepName;
  currentStage: OnboardingStage;
  totalSteps: number;
  progress: number;
  formData: OnboardingFormData;
  derivedPlanName: string;
  isFirstStep: boolean;
  isLastStep: boolean;
  goNext: () => void;
  goBack: () => void;
  updateMotivation: (answer: MotivationAnswer) => void;
  updateStressLevel: (level: StressLevel) => void;
  updateExperience: (exp: JournalExperience) => void;
  updateTiming: (timing: StressTiming) => void;
  updateDailyGoal: (minutes: DailyGoalMinutes) => void;
  updatePactSigned: () => void;
  updateFeeling: (feeling: FeelingEmoji) => void;
  updateNotificationTime: (time: NotificationTime) => void;
  updateNotificationPermission: (granted: boolean) => void;
  updatePricingTier: (tier: PricingTier) => void;
  updateTrialStarted: (started: boolean) => void;
}

const INITIAL_FORM_DATA: OnboardingFormData = {
  motivation: undefined,
  stressLevel: undefined,
  journalExperience: undefined,
  stressTiming: undefined,
  dailyGoal: 5,
  pactSigned: false,
  selectedFeeling: undefined,
  notificationTime: undefined,
  notificationPermissionGranted: false,
  selectedPricingTier: undefined,
  trialStarted: false,
};

const PLAN_NAME_MAP: Record<MotivationAnswer, string> = {
  anxiety: "Quieting the Storm",
  self_discovery: "Coming Home to Yourself",
  habits: "The Daily Reset",
  relationships: "Opening the Door",
};

export const useOnboardingFlow = (): UseOnboardingFlowReturn => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [formData, setFormData] =
    useState<OnboardingFormData>(INITIAL_FORM_DATA);

  const currentStep = useMemo(
    () => ONBOARDING_STEPS[currentStepIndex].name,
    [currentStepIndex],
  );

  const currentStage = useMemo(
    () => ONBOARDING_STEPS[currentStepIndex].stage,
    [currentStepIndex],
  );

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOTAL_ONBOARDING_STEPS - 1;
  const progress = (currentStepIndex + 1) / TOTAL_ONBOARDING_STEPS;

  const derivedPlanName = useMemo(
    () => PLAN_NAME_MAP[formData.motivation ?? "anxiety"],
    [formData.motivation],
  );

  const goNext = useCallback((): void => {
    if (currentStepIndex < TOTAL_ONBOARDING_STEPS - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex]);

  const goBack = useCallback((): void => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const updateMotivation = useCallback((answer: MotivationAnswer): void => {
    setFormData((prev) => ({ ...prev, motivation: answer }));
  }, []);

  const updateStressLevel = useCallback((level: StressLevel): void => {
    setFormData((prev) => ({ ...prev, stressLevel: level }));
  }, []);

  const updateExperience = useCallback((exp: JournalExperience): void => {
    setFormData((prev) => ({ ...prev, journalExperience: exp }));
  }, []);

  const updateTiming = useCallback((timing: StressTiming): void => {
    setFormData((prev) => ({ ...prev, stressTiming: timing }));
  }, []);

  const updateDailyGoal = useCallback((minutes: DailyGoalMinutes): void => {
    setFormData((prev) => ({ ...prev, dailyGoal: minutes }));
  }, []);

  const updatePactSigned = useCallback((): void => {
    setFormData((prev) => ({ ...prev, pactSigned: true }));
  }, []);

  const updateFeeling = useCallback((feeling: FeelingEmoji): void => {
    setFormData((prev) => ({ ...prev, selectedFeeling: feeling }));
  }, []);

  const updateNotificationTime = useCallback((time: NotificationTime): void => {
    setFormData((prev) => ({ ...prev, notificationTime: time }));
  }, []);

  const updateNotificationPermission = useCallback((granted: boolean): void => {
    setFormData((prev) => ({
      ...prev,
      notificationPermissionGranted: granted,
    }));
  }, []);

  const updatePricingTier = useCallback((tier: PricingTier): void => {
    setFormData((prev) => ({ ...prev, selectedPricingTier: tier }));
  }, []);

  const updateTrialStarted = useCallback((started: boolean): void => {
    setFormData((prev) => ({ ...prev, trialStarted: started }));
  }, []);

  return {
    currentStepIndex,
    currentStep,
    currentStage,
    totalSteps: TOTAL_ONBOARDING_STEPS,
    progress,
    formData,
    derivedPlanName,
    isFirstStep,
    isLastStep,
    goNext,
    goBack,
    updateMotivation,
    updateStressLevel,
    updateExperience,
    updateTiming,
    updateDailyGoal,
    updatePactSigned,
    updateFeeling,
    updateNotificationTime,
    updateNotificationPermission,
    updatePricingTier,
    updateTrialStarted,
  };
};
