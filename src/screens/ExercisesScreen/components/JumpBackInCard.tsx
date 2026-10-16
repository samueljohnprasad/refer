import { memo } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { useTranslation } from "react-i18next";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";

import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";
import { ExerciseIcon } from "@/src/components/exercise/ExerciseIcon";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import type { ExerciseConfig } from "@/src/types/exerciseFlow";
import { NEUTRAL, SAGE } from "@/src/theme/palette";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

type JumpBackInCardProps = {
  exercise: ExerciseConfig<any>;
  width: number;
  onPress: (exercise: ExerciseConfig<any>) => void;
};

export const JumpBackInCard = memo(function JumpBackInCard({
  exercise,
  width,
  onPress,
}: JumpBackInCardProps) {
  const { t } = useTranslation("exercises");
  const translateCopy = useExerciseCopy();
  const exerciseTitle = translateCopy(exercise.title);
  const exerciseSubtitle = translateCopy(exercise.subtitle);
  const duration = exercise.duration.replace(/\smin$/, ` ${t("flow.ui.engine.minutesShort")}`);

  const handlePress = () => {
    onPress(exercise);
  };

  return (
    <CircularRevealWrapper
      href={`/tabs/screens/exercise-flow?type=${encodeURIComponent(exercise.type)}`}
      color={SAGE[100]}
      duration={800}
    >
      <Card
        variant="tile"
        radius="lg"
        showDepth={false}
        onPress={handlePress}
        style={{ width, height: 158 }}
        faceStyle={{ height: "100%", borderWidth: 1, borderColor: SAGE[200] }}
        contentClassName="p-5 justify-between flex-1"
        accessibilityLabel={`${t("library.start")} ${exerciseTitle}`}
      >
        <View style={styles.topRow}>
          <ExerciseIcon type={exercise.type} size={24} color={SAGE[600]} />
          <View style={styles.durationMeta}>
            {Platform.OS === "ios" ? (
              <SymbolView
                name={"clock" as any}
                size={11}
                tintColor={SAGE[400]}
              />
            ) : (
              <Feather name="clock" size={11} color={SAGE[400]} />
            )}
            <Text variant="caption" style={styles.durationText}>{duration}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text variant="h3" style={styles.title} numberOfLines={2}>
            {exerciseTitle}
          </Text>
          <Text variant="body" style={styles.subtitle} numberOfLines={2}>
            {exerciseSubtitle}
          </Text>
        </View>

        <View className="gap-1.5 pt-1">
          <View className="flex-row items-center gap-1">
            {Platform.OS === "ios" ? (
              <SymbolView name="bolt.fill" size={13} tintColor={SEMANTIC_COLORS.warning.foreground} />
            ) : (
              <Feather name="zap" size={13} color={SEMANTIC_COLORS.warning.foreground} />
            )}
            <Text variant="caption" color="streak" style={{ fontFamily: APP_FONT_FAMILIES.bold }}>
              +{exercise.xp} XP
            </Text>
          </View>

          <View className="flex-row items-center justify-end pt-1">
            {Platform.OS === "ios" ? (
              <SymbolView name="chevron.right" size={13} tintColor={SAGE[600]} />
            ) : (
              <Feather name="chevron-right" size={14} color={SAGE[600]} />
            )}
          </View>
        </View>
      </Card>
    </CircularRevealWrapper>
  );
});

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  durationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    fontSize: 11,
    fontWeight: "700",
    color: SAGE[400],
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 3,
  },
  title: {
    color: NEUTRAL.ink,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  subtitle: {
    color: NEUTRAL.inkSoft,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
});
