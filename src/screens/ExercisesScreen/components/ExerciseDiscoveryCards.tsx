import { memo, useCallback, type ReactElement } from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";
import { ExerciseArt } from "@/src/domains/exercises/ui/presentation/components/ExerciseArt";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { useFreemiumGate } from "@/src/hooks/useFreemiumGate";
import type { ExerciseConfig } from "@/src/types/exerciseFlow";
import { NEUTRAL, SAGE } from "@/src/theme/palette";
import { NEW_EXERCISE_TYPES } from "@/src/domains/exercises/data/exerciseCopy";
import { buildExerciseRoute, getCategoryBadgeTheme } from "../exerciseScreenUtils";
import { nutrieStyles } from "../ExercisesScreen.styles";

interface ExerciseCardProps {
  exercise: ExerciseConfig<any>;
  onPress: (exercise: ExerciseConfig<any>) => void;
}

function localizeDuration(duration: string, minutesShort: string): string {
  return duration.replace(/\smin$/, ` ${minutesShort}`);
}

// ponytail: .tile from .agents/exercises.html — art block (category hue) with Pro/New badge on it,
// bold name, clock + duration. Hairline ring, no shadow.
export const ExerciseTile = memo(function ExerciseTile({ exercise, onPress }: ExerciseCardProps): ReactElement {
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
        style={{ width: 148 }}
        faceStyle={{ backgroundColor: NEUTRAL.white, borderWidth: 1, borderColor: SAGE[100] }}
        contentClassName="p-2"
      >
        <View style={{ height: 96, borderRadius: 12, overflow: "hidden", backgroundColor: getCategoryBadgeTheme(exercise.category).bg }}>
          <ExerciseArt type={exercise.type} />
          <View style={{ position: "absolute", top: 6, left: 6, flexDirection: "row" }}>
            {isGated ? <TextBadge label="PRO" icon="lock" first /> : null}
            {NEW_EXERCISE_TYPES.has(exercise.type) ? <TextBadge label="New" solid first={!isGated} /> : null}
          </View>
        </View>
        <Text style={[nutrieStyles.exerciseTitle, { fontSize: 15, marginTop: 8, marginBottom: 2 }]} numberOfLines={2}>{translateCopy(exercise.title)}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Feather name="clock" size={12} color={SAGE[400]} />
          <Text style={[nutrieStyles.exerciseSubtitle, { fontSize: 13 }]} numberOfLines={1}>{localizeDuration(exercise.duration, t("flow.ui.engine.minutesShort"))}</Text>
        </View>
      </Card>
    </CircularRevealWrapper>
  );
});

function TextBadge({ label, icon, solid, first }: { label: string; icon?: "lock"; solid?: boolean; first?: boolean }) {
  return (
    <View
      style={{
        flexDirection: "row", alignItems: "center", gap: 3, marginLeft: first ? 0 : 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999,
        backgroundColor: solid ? "#5f7f58" : NEUTRAL.surface, borderWidth: solid ? 0 : 1, borderColor: NEUTRAL.border,
      }}
    >
      {icon ? <Feather name={icon} size={10} color="#142414" /> : null}
      <Text variant="chip" style={{ color: solid ? "#fff" : "#142414" }}>{label}</Text>
    </View>
  );
}
