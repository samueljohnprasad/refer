// ponytail: handles post-exercise celebration and handoff to guided reflection
import React, { useState, useCallback } from "react";
import { LessonCompleteCelebration } from "@/src/components/celebration/LessonCompleteCelebration";
import { GuidedReflectionModal } from "@/src/domains/journal/ui/GuidedReflectionModal";
import type { CelebrationState } from "../types";

export interface ExerciseCompletionContainerProps {
  celebration: CelebrationState | null;
  exerciseTitle: string;
  pathId?: string;
  pathVersion?: number;
  practiceSessionId?: string;
  practiceSource?: string;
  practiceId?: string;
  onExit: () => void;
  continueLabel: string;
  celebrationTitle: string;
  celebrationMessage: string;
}

export const ExerciseCompletionContainer: React.FC<ExerciseCompletionContainerProps> = ({
  celebration,
  exerciseTitle,
  pathId,
  pathVersion,
  practiceSessionId,
  practiceSource,
  practiceId,
  onExit,
  continueLabel,
  celebrationTitle,
  celebrationMessage,
}) => {
  const [showReflection, setShowReflection] = useState(false);

  const handleCelebrationContinue = useCallback(() => {
    if (pathId && practiceSessionId) {
      setShowReflection(true);
    } else {
      onExit();
    }
  }, [pathId, practiceSessionId, onExit]);

  const handleReflectionComplete = useCallback(() => {
    setShowReflection(false);
    onExit();
  }, [onExit]);

  const handleReflectionClose = useCallback(() => {
    setShowReflection(false);
    onExit();
  }, [onExit]);

  return (
    <>
      {celebration && !showReflection && (
        <LessonCompleteCelebration
          isVisible={!!celebration}
          xpEarned={celebration.xp}
          durationMs={celebration.durationMs}
          lessonTitle={exerciseTitle}
          title={celebrationTitle}
          message={celebrationMessage}
          continueLabel={continueLabel}
          onContinue={handleCelebrationContinue}
        />
      )}

      {showReflection && pathId && practiceSessionId && (
        <GuidedReflectionModal
          visible={showReflection}
          pathId={pathId}
          pathVersion={pathVersion}
          practiceSessionId={practiceSessionId}
          practiceRef={{
            source: practiceSource ?? "exercise_catalog",
            id: practiceId ?? pathId,
          }}
          onClose={handleReflectionClose}
          onCompleted={handleReflectionComplete}
        />
      )}
    </>
  );
};

ExerciseCompletionContainer.displayName = "ExerciseCompletionContainer";
