import { memo } from "react";
import { Platform, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";
import { ExerciseArt } from "@/src/domains/exercises/ui/presentation/components/ExerciseArt";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import type { ExerciseConfig } from "@/src/types/exerciseFlow";
import { NEUTRAL, SAGE } from "@/src/theme/palette";
import { buildExerciseRoute, getCategoryBadgeTheme } from "../exerciseScreenUtils";

type JumpBackInRowProps = {
  exercise: ExerciseConfig<any>;
  /** a paused entry exists for this exercise */
  paused: boolean;
  /** rung the paused Fear Ladder run is on; pips only when real */
  rung?: { position: number; total: number };
  onPress: (exercise: ExerciseConfig<any>) => void;
};

// ponytail: .rs row from .agents/exercises.html — art, name, one quiet line, rung pips (Fear Ladder
// only, from the paused entry's real rung), chevron.
export const JumpBackInRow = memo(function JumpBackInRow({ exercise, paused, rung, onPress }: JumpBackInRowProps) {
  const { t } = useTranslation("exercises");
  const translateCopy = useExerciseCopy();
  const title = translateCopy(exercise.title);
  const duration = exercise.duration.replace(/\smin$/, ` ${t("flow.ui.engine.minutesShort")}`);

  return (
    <CircularRevealWrapper href={buildExerciseRoute(exercise.type)} color={SAGE[100]} duration={800}>
      <Card
        variant="tile"
        radius="md"
        showDepth={false}
        onPress={() => onPress(exercise)}
        faceStyle={{ backgroundColor: NEUTRAL.white, borderWidth: 1, borderColor: SAGE[100] }}
        contentClassName="flex-row items-center px-3 py-3"
        accessibilityLabel={`${t("library.start")} ${title}`}
      >
        <View style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", marginRight: 12, backgroundColor: getCategoryBadgeTheme(exercise.category).bg }}>
          <ExerciseArt type={exercise.type} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text className="happy-font-body-bold text-[17px] leading-[22px] text-happy-label" numberOfLines={1}>{title}</Text>
          <Text className="happy-font-body-medium text-[13px] leading-[18px] text-happy-label-2 mt-0.5" numberOfLines={1}>
            {paused
              ? rung
                ? t("log.pausedRung", { ...rung, defaultValue: "Paused at rung {{position}} of {{total}}. It's saved." })
                : t("log.pausedPartWay", { defaultValue: "Paused part way. It's saved." })
              : duration}
          </Text>
          {paused && rung ? <RungPips {...rung} label={t("log.rungsLabel", { ...rung, defaultValue: "{{position}} of {{total}} rungs" })} /> : null}
        </View>
        {Platform.OS === "ios" ? <SymbolView name="chevron.right" size={15} tintColor={SAGE[400]} /> : <Feather name="chevron-right" size={16} color={SAGE[400]} />}
      </Card>
    </CircularRevealWrapper>
  );
});

function RungPips({ position, total, label }: { position: number; total: number; label: string }) {
  return (
    <View accessibilityRole="image" accessibilityLabel={label} style={{ flexDirection: "row", gap: 4, marginTop: 6 }}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={{ width: 16, height: 6, borderRadius: 3, backgroundColor: i < position ? "#5f7f58" : SAGE[100] }} />
      ))}
    </View>
  );
}
