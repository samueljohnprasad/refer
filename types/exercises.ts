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

export type ExercisePayload = ConceptPayload | QuizPayload | BuilderPayload;

export interface ExerciseComponentProps<T extends ExercisePayload> {
  payload: T;
  // If they've previously completed this, we pass down their saved response by UUID
  savedResponse?: any;
  // Component fires this whenever the user interacts, passing back their current answer
  onInteraction: (response: any) => void;
}
