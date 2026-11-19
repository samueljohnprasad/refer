import { memo, useCallback, type ReactElement } from "react";
import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";
import { ExerciseArt } from "@/src/domains/exercises/ui/presentation/components/ExerciseArt";
import { Text } from "@/src/components/ui/Text";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { useFreemiumGate } from "@/src/hooks/useFreemiumGate";
import type { ExerciseConfig } from "@/src/types/exerciseFlow";
import { SAGE } from "@/src/theme/palette";
import { NEW_EXERCISE_TYPES } from "@/src/domains/exercises/data/exerciseCopy";
import { buildExerciseRoute, getExerciseHue } from "../exerciseScreenUtils";

interface ExerciseCardProps {
  exercise: ExerciseConfig<any>;
  onPress: (exercise: ExerciseConfig<any>) => void;
}

function localizeDuration(duration: string, minutesShort: string): string {
  return duration.replace(/\smin$/, ` ${minutesShort}`);
}

// ponytail: .tile from .agents/exercises.html — 156px width, 4:3 art block (category hue) with
// Pro/New badge on it, bold name, clock + duration. Clean, borderless.
export const ExerciseTile = memo(function ExerciseTile({ exercise, onPress }: ExerciseCardProps): ReactElement {
  const { t } = useTranslation("exercises");
  const translateCopy = useExerciseCopy();
  const { hasPro, requirePro } = useFreemiumGate();
  const isGated = !!exercise.isProOnly && !hasPro;
  const handlePress = useCallback(async () => {
    if (isGated) return requirePro("exercise");
    onPress(exercise);
  }, [exercise, isGated, onPress, requirePro]);
  const artBg = getExerciseHue(exercise.type, exercise.category);

  return (
    <CircularRevealWrapper href={buildExerciseRoute(exercise.type)} color={SAGE[100]} duration={800} disabled={isGated}>
      <Pressable
        onPress={handlePress}
        className="w-[156px] active:scale-[0.97]"
        accessibilityRole="button"
        accessibilityLabel={`${translateCopy(exercise.title)}, ${localizeDuration(exercise.duration, t("flow.ui.engine.minutesShort"))}`}
      >
        <View className="w-[156px] h-[117px] rounded-2xl overflow-hidden" style={{ backgroundColor: artBg }}>
          <ExerciseArt type={exercise.type} />
          {isGated && (
            <View className="absolute top-2 right-2 flex-row items-center gap-[3px] h-[22px] px-2 rounded-full bg-white">
              <Feather name="lock" size={11} color="#142414" />
              <Text className="happy-font-body-bold text-[12px] text-happy-label">Pro</Text>
            </View>
          )}
          {NEW_EXERCISE_TYPES.has(exercise.type) && (
            <View className="absolute top-2 left-2 flex-row items-center gap-[3px] h-[22px] px-2 rounded-full bg-happy-ink">
              <Text className="happy-font-body-bold text-[12px] text-white">New</Text>
            </View>
          )}
        </View>
        <Text className="happy-font-body-bold text-[15px] leading-[19px] text-happy-label mt-2" numberOfLines={2}>
          {translateCopy(exercise.title)}
        </Text>
        <View className="flex-row items-center gap-1 mt-0.5">
          <Feather name="clock" size={13} color="#767676" />
          <Text className="happy-font-body-semibold text-[13px] text-happy-label-3" numberOfLines={1}>
            {localizeDuration(exercise.duration, t("flow.ui.engine.minutesShort"))}
          </Text>
        </View>
      </Pressable>
    </CircularRevealWrapper>
  );
});
