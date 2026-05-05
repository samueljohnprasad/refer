import { useCallback, useMemo, useState } from 'react';
import { OnboardingStepName, OnboardingFormDataExtended, JournalingGoal, MoodValue } from '../types';
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '../constants';

interface UseOnboardingFlowReturn {
    currentStepIndex: number;
    currentStep: OnboardingStepName;
    totalSteps: number;
    isFirstStep: boolean;
    isLastStep: boolean;
    progress: number;
    formData: OnboardingFormDataExtended;
    goNext: () => void;
    goBack: () => void;
    skipToStep: (stepName: OnboardingStepName) => void;
    updateGoals: (goals: JournalingGoal[]) => void;
    updateQuickWinMood: (mood: MoodValue) => void;
    updateTrialStarted: (started: boolean, plan?: 'annual' | 'weekly') => void;
}

const INITIAL_FORM_DATA: OnboardingFormDataExtended = {
    name: '',
    reasons: [],
    goals: [],
    quickWinMood: undefined,
    trialStarted: false,
    selectedPlan: undefined,
};

export const useOnboardingFlow = (): UseOnboardingFlowReturn => {
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [formData, setFormData] = useState<OnboardingFormDataExtended>(INITIAL_FORM_DATA);

    const currentStep: OnboardingStepName = useMemo(
        () => ONBOARDING_STEPS[currentStepIndex].name,
        [currentStepIndex]
    );

    const isFirstStep: boolean = currentStepIndex === 0;
    const isLastStep: boolean = currentStepIndex === TOTAL_ONBOARDING_STEPS - 1;
    const progress: number = (currentStepIndex + 1) / TOTAL_ONBOARDING_STEPS;

    const goNext = useCallback((): void => {
        if (currentStepIndex < TOTAL_ONBOARDING_STEPS - 1) {
            setCurrentStepIndex((prev: number) => prev + 1);
        }
    }, [currentStepIndex]);

    const goBack = useCallback((): void => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev: number) => prev - 1);
        }
    }, [currentStepIndex]);

    const skipToStep = useCallback((stepName: OnboardingStepName): void => {
        const targetIndex: number = ONBOARDING_STEPS.findIndex(
            (step) => step.name === stepName
        );
        if (targetIndex >= 0) {
            setCurrentStepIndex(targetIndex);
        }
    }, []);

    const updateGoals = useCallback((goals: JournalingGoal[]): void => {
        setFormData((prev: OnboardingFormDataExtended) => ({ ...prev, goals }));
    }, []);

    const updateQuickWinMood = useCallback((mood: MoodValue): void => {
        setFormData((prev: OnboardingFormDataExtended) => ({ ...prev, quickWinMood: mood }));
    }, []);

    const updateTrialStarted = useCallback(
        (started: boolean, plan?: 'annual' | 'weekly'): void => {
            setFormData((prev: OnboardingFormDataExtended) => ({
                ...prev,
                trialStarted: started,
                selectedPlan: plan,
            }));
        },
        []
    );

    return {
        currentStepIndex,
        currentStep,
        totalSteps: TOTAL_ONBOARDING_STEPS,
        isFirstStep,
        isLastStep,
        progress,
        formData,
        goNext,
        goBack,
        skipToStep,
        updateGoals,
        updateQuickWinMood,
        updateTrialStarted,
    };
};
