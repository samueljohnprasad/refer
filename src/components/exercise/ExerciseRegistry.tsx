import { ComponentType } from 'react';
import { ExerciseType, ExerciseComponentProps } from '../../../types/exercises';
import { ConceptExercise } from './ConceptExercise';
import { QuizExercise } from './QuizExercise';
// Note: You can easily add more here, like BuilderExercise, without breaking anything.

export const ExerciseRegistry: Record<ExerciseType, ComponentType<ExerciseComponentProps<any>>> = {
  concept: ConceptExercise,
  quiz: QuizExercise,
  builder: ConceptExercise, // Just a placeholder for now to satisfy the type
};
