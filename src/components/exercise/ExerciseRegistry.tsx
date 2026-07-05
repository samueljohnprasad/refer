import { ComponentType } from 'react';
import { ExerciseType } from '../../../types/exercises';
import { ConceptExercise } from './ConceptExercise';
import { QuizExercise } from './QuizExercise';

// Import all the new placeholders
import { FreeTextExercise } from './FreeTextExercise';
import { GuidedResponseExercise } from './GuidedResponseExercise';
import { LearnCardsExercise } from './LearnCardsExercise';
import { MatchingExercise } from './MatchingExercise';
import { MultipleChoiceExercise } from './MultipleChoiceExercise';
import { OrderingExercise } from './OrderingExercise';
import { RatingCheckExercise } from './RatingCheckExercise';
import { ScenarioExercise } from './ScenarioExercise';
import { SliderRatingExercise } from './SliderRatingExercise';
import { TrueFalseExercise } from './TrueFalseExercise';

export const ExerciseRegistry: Record<ExerciseType, ComponentType<any>> = {
  concept: ConceptExercise,
  quiz: QuizExercise,
  builder: ConceptExercise, // Just a placeholder for now to satisfy the type
  free_text: FreeTextExercise,
  guided_response: GuidedResponseExercise,
  learn_cards: LearnCardsExercise,
  matching: MatchingExercise,
  multiple_choice: MultipleChoiceExercise,
  ordering: OrderingExercise,
  rating_check: RatingCheckExercise,
  scenario: ScenarioExercise,
  slider_rating: SliderRatingExercise,
  true_false: TrueFalseExercise,
};
