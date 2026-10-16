import { memo, useCallback, type ReactElement } from "react";
import { Platform, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";
import { ExerciseIcon } from "@/src/components/exercise/ExerciseIcon";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { useFreemiumGate } from "@/src/hooks/useFreemiumGate";
import type { ExerciseConfig } from "@/src/types/exerciseFlow";
import { NEUTRAL, SAGE } from "@/src/theme/palette";
import { buildExerciseRoute } from "../exerciseScreenUtils";
import { nutrieStyles } from "../ExercisesScreen.styles";

interface ExerciseCardProps {
  exercise: ExerciseConfig<any>;
  onPress: (exercise: ExerciseConfig<any>) => void;
}

function localizeDuration(duration: string, minutesShort: string): string {
  return duration.replace(/\smin$/, ` ${minutesShort}`);
}

export const CompactExerciseRow = memo(function CompactExerciseRow({ exercise, onPress }: ExerciseCardProps): ReactElement {
  const { t } = useTranslation("exercises");
  const translateCopy = useExerciseCopy();
  const { hasPro, requirePro } = useFreemiumGate();
  const isGated = !!exercise.isProOnly && !hasPro;
  const handlePress = useCallback(async () => {
    if (isGated) return requirePro("exercise");
    onPress(exercise);
  }, [exercise, isGated, onPress, requirePro]);

  return (
    <CircularRevealWrapper href={buildExerciseRoute(exercise.type)} color={SAGE[100]} duration={800} disabled={isGated}>
      <Card
        variant="tile"
        radius="md"
        showDepth={false}
        onPress={handlePress}
        style={{ marginBottom: 8 }}
        faceStyle={{ backgroundColor: NEUTRAL.white, borderWidth: 1, borderColor: SAGE[100] }}
        contentClassName="flex-row items-center px-3.5 py-3"
      >
        <View style={{ width: 28, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <ExerciseIcon type={exercise.type} size={24} color={SAGE[600]} />
        </View>
        <View style={{ flex: 1, minWidth: 0, justifyContent: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[nutrieStyles.exerciseTitle, { fontSize: 15, marginBottom: 2, flexShrink: 1 }]} numberOfLines={2}>{translateCopy(exercise.title)}</Text>
            {isGated ? <TextBadge label="PRO" /> : null}
          </View>
          <Text style={[nutrieStyles.exerciseSubtitle, { fontSize: 13 }]} numberOfLines={1}>{localizeDuration(exercise.duration, t("flow.ui.engine.minutesShort"))} • +{exercise.xp} XP</Text>
        </View>
        {Platform.OS === "ios" ? <SymbolView name="chevron.right" size={15} tintColor={SAGE[400]} /> : <Feather name="chevron-right" size={16} color={SAGE[400]} />}
      </Card>
    </CircularRevealWrapper>
  );
});

function TextBadge({ label }: { label: string }) {
  return (
    <View style={{ paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, backgroundColor: NEUTRAL.surface, borderWidth: 1, borderColor: NEUTRAL.border }}>
      <Text variant="chip" color="ink">{label}</Text>
    </View>
  );
}
