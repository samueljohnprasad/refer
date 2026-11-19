import { memo } from "react";
import { Platform, Pressable, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";
import { ExerciseArt } from "@/src/domains/exercises/ui/presentation/components/ExerciseArt";
import { Text } from "@/src/components/ui/Text";
import type { ExerciseConfig } from "@/src/types/exerciseFlow";
import { SAGE } from "@/src/theme/palette";
import { buildExerciseRoute, getExerciseHue } from "../exerciseScreenUtils";

type JumpBackInRowProps = {
  exercise: ExerciseConfig<any>;
  /** a paused entry exists for this exercise */
  paused: boolean;
  /** rung the paused Fear Ladder run is on; pips only when real */
  rung?: { position: number; total: number };
  onPress: (exercise: ExerciseConfig<any>) => void;
};

// ponytail: exact .rs row from .agents/exercises.html — art, name, one quiet line, rung pips (Fear Ladder
// only, from the paused entry's real rung), chevron.
export const JumpBackInRow = memo(function JumpBackInRow({ exercise, paused, rung, onPress }: JumpBackInRowProps) {
  const { t } = useTranslation("exercises");
  const translateCopy = useExerciseCopy();
  const title = translateCopy(exercise.title);
  const duration = exercise.duration.replace(/\smin$/, ` ${t("flow.ui.engine.minutesShort")}`);
  const artBg = getExerciseHue(exercise.type, exercise.category);

  return (
    <CircularRevealWrapper href={buildExerciseRoute(exercise.type)} color={SAGE[100]} duration={800}>
      <Pressable
        onPress={() => onPress(exercise)}
        className="flex-row items-center p-3 gap-3 rounded-2xl bg-white border border-[#e5e5e5] active:scale-[0.98]"
        accessibilityRole="button"
        accessibilityLabel={`${t("library.start")} ${title}`}
      >
        <View className="w-[72px] h-[72px] rounded-[14px] overflow-hidden" style={{ backgroundColor: artBg }}>
          <ExerciseArt type={exercise.type} />
        </View>
        <View className="flex-1 min-w-0">
          <Text className="happy-font-body-bold text-[17px] leading-[21px] text-happy-label" numberOfLines={1}>{title}</Text>
          <Text className="happy-font-body-semibold text-[13px] leading-[17px] text-happy-label-2 mt-0.5" numberOfLines={1}>
            {paused
              ? rung
                ? t("log.pausedRung", { ...rung, defaultValue: "Paused at rung {{position}} of {{total}}. It's saved." })
                : t("log.pausedPartWay", { defaultValue: "Paused part way. It's saved." })
              : duration}
          </Text>
          {paused && rung ? <RungPips {...rung} label={t("log.rungsLabel", { ...rung, defaultValue: "{{position}} of {{total}} rungs" })} /> : null}
        </View>
        {Platform.OS === "ios" ? (
          <SymbolView name="chevron.right" size={18} tintColor="#767676" />
        ) : (
          <Feather name="chevron-right" size={20} color="#767676" />
        )}
      </Pressable>
    </CircularRevealWrapper>
  );
});

function RungPips({ position, total, label }: { position: number; total: number; label: string }) {
  return (
    <View accessibilityRole="image" accessibilityLabel={label} className="flex-row gap-[3px] mt-2">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className={`flex-1 h-1.5 rounded-[3px] ${i < position ? "bg-happy-ink" : "bg-happy-sep"}`}
        />
      ))}
    </View>
  );
}
