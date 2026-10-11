import { memo } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { useTranslation } from "react-i18next";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";

import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";
import { ExerciseIcon } from "@/src/components/exercise/ExerciseIcon";
import { Card } from "@/src/components/ui/Card";
import type { ExerciseCategory, ExerciseConfig } from "@/src/types/exerciseFlow";

// ponytail: calm therapeutic palette anchored in Happy sage design system
interface CategoryCardTheme {
  accent: string;
}

const CATEGORY_THEME: Record<ExerciseCategory, CategoryCardTheme> = {
  cbt_core: {
    accent: "#44633F",
  },
  mindfulness: {
    accent: "#36688D",
  },
  anxiety: {
    accent: "#B85D36",
  },
  overthinking: {
    accent: "#674DA0",
  },
};

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
  const theme = CATEGORY_THEME[exercise.category] ?? CATEGORY_THEME.cbt_core;

  const handlePress = () => {
    onPress(exercise);
  };

  return (
    <CircularRevealWrapper
      href={`/tabs/screens/exercise-flow?type=${encodeURIComponent(exercise.type)}`}
      color="#E5EDE1"
      duration={800}
    >
      <Card
        variant="tile"
        radius="lg"
        showDepth={true}
        onPress={handlePress}
        style={{ width, height: 148 }}
        rimStyle={{ backgroundColor: "#D3E0CD" }}
        faceStyle={{
          height: "100%",
        }}
        contentClassName="p-4 justify-between flex-1"
        accessibilityLabel={`${t("library.start")} ${exerciseTitle}`}
      >
        <View style={styles.topRow}>
          <ExerciseIcon type={exercise.type} size={24} color={theme.accent} />
          <View style={styles.durationPill}>
            {Platform.OS === "ios" ? (
              <SymbolView
                name={"clock" as any}
                size={11}
                tintColor={theme.accent}
              />
            ) : (
              <Feather name="clock" size={11} color={theme.accent} />
            )}
              <Text style={[styles.durationText, { color: theme.accent }]}>{duration}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {exerciseTitle}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {exerciseSubtitle}
          </Text>
        </View>

        <View className="gap-1.5 pt-1">
          <View className="flex-row items-center gap-1">
            {Platform.OS === "ios" ? (
              <SymbolView name="bolt.fill" size={13} tintColor="#C89400" />
            ) : (
              <Feather name="zap" size={13} color="#C89400" />
            )}
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.bold }}
              className="text-[12px] text-amber-700"
            >
              +{exercise.xp} XP
            </Text>
          </View>

          <View className="h-7 w-full justify-center rounded-full bg-sage-600 flex-row items-center gap-1">
            {Platform.OS === "ios" ? (
              <SymbolView name="play.fill" size={11} tintColor="#FFFFFF" />
            ) : (
              <Feather name="play" size={11} color="#FFFFFF" />
            )}
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.bold }}
              className="text-[11px] text-white"
            >
              {t("library.start")}
            </Text>
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
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F1F5EF",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
  },
  durationText: {
    fontSize: 11,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 3,
  },
  title: {
    color: "#142414",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
    lineHeight: 19,
  },
  subtitle: {
    color: "#5E6B60",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
});
