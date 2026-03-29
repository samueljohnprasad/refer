import { useReducer, useCallback, useMemo } from 'react';
import type {
  GratitudeStep,
  GratitudeFormState,
  GratitudeAction,
} from '../types';
import type { EmotionName } from '../../ThoughtReframingScreen/types';

// ─── Constants ──────────────────────────────────────────────────────
const STEP_ORDER: GratitudeStep[] = [
  'intro',
  'mood',
  'prompts',
  'reflection',
  'reevaluate',
  'summary',
];

const TOTAL_INPUT_STEPS: number = STEP_ORDER.length - 2; // Exclude intro & summary
const MAX_GRATITUDE_ENTRIES: number = 3;

const INITIAL_FORM_STATE: GratitudeFormState = {
  currentMood: null,
  moodIntensity: 5,
  selectedPrompt: '',
  gratitudeEntries: [],
  finalMoodIntensity: 5,
};

// ─── Reducer ────────────────────────────────────────────────────────
const formReducer = (
  state: GratitudeFormState,
  action: GratitudeAction
): GratitudeFormState => {
  switch (action.type) {
    case 'SET_MOOD':
      return { ...state, currentMood: action.payload };

    case 'SET_MOOD_INTENSITY':
      return { ...state, moodIntensity: action.payload };

    case 'SET_SELECTED_PROMPT':
      return { ...state, selectedPrompt: action.payload };

    case 'ADD_GRATITUDE_ENTRY':
      if (state.gratitudeEntries.length >= MAX_GRATITUDE_ENTRIES) return state;
      return {
        ...state,
        gratitudeEntries: [...state.gratitudeEntries, action.payload],
      };

    case 'REMOVE_GRATITUDE_ENTRY':
      return {
        ...state,
        gratitudeEntries: state.gratitudeEntries.filter(
          (_, i) => i !== action.payload
        ),
      };

    case 'UPDATE_GRATITUDE_ENTRY': {
      const { index, text } = action.payload;
      const updated: string[] = [...state.gratitudeEntries];
      updated[index] = text;
      return { ...state, gratitudeEntries: updated };
    }

    case 'SET_FINAL_MOOD_INTENSITY':
      return { ...state, finalMoodIntensity: action.payload };

    case 'RESET':
      return INITIAL_FORM_STATE;

    default:
      return state;
  }
};

// ─── Validation ─────────────────────────────────────────────────────
const getStepValidation = (
  step: GratitudeStep,
  state: GratitudeFormState
): boolean => {
  switch (step) {
    case 'mood':
      return state.currentMood !== null;
    case 'prompts':
      return state.selectedPrompt.trim().length > 0;
    case 'reflection':
      return state.gratitudeEntries.length >= 1 &&
        state.gratitudeEntries.some((e) => e.trim().length >= 3);
    case 'reevaluate':
      return true; // Slider has a default
    default:
      return true;
  }
};

// ─── Hook Return Type ───────────────────────────────────────────────
export interface UseGratitudeFlowReturn {
  currentStep: GratitudeStep;
  currentStepIndex: number;
  totalInputSteps: number;
  formState: GratitudeFormState;
  dispatch: React.Dispatch<GratitudeAction>;
  isCurrentStepValid: boolean;
  goNext: () => void;
  goBack: () => void;
  canGoBack: boolean;
  isSummary: boolean;
  isIntro: boolean;
  progress: number;
  reset: () => void;
}

// ─── Hook ───────────────────────────────────────────────────────────
export const useGratitudeFlow = (): UseGratitudeFlowReturn => {
  const [formState, dispatch] = useReducer(formReducer, INITIAL_FORM_STATE);
  const [stepIndex, setStepIndex] = useReducer(
    (_prev: number, next: number) =>
      Math.max(0, Math.min(next, STEP_ORDER.length - 1)),
    0
  );

  const currentStep: GratitudeStep = STEP_ORDER[stepIndex];

  const isCurrentStepValid: boolean = useMemo(
    () => getStepValidation(currentStep, formState),
    [currentStep, formState]
  );

  const goNext = useCallback((): void => {
    if (stepIndex < STEP_ORDER.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  }, [stepIndex]);

  const goBack = useCallback((): void => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  }, [stepIndex]);

  const canGoBack: boolean = stepIndex > 0 && currentStep !== 'intro';
  const isIntro: boolean = currentStep === 'intro';
  const isSummary: boolean = currentStep === 'summary';

  const progress: number = useMemo(() => {
    if (stepIndex <= 0) return 0;
    if (stepIndex >= STEP_ORDER.length - 1) return 1;
    return (stepIndex - 1) / (TOTAL_INPUT_STEPS - 1);
  }, [stepIndex]);

  const reset = useCallback((): void => {
    dispatch({ type: 'RESET' });
    setStepIndex(0);
  }, []);

  return {
    currentStep,
    currentStepIndex: stepIndex,
    totalInputSteps: TOTAL_INPUT_STEPS,
    formState,
    dispatch,
    isCurrentStepValid,
    goNext,
    goBack,
    canGoBack,
    isSummary,
    isIntro,
    progress,
    reset,
  };
};
