import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SAGE } from "@/src/theme/palette";
import React, { useEffect, useMemo } from "react";
import { Platform, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import MochiMascot from "../components/MochiMascot";
import LoadingTaskRow from "../components/LoadingTaskRow";
import { useAutoAdvance } from "../hooks/useAutoAdvance";
import { getBuildingJourneyConfig } from "../config/buildingJourneyConfig";
import type { MotivationAnswer, StressLevel } from "../types";
import { useTranslation } from "react-i18next";

interface BuildingJourneyStepProps {
  onComplete: () => void;
  motivation?: MotivationAnswer;
  stressLevel?: StressLevel;
}

type BuildingJourneyTaskKey =
  | "building_journey.tasks.profile"
  | "building_journey.tasks.plan"
  | "building_journey.tasks.cbt"
  | "building_journey.tasks.schedule"
  | "building_journey.tasks.gentle_schedule";

const getTaskCopyKey = (id: string, useGentlePace: boolean): BuildingJourneyTaskKey => {
  if (id === "journey") return "building_journey.tasks.plan";
  if (id === "profile") return "building_journey.tasks.profile";
  if (id === "schedule" && useGentlePace) return "building_journey.tasks.gentle_schedule";
  if (id === "schedule") return "building_journey.tasks.schedule";
  return "building_journey.tasks.cbt";
};

// ponytail: responsive progress bar, celebrating mascot, and trust caption
const BuildingJourneyStep: React.FC<BuildingJourneyStepProps> = ({
  onComplete,
  motivation,
  stressLevel,
}) => {
  const { t } = useTranslation("onboarding");
  const config = useMemo(
    () => getBuildingJourneyConfig(motivation, stressLevel),
    [motivation, stressLevel],
  );
  const { tasks, allComplete } = useAutoAdvance(onComplete, config.tasks);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressRatio = tasks.length > 0 ? completedCount / tasks.length : 0;
  const progressPercent = Math.round(progressRatio * 100);

  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(progressPercent, {
      damping: 18,
      stiffness: 90,
    });
  }, [progressPercent]);

  useEffect(() => {
    if (allComplete) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [allComplete]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View className="flex-1 items-center justify-center px-6">
      <MochiMascot
        expression={allComplete ? "celebrating" : "concentrating"}
        size={150}
        delay={0}
      />

      <Animated.View
        entering={FadeIn.duration(180).delay(120)}
        className="mt-5 items-center"
      >
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
          className="text-center text-2xl text-ink"
        >
          {allComplete ? t("building_journey.ready_title") : t("building_journey.title")}
        </Text>
        <Text className="mt-1 text-center text-sm text-ink-soft">
          {allComplete ? t("building_journey.ready_subtitle") : t("building_journey.subtitle")}
        </Text>
      </Animated.View>

      {/* 3D tactile progress bar */}
      <View className="mt-5 w-full">
        <View className="flex-row items-center justify-between mb-1.5 px-0.5">
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.bold }}
            className="text-xs text-ink-muted"
          >
            {allComplete ? t("building_journey.complete") : t("building_journey.generating")}
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.extraBold, color: SAGE[600] }}
            className="text-xs"
          >
            {progressPercent}%
          </Text>
        </View>
        <View
          style={{ backgroundColor: SAGE[100] }}
          className="h-2.5 w-full rounded-full overflow-hidden"
        >
          <Animated.View
            style={[
              {
                height: "100%",
                borderRadius: 999,
                backgroundColor: SAGE[500],
                borderBottomWidth: 2,
                borderBottomColor: SAGE[600],
              },
              animatedProgressStyle,
            ]}
          />
        </View>
      </View>

      <View className="mt-6 w-full gap-3.5">
        {tasks.map((task, index) => (
          <LoadingTaskRow
            key={task.id}
            label={t(getTaskCopyKey(task.id, stressLevel === "heavy" || stressLevel === "overwhelming"))}
            completed={task.completed}
            inProgress={task.inProgress}
            index={index}
          />
        ))}
      </View>

      <Animated.View
        entering={FadeIn.delay(300).duration(200)}
        className="mt-6 flex-row items-center justify-center gap-1.5 opacity-60"
      >
        {Platform.OS === "ios" ? (
          <SymbolView
            name={"lock.fill" as any}
            size={11}
            tintColor={SAGE[600]}
          />
        ) : (
          <Feather name="lock" size={11} color={SAGE[600]} />
        )}
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SAGE[600] }}
          className="text-xs"
        >
          {t("building_journey.private")}
        </Text>
      </Animated.View>
    </View>
  );
};

export default React.memo(BuildingJourneyStep);
