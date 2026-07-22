import { useCallback, useState } from "react";
import type { OnboardingQuestion } from "../screens/JourneyOnboardingScreen";

export type ScreenState = "welcome" | "quiz" | "enrolling";

export interface JourneyOnboardingScreenProps {
  questions: OnboardingQuestion[];
  onQuizComplete: (answers: Record<string, string>) => void;
  onSkip: () => void;
  isEnrolling: boolean;
}

export function useJourneyOnboardingViewModel({
  questions,
  onQuizComplete,
  onSkip,
  isEnrolling,
}: JourneyOnboardingScreenProps) {
  const [screenState, setScreenState] = useState<ScreenState>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion: OnboardingQuestion | undefined =
    questions[currentQuestionIndex];
  const totalQuestions: number = questions.length;
  const isLastQuestion: boolean = currentQuestionIndex === totalQuestions - 1;

  const handleStart = useCallback((): void => {
    setScreenState("quiz");
  }, []);

  const handleSelectOption = useCallback(
    (optionId: string): void => {
      if (!currentQuestion) return;

      const updatedAnswers: Record<string, string> = {
        ...answers,
        [currentQuestion.id]: optionId,
      };
      setAnswers(updatedAnswers);

      setTimeout(() => {
        if (isLastQuestion) {
          setScreenState("enrolling");
          onQuizComplete(updatedAnswers);
        } else {
          setCurrentQuestionIndex((prev: number) => prev + 1);
        }
      }, 400);
    },
    [currentQuestion, answers, isLastQuestion, onQuizComplete],
  );

  const handlePreviousQuestion = useCallback((): void => {
    setCurrentQuestionIndex((prev: number) => Math.max(0, prev - 1));
  }, []);

  return {
    screenState,
    currentQuestionIndex,
    answers,
    currentQuestion,
    totalQuestions,
    handleStart,
    handleSelectOption,
    handlePreviousQuestion,
    questions,
    onSkip,
    isEnrolling,
  };
}
