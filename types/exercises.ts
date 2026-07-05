export type ExerciseType = 
  | 'concept' 
  | 'quiz' 
  | 'builder'
  | 'free_text'
  | 'guided_response'
  | 'learn_cards'
  | 'matching'
  | 'multiple_choice'
  | 'ordering'
  | 'rating_check'
  | 'scenario'
  | 'slider_rating'
  | 'true_false';

export interface BaseExercisePayload {
  id: string; // The UUID of the exercise
  type: ExerciseType;
}

export interface ConceptPayload extends BaseExercisePayload {
  type: 'concept';
  content: {
    title: string;
    content: string;
  };
}

export interface QuizPayload extends BaseExercisePayload {
  type: 'quiz';
  content: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface BuilderPayload extends BaseExercisePayload {
  type: 'builder';
  content: {
    prompt: string;
    initialCode: string;
  };
}

export interface FreeTextPayload extends BaseExercisePayload { type: 'free_text'; content: any; }
export interface GuidedResponsePayload extends BaseExercisePayload { type: 'guided_response'; content: any; }
export interface LearnCardsPayload extends BaseExercisePayload { type: 'learn_cards'; content: any; }
export interface MatchingPayload extends BaseExercisePayload { type: 'matching'; content: any; }
export interface MultipleChoicePayload extends BaseExercisePayload { type: 'multiple_choice'; content: any; }
export interface OrderingPayload extends BaseExercisePayload { type: 'ordering'; content: any; }
export interface RatingCheckPayload extends BaseExercisePayload { type: 'rating_check'; content: any; }
export interface ScenarioPayload extends BaseExercisePayload { type: 'scenario'; content: any; }
export interface SliderRatingPayload extends BaseExercisePayload { type: 'slider_rating'; content: any; }
export interface TrueFalsePayload extends BaseExercisePayload { type: 'true_false'; content: any; }

export type ExercisePayload = 
  | ConceptPayload 
  | QuizPayload 
  | BuilderPayload
  | FreeTextPayload
  | GuidedResponsePayload
  | LearnCardsPayload
  | MatchingPayload
  | MultipleChoicePayload
  | OrderingPayload
  | RatingCheckPayload
  | ScenarioPayload
  | SliderRatingPayload
  | TrueFalsePayload;

export interface ExerciseComponentProps<T extends ExercisePayload> {
  payload: T;
  // If they've previously completed this, we pass down their saved response by UUID
  savedResponse?: any;
  // Component fires this whenever the user interacts, passing back their current answer
  onInteraction: (response: any) => void;
}
