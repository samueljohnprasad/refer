import { useReducer, useCallback } from 'react';
import type {
  ThoughtCatcherFormState,
  ThoughtCatcherAction,
  ThoughtCatcherStep,
} from '../types';

const initialState: ThoughtCatcherFormState = {
  situation: '',
  automaticThought: '',
  intensity: 50, // Default mid-way
};

function formReducer(
  state: ThoughtCatcherFormState,
  action: ThoughtCatcherAction
): ThoughtCatcherFormState {
  switch (action.type) {
    case 'SET_SITUATION':
      return { ...state, situation: action.payload };
    case 'SET_AUTOMATIC_THOUGHT':
      return { ...state, automaticThought: action.payload };
    case 'SET_INTENSITY':
      return { ...state, intensity: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Ordered steps for Catcher
const FLOW_STEPS: ThoughtCatcherStep[] = [
  'situation',
  'automatic_thought',
  'intensity',
  'catcher_summary', // The "Nice catch" screen
];

export const useThoughtCatcherFlow = () => {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [currentStepIndex, setCurrentStepIndex] = useReducer(
    (state: number, action: 'NEXT' | 'BACK' | 'RESET') => {
      switch (action) {
        case 'NEXT':
          return Math.min(state + 1, FLOW_STEPS.length - 1);
        case 'BACK':
          return Math.max(state - 1, 0);
        case 'RESET':
          return 0;
        default:
          return state;
      }
    },
    0
  );

  const currentStep = FLOW_STEPS[currentStepIndex];

  const goNext = useCallback(() => setCurrentStepIndex('NEXT'), []);
  const goBack = useCallback(() => setCurrentStepIndex('BACK'), []);
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setCurrentStepIndex('RESET');
  }, []);

  const progress = ((currentStepIndex + 1) / FLOW_STEPS.length) * 100;
  const isSummary = currentStep === 'catcher_summary';

  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 'situation':
        return formState.situation.trim().length > 0;
      case 'automatic_thought':
        return formState.automaticThought.trim().length > 0;
      case 'intensity':
        return true; // Slider always has a value
      default:
        return true;
    }
  };

  return {
    formState,
    dispatch,
    currentStep,
    progress,
    isSummary,
    isCurrentStepValid: isCurrentStepValid(),
    goNext,
    goBack,
    canGoBack: currentStepIndex > 0,
    reset,
  };
};
