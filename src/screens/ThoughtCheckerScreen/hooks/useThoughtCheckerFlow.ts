import { useReducer, useCallback, useEffect } from 'react';
import type {
  ThoughtCheckerFormState,
  ThoughtCheckerAction,
  ThoughtCheckerStep,
} from '../../ThoughtCatcherScreen/types';

const initialState: ThoughtCheckerFormState = {
  isTrue: null,
  balancedThought: '',
};

function formReducer(
  state: ThoughtCheckerFormState,
  action: ThoughtCheckerAction
): ThoughtCheckerFormState {
  switch (action.type) {
    case 'SET_IS_TRUE':
      return { ...state, isTrue: action.payload };
    case 'SET_BALANCED_THOUGHT':
      return { ...state, balancedThought: action.payload };
    case 'RESET':
      return initialState;
    case 'SET_INITIAL_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Ordered steps for Checker
const FLOW_STEPS: ThoughtCheckerStep[] = [
  'is_true',
  'balanced_thought',
  'checker_summary', // Result page
];

export const useThoughtCheckerFlow = (initialData?: Partial<ThoughtCheckerFormState>) => {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [currentStepIndex, setCurrentStepIndex] = useReducer(
    (state: number, action: 'NEXT' | 'BACK' | 'RESET' | 'JUMP_TO_SUMMARY') => {
      switch (action) {
        case 'NEXT':
          return Math.min(state + 1, FLOW_STEPS.length - 1);
        case 'BACK':
          return Math.max(state - 1, 0);
        case 'RESET':
          return 0;
        case 'JUMP_TO_SUMMARY':
          return FLOW_STEPS.indexOf('checker_summary');
        default:
          return state;
      }
    },
    0
  );

  useEffect(() => {
    if (initialData) {
      dispatch({ type: 'SET_INITIAL_DATA', payload: initialData } as any);
      // If it's fully completed already, they might want to just view the summary
      if (initialData.balancedThought?.trim()) {
        setCurrentStepIndex('JUMP_TO_SUMMARY');
      }
    }
  }, [initialData]);

  const currentStep = FLOW_STEPS[currentStepIndex];

  const goNext = useCallback(() => setCurrentStepIndex('NEXT'), []);
  const goBack = useCallback(() => setCurrentStepIndex('BACK'), []);
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setCurrentStepIndex('RESET');
  }, []);

  const progress = ((currentStepIndex + 1) / FLOW_STEPS.length) * 100;
  const isSummary = currentStep === 'checker_summary';

  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 'is_true':
        return formState.isTrue !== null;
      case 'balanced_thought':
        return formState.balancedThought.trim().length > 0;
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
