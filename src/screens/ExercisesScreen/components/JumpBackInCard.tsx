import { memo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";
import { ExerciseIcon } from "@/src/components/exercise/ExerciseIcon";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import type { ExerciseCategory, ExerciseConfig } from "@/src/types/exerciseFlow";

// ponytail: reusable Card + Button without corner-halo depth artifact
interface CategoryCardTheme {
  iconBg: string;
  accent: string;
  rim: string;
}

const CATEGORY_THEME: Record<ExerciseCategory, CategoryCardTheme> = {
  cbt_core: {
    iconBg: "#E8FBF0",
    accent: "#22C55E",
    rim: "#16A34A",
  },
  mindfulness: {
    iconBg: "#E4F6FC",
    accent: "#00A3D9",
    rim: "#0084B4",
  },
  anxiety: {
    iconBg: "#FFEDE8",
    accent: "#FF6B4A",
    rim: "#E04B2A",
  },
  overthinking: {
    iconBg: "#F0EDFF",
    accent: "#6B5CE7",
    rim: "#5243C7",
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
        style={{ width, height: 160 }}
        rimStyle={{ backgroundColor: "#D4D4D4" }}
        faceStyle={{
          height: "100%",
        }}
        contentClassName="p-3.5 justify-between flex-1"
        accessibilityLabel={`Start ${exercise.title}`}
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
            <Text style={styles.durationText}>{exercise.duration}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={3}>
            {exercise.title}
          </Text>
        </View>

        <Button
          label="Start"
          size="sm"
          height={32}
          fullWidth={true}
          leftIcon={<HugeiconsIcon icon={PlayIcon} size={13} color="#FFFFFF" />}
          faceColor={theme.accent}
          rimColor={theme.rim}
          onPress={handlePress}
        />
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
