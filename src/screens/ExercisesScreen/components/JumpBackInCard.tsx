import { memo } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { PlayIcon, ZapIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useTranslation } from "react-i18next";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";

import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";
import { ExerciseIcon } from "@/src/components/exercise/ExerciseIcon";
import { Card } from "@/src/components/ui/Card";
import type { ExerciseCategory, ExerciseConfig } from "@/src/types/exerciseFlow";

// ponytail: calm therapeutic palette anchored in Happy sage design system
interface CategoryCardTheme {
  iconBg: string;
  accent: string;
  rim: string;
}

const CATEGORY_THEME: Record<ExerciseCategory, CategoryCardTheme> = {
  cbt_core: {
    iconBg: "rgba(95, 127, 88, 0.12)",
    accent: "#44633F",
    rim: "#29452A",
  },
  mindfulness: {
    iconBg: "rgba(74, 119, 157, 0.12)",
    accent: "#36688D",
    rim: "#244B68",
  },
  anxiety: {
    iconBg: "rgba(184, 93, 54, 0.12)",
    accent: "#B85D36",
    rim: "#8D4324",
  },
  overthinking: {
    iconBg: "rgba(103, 77, 160, 0.12)",
    accent: "#674DA0",
    rim: "#4E387D",
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
  const duration = exercise.duration.replace(/\smin$/, ` ${t("flow.ui.engine.minutesShort")}`);
  const theme = CATEGORY_THEME[exercise.category] ?? CATEGORY_THEME.cbt_core;

  const handlePress = () => {
    onPress(exercise);
  };

  return (
    <CircularRevealWrapper
      href={`/tabs/screens/exercise-flow?type=${encodeURIComponent(exercise.type)}`}
      color={theme.iconBg}
      duration={800}
    >
      <Card
        variant="tile"
        radius="lg"
        showDepth={true}
        onPress={handlePress}
        style={{ width, height: 164 }}
        rimStyle={{ backgroundColor: "#D4D4D4" }}
        faceStyle={{
          height: "100%",
        }}
        contentClassName="p-3.5 justify-between flex-1"
        accessibilityLabel={`${t("library.start")} ${exerciseTitle}`}
      >
        <View style={styles.topRow}>
          <View style={[styles.iconWell, { backgroundColor: theme.iconBg }]}>
            <ExerciseIcon type={exercise.type} size={18} color={theme.accent} />
          </View>
          <View style={styles.durationPill}>
            {Platform.OS === "ios" ? (
              <SymbolView
                name={"clock" as any}
                size={11}
                tintColor="#52525B"
              />
            ) : (
              <Feather name="clock" size={11} color="#52525B" />
            )}
              <Text style={styles.durationText}>{duration}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {exerciseTitle}
          </Text>
        </View>

        <View className="gap-1.5 pt-1">
          <View className="flex-row items-center gap-1">
            <HugeiconsIcon icon={ZapIcon} size={13} color="#C89400" />
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.bold }}
              className="text-[12px] text-amber-700"
            >
              +{exercise.xp} XP
            </Text>
          </View>

          <View className="h-7 w-full justify-center rounded-full bg-sage-600 flex-row items-center gap-1">
            <HugeiconsIcon icon={PlayIcon} size={11} color="#FFFFFF" />
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
  iconWell: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F4F4F6",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
  },
  durationText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#52525B",
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
});
