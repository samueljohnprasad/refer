import React from "react";
import type { MascotState } from "@/src/components/ui/Mascot";
import { ExerciseIntro } from "@/src/components/exercise/intro";
import type { StepProps } from "@/src/types/exerciseFlow";

interface IntroStepProps extends StepProps {
  title: string;
  subtitle: string;
  exerciseType?: string;
  icon?: string;
  duration: string;
  bulletPoints?: string[];
  mascotState?: MascotState;
}

export const IntroStep: React.FC<IntroStepProps> = React.memo(
  ({
    title,
    subtitle,
    duration,
    bulletPoints,
    mascotState = "panda-happy",
  }) => {
    return (
      <ExerciseIntro
        title={title}
        subtitle={subtitle}
        duration={duration}
        bulletPoints={bulletPoints}
        mascotState={mascotState}
      />
    );
  },
);

IntroStep.displayName = "IntroStep";
