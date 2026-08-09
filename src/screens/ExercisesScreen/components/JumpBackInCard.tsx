import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Haptics from "expo-haptics";
import { memo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";

import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";
import type { ExerciseCategory, ExerciseConfig } from "@/src/types/exerciseFlow";

type CardArtwork = {
  base: [string, string];
  blob: [string, string];
};

const CARD_ART: Record<ExerciseCategory, CardArtwork> = {
  cbt_core: {
    base: ["rgba(45,75,230,0.95)", "rgba(48,44,150,0.88)"],
    blob: ["rgba(255,130,80,0.95)", "rgba(240,80,190,0.65)"],
  },
  mindfulness: {
    base: ["rgba(16,130,150,0.92)", "rgba(24,86,180,0.85)"],
    blob: ["rgba(120,255,190,0.9)", "rgba(60,210,255,0.55)"],
  },
  anxiety: {
    base: ["rgba(220,120,40,0.92)", "rgba(190,60,90,0.85)"],
    blob: ["rgba(255,230,140,0.92)", "rgba(255,150,90,0.55)"],
  },
  overthinking: {
    base: ["rgba(40,150,120,0.92)", "rgba(30,100,160,0.85)"],
    blob: ["rgba(180,255,220,0.9)", "rgba(90,220,200,0.5)"],
  },
};

const EXERCISE_ART: Record<string, CardArtwork> = {
  thought_reframing: {
    base: ["rgba(45,75,230,0.95)", "rgba(48,44,150,0.88)"],
    blob: ["rgba(255,130,80,0.95)", "rgba(240,80,190,0.65)"],
  },
  thought_catcher: {
    base: ["rgba(16,130,150,0.92)", "rgba(24,86,180,0.85)"],
    blob: ["rgba(120,255,190,0.9)", "rgba(60,210,255,0.55)"],
  },
  mindful_breathing_1min: {
    base: ["rgba(130,60,220,0.92)", "rgba(70,50,190,0.85)"],
    blob: ["rgba(255,190,120,0.92)", "rgba(255,110,180,0.55)"],
  },
  gratitude_reframe: {
    base: ["rgba(130,60,220,0.92)", "rgba(70,50,190,0.85)"],
    blob: ["rgba(255,190,120,0.92)", "rgba(255,110,180,0.55)"],
  },
};

type ExperimentalGradientStyle = ViewStyle & {
  experimental_backgroundImage: string;
};

function gradientLayer(backgroundImage: string): ExperimentalGradientStyle {
  return {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    experimental_backgroundImage: backgroundImage,
  };
}

type JumpBackInCardProps = {
  exercise: ExerciseConfig<any>;
  width: number;
  blurred?: boolean;
  onPress: (exercise: ExerciseConfig<any>) => void;
};

export const JumpBackInCard = memo(function JumpBackInCard({
  exercise,
  width,
  blurred = false,
  onPress,
}: JumpBackInCardProps) {
  const art = EXERCISE_ART[exercise.type] ?? CARD_ART[exercise.category];
  const hasGlass = isLiquidGlassAvailable();
  const readabilityFade = hasGlass
    ? "linear-gradient(to bottom, transparent 38%, rgba(0,0,0,0.38) 66%, rgba(0,0,0,0.68) 100%)"
    : "linear-gradient(to bottom, transparent 38%, rgba(0,0,0,0.16) 66%, rgba(0,0,0,0.34) 100%)";

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress(exercise);
  };

  const cardContent = (
    <>
      <View style={styles.artClip} pointerEvents="none">
        <View
          style={gradientLayer(
            `linear-gradient(to bottom, ${art.base[0]} 0%, ${art.base[1]} 45%, transparent 78%)`,
          )}
        />
        <View
          style={gradientLayer(
            `radial-gradient(ellipse 78px 78px at 100% 0%, ${art.blob[0]} 0%, ${art.blob[1]} 40%, transparent 100%)`,
          )}
        />
        <View
          style={gradientLayer(readabilityFade)}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {exercise.title}
        </Text>
        <Text style={styles.duration}>{exercise.duration}</Text>
        <View style={styles.button}>
          <HugeiconsIcon icon={PlayIcon} size={14} color="#FFFFFF" />
          <Text style={styles.buttonLabel}>Start</Text>
        </View>
      </View>
    </>
  );

  return (
    <CircularRevealWrapper
      href={`/tabs/screens/exercise-flow?type=${encodeURIComponent(exercise.type)}`}
      color={art.base[0].toString()}
      duration={800}
    >
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Start ${exercise.title}`}
        style={[styles.item, { width }]}
      >
        {hasGlass ? (
          <GlassView
            glassEffectStyle="regular"
            isInteractive
            style={styles.card}
          >
            {cardContent}
          </GlassView>
        ) : (
          <View style={[styles.card, styles.fallbackCard]}>{cardContent}</View>
        )}
        {blurred ? (
          <BlurView
            intensity={14}
            tint="systemThinMaterialDark"
            pointerEvents="none"
            style={StyleSheet.absoluteFill}
          />
        ) : null}
      </Pressable>
    </CircularRevealWrapper>
  );
});

const styles = StyleSheet.create({
  item: {
    aspectRatio: 0.88,
  },
  card: {
    flex: 1,
    borderRadius: 36,
    borderCurve: "continuous",
    backgroundColor: "rgba(14,14,22,0.60)",
  },
  fallbackCard: {
    backgroundColor: "rgba(255,255,255,0.62)",
  },
  artClip: {
    bottom: 0,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
    borderRadius: 36,
    borderCurve: "continuous",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 14,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 19,
  },
  duration: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
    marginBottom: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 20,
    borderCurve: "continuous",
    flexDirection: "row",
    gap: 6,
    height: 40,
    justifyContent: "center",
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
