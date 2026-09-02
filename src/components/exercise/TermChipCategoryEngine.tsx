import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";

interface TermChip {
  id: string;
  label: string;
  details: string;
}

export function TermChipCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const chips = readChips(content.chips);
  
  const openedIds = readStringArray(saved?.openedIds);

  const isComplete = openedIds.length === chips.length && chips.length > 0;

  React.useEffect(() => {
    if (isComplete && !saved?.completed) {
      const timer = setTimeout(() => {
        onInteraction({ ...saved, completed: true }, true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onInteraction, saved]);

  const toggleChip = (id: string) => {
    if (locked) return;
    Haptics.selectionAsync();
    const isOpened = openedIds.includes(id);
    const nextOpened = isOpened 
      ? openedIds.filter((x) => x !== id) 
      : [...openedIds, id];
    
    onInteraction({ ...saved, openedIds: nextOpened }, false);
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Review"}
        instruction={readString(content.instruction) ?? "Tap each term to reveal its meaning."}
      />
      <View style={styles.chipGrid}>
        {chips.map((chip, index) => (
          <TermChipCard
            key={chip.id}
            chip={chip}
            index={index}
            isOpen={openedIds.includes(chip.id)}
            onPress={() => toggleChip(chip.id)}
            disabled={locked}
          />
        ))}
      </View>
    </View>
  );
}

function TermChipCard({
  chip,
  index,
  isOpen,
  onPress,
  disabled,
}: {
  chip: TermChip;
  index: number;
  isOpen: boolean;
  onPress: () => void;
  disabled: boolean;
}) {
  const expandProgress = useSharedValue(isOpen ? 1 : 0);

  React.useEffect(() => {
    expandProgress.value = withSpring(isOpen ? 1 : 0, {
      damping: 24,
      stiffness: 250,
      mass: 0.8,
    });
  }, [isOpen, expandProgress]);

  const bodyStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
      transform: [
        {
          translateY: withSpring(isOpen ? 0 : -8, {
            damping: 24,
            stiffness: 250,
          }),
        },
      ],
      maxHeight: isOpen ? 500 : 0,
      overflow: "hidden",
    };
  });

  return (
    <View style={styles.cardContainer}>
      <View style={[styles.rim, isOpen && styles.openRim]} />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen, disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.panel,
          isOpen && styles.openPanel,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <Text style={[styles.panelLabel, isOpen && styles.openLabel]}>
          {chip.label.toUpperCase()}
        </Text>
        <Animated.View style={bodyStyle}>
          <Text style={styles.panelBody}>{chip.details}</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

function readChips(val: unknown): TermChip[] {
  if (!Array.isArray(val)) return [];
  return val.map((item) => ({
    id: readString(item?.id) ?? "",
    label: readString(item?.label) ?? "",
    details: readString(item?.details) ?? "",
  })).filter((c) => c.id && c.label);
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 24,
  },
  chipGrid: {
    gap: 12,
  },
  cardContainer: {
    paddingBottom: 3,
    alignSelf: "stretch",
  },
  rim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 3,
    borderRadius: 22,
    backgroundColor: SEMANTIC_COLORS.border.default,
  },
  openRim: {
    backgroundColor: SEMANTIC_COLORS.brand.primary,
  },
  panel: {
    minHeight: 91,
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: SEMANTIC_COLORS.border.default,
    borderRadius: 22,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  openPanel: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  pressed: { transform: [{ translateY: 3 }] },
  panelLabel: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 10.5,
    letterSpacing: 0.5,
  },
  openLabel: { color: SEMANTIC_COLORS.brand.pressed },
  panelBody: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 22,
    paddingTop: 3,
  },
});
