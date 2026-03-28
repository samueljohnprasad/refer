import { useReducer, useCallback, useMemo } from 'react';
import type {
  ThoughtReframingStep,
  ThoughtReframingFormState,
  ThoughtReframingAction,
  EmotionName,
  CognitiveDistortionKey,
} from '../types';

// ─── Constants ──────────────────────────────────────────────────────
const STEP_ORDER: ThoughtReframingStep[] = [
  'intro',
  'situation',
  'automatic_thought',
  'emotions',
  'distortions',
  'evidence_for',
  'evidence_against',
  'balanced_thought',
  're_evaluate',
  'summary',
];

const TOTAL_INPUT_STEPS: number = STEP_ORDER.length - 2; // Exclude intro & summary

const MAX_EMOTIONS: number = 3;
const MAX_DISTORTIONS: number = 2;
const MAX_EVIDENCE_ITEMS: number = 5;

const INITIAL_FORM_STATE: ThoughtReframingFormState = {
  situation: '',
  automaticThought: '',
  selectedEmotions: [],
  selectedDistortions: [],
  evidenceFor: [],
  evidenceAgainst: [],
  balancedThought: '',
};

// ─── Reducer ────────────────────────────────────────────────────────
const formReducer = (
  state: ThoughtReframingFormState,
  action: ThoughtReframingAction
): ThoughtReframingFormState => {
  switch (action.type) {
    case 'SET_SITUATION':
      return { ...state, situation: action.payload };

    case 'SET_AUTOMATIC_THOUGHT':
      return { ...state, automaticThought: action.payload };

    case 'TOGGLE_EMOTION': {
      const emotionName: EmotionName = action.payload;
      const exists: boolean = state.selectedEmotions.some(
        (e) => e.name === emotionName
      );
      if (exists) {
        return {
          ...state,
          selectedEmotions: state.selectedEmotions.filter(
            (e) => e.name !== emotionName
          ),
        };
      }
      if (state.selectedEmotions.length >= MAX_EMOTIONS) return state;
      return {
        ...state,
        selectedEmotions: [
          ...state.selectedEmotions,
          { name: emotionName, initial_intensity: 5, final_intensity: 5 },
        ],
      };
    }

    case 'SET_EMOTION_INTENSITY': {
      const { name, intensity } = action.payload;
      return {
        ...state,
        selectedEmotions: state.selectedEmotions.map((e) =>
          e.name === name ? { ...e, initial_intensity: intensity } : e
        ),
      };
    }

    case 'SET_EMOTION_FINAL_INTENSITY': {
      const { name, intensity } = action.payload;
      return {
        ...state,
        selectedEmotions: state.selectedEmotions.map((e) =>
          e.name === name ? { ...e, final_intensity: intensity } : e
        ),
      };
    }

    case 'TOGGLE_DISTORTION': {
      const distKey: CognitiveDistortionKey = action.payload;
      const distExists: boolean = state.selectedDistortions.includes(distKey);
      if (distExists) {
        return {
          ...state,
          selectedDistortions: state.selectedDistortions.filter(
            (d) => d !== distKey
          ),
        };
      }
      if (state.selectedDistortions.length >= MAX_DISTORTIONS) return state;
      return {
        ...state,
        selectedDistortions: [...state.selectedDistortions, distKey],
      };
    }

    case 'ADD_EVIDENCE_FOR':
      if (state.evidenceFor.length >= MAX_EVIDENCE_ITEMS) return state;
      return {
        ...state,
        evidenceFor: [...state.evidenceFor, action.payload],
      };

    case 'REMOVE_EVIDENCE_FOR':
      return {
        ...state,
        evidenceFor: state.evidenceFor.filter(
          (_, i) => i !== action.payload
        ),
      };

    case 'ADD_EVIDENCE_AGAINST':
      if (state.evidenceAgainst.length >= MAX_EVIDENCE_ITEMS) return state;
      return {
        ...state,
        evidenceAgainst: [...state.evidenceAgainst, action.payload],
      };

    case 'REMOVE_EVIDENCE_AGAINST':
      return {
        ...state,
        evidenceAgainst: state.evidenceAgainst.filter(
          (_, i) => i !== action.payload
        ),
      };

    case 'SET_BALANCED_THOUGHT':
      return { ...state, balancedThought: action.payload };

    case 'RESET':
      return INITIAL_FORM_STATE;

    default:
      return state;
  }
};

// ─── Validation ─────────────────────────────────────────────────────
const getStepValidation = (
  step: ThoughtReframingStep,
  state: ThoughtReframingFormState
): boolean => {
  switch (step) {
    case 'situation':
      return state.situation.trim().length >= 5;
    case 'automatic_thought':
      return state.automaticThought.trim().length >= 5;
    case 'emotions':
      return state.selectedEmotions.length >= 1;
    case 'distortions':
      return state.selectedDistortions.length >= 1;
    case 'evidence_for':
      return true; // Optional — thought may genuinely have no evidence
    case 'evidence_against':
      return true; // Optional
    case 'balanced_thought':
      return state.balancedThought.trim().length >= 5;
    case 're_evaluate':
      return true; // Always valid, sliders have defaults
    default:
      return true;
  }
};

// ─── Hook ───────────────────────────────────────────────────────────
export interface UseThoughtReframingFlowReturn {
  /** Current step key */
  currentStep: ThoughtReframingStep;
  /** 0-indexed step number within input steps */
  currentStepIndex: number;
  /** Total number of navigable steps (excluding intro/summary) */
  totalInputSteps: number;
  /** Form state */
  formState: ThoughtReframingFormState;
  /** Dispatch an action to the form reducer */
  dispatch: React.Dispatch<ThoughtReframingAction>;
  /** Whether the current step passes validation */
  isCurrentStepValid: boolean;
  /** Navigate to next step */
  goNext: () => void;
  /** Navigate to previous step */
  goBack: () => void;
  /** Whether we can go back */
  canGoBack: boolean;
  /** Whether we are on the summary screen */
  isSummary: boolean;
  /** Whether we are on the intro screen */
  isIntro: boolean;
  /** Progress fraction (0–1) through input steps */
  progress: number;
  /** Reset the entire flow */
  reset: () => void;
}

export const useThoughtReframingFlow = (): UseThoughtReframingFlowReturn => {
  const [formState, dispatch] = useReducer(formReducer, INITIAL_FORM_STATE);
  const [stepIndex, setStepIndex] = useReducer(
    (_prev: number, next: number) => Math.max(0, Math.min(next, STEP_ORDER.length - 1)),
    0
  );

  const currentStep: ThoughtReframingStep = STEP_ORDER[stepIndex];

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

  // Progress excludes intro (index 0) and summary (last)
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
