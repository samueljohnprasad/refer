export interface ThoughtCatcherEntry {
  id: string;
  user_id: string;
  created_at: string;
  completed_at: string | null;
  status: string;
  situation: string | null;
  automatic_thought: string | null;
  intensity: number | null;
  is_true: string | null;
  facts_for: string | null;
  facts_against: string | null;
  balanced_thought: string | null;
}

export type ThoughtCatcherStep =
  | 'intro'
  | 'situation'
  | 'automatic_thought'
  | 'intensity'
  | 'catcher_summary';

export type ThoughtCheckerStep =
  | 'is_true'
  | 'balanced_thought'
  | 'checker_summary';

export interface ThoughtCatcherFormState {
  situation: string;
  automaticThought: string;
  intensity: number;
}

export type ThoughtCatcherAction =
  | { type: 'SET_SITUATION'; payload: string }
  | { type: 'SET_AUTOMATIC_THOUGHT'; payload: string }
  | { type: 'SET_INTENSITY'; payload: number }
  | { type: 'RESET' };

export interface ThoughtCheckerFormState {
  isTrue: 'YES' | 'NOT SURE' | 'NO' | null;
  balancedThought: string;
}

export type ThoughtCheckerAction =
  | { type: 'SET_IS_TRUE'; payload: 'YES' | 'NOT SURE' | 'NO' }
  | { type: 'SET_BALANCED_THOUGHT'; payload: string }
  | { type: 'SET_INITIAL_DATA'; payload: Partial<ThoughtCheckerFormState> }
  | { type: 'RESET' };
