import { useEffect } from "react";
import { useColorScheme } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  interpolate,
  interpolateColor,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";
import {
  ANIMATION_CONFIG,
  SPRING_CONFIG,
  INSIGHTS_ANIMATION_CONFIG,
} from "../constants";

interface UseJournalAnimationsProps {
  isEditing: boolean;
  isInsightsOpen: boolean;
}

interface AnimatedStyles {
  backIconStyle: any;
  closeIconStyle: any;
  singleEmojiStyle: any;
  emojiRowStyle: any;
  summaryStyle: any;
  moodCardStyle: any;
  insightsChevronStyle: any;
}

interface UseJournalAnimationsReturn {
  editProgress: SharedValue<number>;
  editProgressDelayed: SharedValue<number>;
  moodProgress: SharedValue<number>;
  insightsOpen: SharedValue<number>;
  animatedStyles: AnimatedStyles;
}

/**
 * Hook to manage all journal screen animations
 * Handles edit mode transitions, mood card animations, and insights collapse
 */
export const useJournalAnimations = ({
  isEditing,
  isInsightsOpen,
}: UseJournalAnimationsProps): UseJournalAnimationsReturn => {
  const colorScheme = useColorScheme();
  
  // Shared values for animations
  const editProgress = useSharedValue<number>(0);
  const editProgressDelayed = useSharedValue<number>(0);
  const moodProgress = useSharedValue<number>(0);
  const insightsOpen = useSharedValue<number>(isInsightsOpen ? 1 : 0);

  // Trigger animations on edit mode change
  useEffect((): void => {
    editProgress.value = withTiming(isEditing ? 1 : 0, ANIMATION_CONFIG);
    editProgressDelayed.value = withDelay(
      120,
      withTiming(isEditing ? 1 : 0, ANIMATION_CONFIG)
    );
    moodProgress.value = withSpring(isEditing ? 1 : 0, SPRING_CONFIG);
  }, [isEditing, editProgress, editProgressDelayed, moodProgress]);

  // Back icon fade out animation
  const backIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      editProgress.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          editProgress.value,
          [0, 1],
          [1, 0.98],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  // Close icon fade in animation
  const closeIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      editProgressDelayed.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          editProgressDelayed.value,
          [0, 1],
          [0.98, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  // Single emoji animation (fades out during edit)
  const singleEmojiStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      editProgress.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          editProgress.value,
          [0, 1],
          [1, 0.9],
          Extrapolation.CLAMP
        ),
      },
      {
        translateX: interpolate(
          editProgress.value,
          [0, 1],
          [0, -8],
          Extrapolation.CLAMP
        ),
      },
      {
        translateY: interpolate(
          editProgress.value,
          [0, 1],
          [0, -4],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  // Emoji row animation (fades in during edit)
  const emojiRowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      editProgressDelayed.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          editProgressDelayed.value,
          [0, 1],
          [0.95, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  // Summary text animation (fades out during edit)
  const summaryStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      editProgress.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          editProgress.value,
          [0, 1],
          [0, -6],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  // Mood card color and elevation animation
  const moodCardStyle = useAnimatedStyle(() => {
    const startColor: string = colorScheme === "dark" ? "#6A5100" : "#FFD24A";
    const endColor: string = colorScheme === "dark" ? "#7F6300" : "#FFE08A";
    
    return {
      backgroundColor: interpolateColor(
        moodProgress.value,
        [0, 1],
        [startColor, endColor]
      ),
      transform: [
        {
          translateY: interpolate(
            moodProgress.value,
            [0, 1],
            [0, -4],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            moodProgress.value,
            [0, 1],
            [1, 1.02],
            Extrapolation.CLAMP
          ),
        },
      ],
      shadowColor: "#000",
      shadowOpacity: interpolate(
        moodProgress.value,
        [0, 1],
        [0.08, 0.16],
        Extrapolation.CLAMP
      ),
      shadowRadius: interpolate(
        moodProgress.value,
        [0, 1],
        [4, 8],
        Extrapolation.CLAMP
      ),
      shadowOffset: { width: 0, height: 2 },
      elevation: interpolate(
        moodProgress.value,
        [0, 1],
        [0, 4],
        Extrapolation.CLAMP
      ) as unknown as number,
    };
  });

  // Insights chevron rotation animation
  const insightsChevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(insightsOpen.value, [0, 1], [0, 180])}deg`,
      },
    ],
  }));

  return {
    editProgress,
    editProgressDelayed,
    moodProgress,
    insightsOpen,
    animatedStyles: {
      backIconStyle,
      closeIconStyle,
      singleEmojiStyle,
      emojiRowStyle,
      summaryStyle,
      moodCardStyle,
      insightsChevronStyle,
    },
  };
};
