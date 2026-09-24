import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";
import LoadingTaskRow from "../components/LoadingTaskRow";
import { useAutoAdvance } from "../hooks/useAutoAdvance";
import { getBuildingJourneyConfig } from "../config/buildingJourneyConfig";
import type { MotivationAnswer, StressLevel } from "../types";

interface BuildingJourneyStepProps {
  onComplete: () => void;
  motivation?: MotivationAnswer;
  stressLevel?: StressLevel;
}

const BuildingJourneyStep: React.FC<BuildingJourneyStepProps> = ({
  onComplete,
  motivation,
  stressLevel,
}) => {
  // ponytail: resolve config based on motivation/stress level selections
  const config = useMemo(
    () => getBuildingJourneyConfig(motivation, stressLevel),
    [motivation, stressLevel],
  );
  const { tasks } = useAutoAdvance(onComplete, config.tasks);

  return (
    <View className="flex-1 items-center justify-center px-6">
      <MochiMascot expression="concentrating" size={140} delay={0} />

      <Animated.View
        entering={FadeIn.duration(180).delay(120)}
        className="mt-6 items-center"
      >
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-center text-2xl text-ink"
        >
          {config.title}
        </Text>
        <Text className="mt-2 text-center text-sm text-ink-soft">
          {config.subtitle}
        </Text>
      </Animated.View>

      <View className="mt-8 w-full gap-3">
        {tasks.map((task, index) => (
          <LoadingTaskRow
            key={task.id}
            label={task.label}
            completed={task.completed}
            inProgress={task.inProgress}
            index={index}
          />
        ))}
      </View>
    </View>
  );
};

export default React.memo(BuildingJourneyStep);
