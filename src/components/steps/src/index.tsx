import { JSX, useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  FadeIn,
  FadeOut,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { atom, useAtom } from "jotai";
import { Dots } from "./steps/dots";
import { SplitButton } from "./steps/split-button";
import { Text } from "@/components/Themed";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { JournalOptions } from "./steps/journal-options/JournalOptions";
import {
  AgeRangeOption,
  Demographics,
} from "./steps/demographics/Demographics";
import { GreatCelebration } from "./steps/great/GreatCelebration";
import { AgeRange, Gender } from "@/types/types";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import { JOURNALING_REASONS } from "@/constants/journaling";
import NotificationsUI from "../../NotificationsUI";
import type { RemindersConfig } from "@/src/lib/notification-reminders";
import { syncRemindersToSupabase } from "@/src/network/reminders";
import { NameOnboard } from "../NameOnboard";
import { BlurView } from "expo-blur";
type InputType = "name" | "birthday" | "options" | "reminder" | "great";

interface MoodDef {
  emoji: string;
  name: string;
  backgroundColor: string;
  inputType: InputType;
}

export interface OnBoardingFormData {
  name: string;
  ageRange?: AgeRange;
  gender?: Gender;
  reasons: string[];
}

// Premium color palette with luxury gradients
const moods: MoodDef[] = [
  {
    emoji: "😞",
    name: "Terrible",
    backgroundColor: "#E8D5FF", // Rich lavender gradient base
    inputType: "name",
  },
  {
    emoji: "😢",
    name: "Sad",
    backgroundColor: "#FFE0F0", // Elegant rose gradient base
    inputType: "birthday",
  },
  {
    emoji: "😐",
    name: "Fine",
    backgroundColor: "#FFF3D4", // Warm golden gradient base
    inputType: "options",
  },
  {
    emoji: "🙂",
    name: "Good",
    backgroundColor: "#DCF2FF", // Premium sky gradient base
    inputType: "reminder",
  },
  {
    emoji: "😄",
    name: "Great",
    backgroundColor: "#E5FFE5", // Fresh mint gradient base
    inputType: "great",
  },
];

const AGE_RANGES: readonly AgeRangeOption[] = [
  {
    label: "18-24",
    value: "18_24",
  },
  {
    label: "25-34",
    value: "25_34",
  },
  {
    label: "35-44",
    value: "35_44",
  },
  {
    label: "45-54",
    value: "45_54",
  },
  {
    label: "55-64",
    value: "55_64",
  },
  {
    label: "65+",
    value: "65+",
  },
];

const GENDERS: readonly Gender[] = ["male", "female", "other"];

type StepsAppProps = {
  onComplete?: (onBoardingData: OnBoardingFormData) => void;
};

export const onboardFormDataAtom = atom<OnBoardingFormData>({
  name: "",
  ageRange: undefined,
  gender: undefined,
  reasons: [],
});

const App = ({ onComplete }: StepsAppProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const activeIndex = useSharedValue(0);
  const backgroundProgress = useSharedValue(0);

  const [splitted, setSplitted] = useState(false);
  const [isLastStep, setIsLastStep] = useState(false);

  const rightLabel = isLastStep ? " Start Your First Entry 🚀" : "Continue";

  const increaseActiveIndex = useCallback(() => {
    // advance until last step; do not wrap around
    if (activeIndex.value < 4) {
      activeIndex.value = activeIndex.value + 1;
      setCurrentStep((prev) => Math.min(4, prev + 1));
    }
  }, [activeIndex]);

  const [formData, setFormData] =
    useAtom<OnBoardingFormData>(onboardFormDataAtom);

  useAnimatedReaction(
    () => activeIndex.value,
    (index) => {
      runOnJS(setIsLastStep)(index === 4);
    }
  );

  useEffect(() => {
    backgroundProgress.value = withTiming(activeIndex.value, { duration: 300 });
  }, [activeIndex.value]);

  // Luxury gradient background animation
  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const progress = backgroundProgress.value;
    return {
      backgroundColor: interpolateColor(
        progress,
        [0, 1, 2, 3, 4],
        [
          "#E8D5FF", // Rich lavender
          "#FFE0F0", // Elegant rose
          "#FFF3D4", // Warm golden
          "#DCF2FF", // Premium sky
          "#E5FFE5", // Fresh mint
        ]
      ),
    };
  });

  // Glass overlay animation
  const glassOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(0.4, { duration: 500 }),
    };
  });

  const { height } = useGradualAnimation();

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  const currentMood: MoodDef = moods[currentStep];
  const canProceed = (): boolean => {
    const current = moods[currentStep];
    switch (current?.inputType) {
      case "birthday":
        return (
          typeof formData.ageRange === "string" &&
          formData.ageRange.trim().length > 0 &&
          !formData.gender
        );
      case "options":
        return Array.isArray(formData.reasons) && formData.reasons.length > 0;
      default:
        return true;
    }
  };

  // Floating animation for headline and subtext
  const floatingAnimation = useSharedValue(0);

  useEffect(() => {
    floatingAnimation.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(
        200,
        withTiming(1, {
          duration: 800,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      )
    );
  }, [currentStep]);

  const headlineAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: floatingAnimation.value,
      transform: [
        {
          translateY: withSpring(
            floatingAnimation.value * 0 + (1 - floatingAnimation.value) * 20,
            { damping: 15, stiffness: 100 }
          ),
        },
      ],
    };
  });

  const renderInput = (): JSX.Element | null => {
    const current = moods[currentStep];

    switch (current?.inputType) {
      case "name":
        return (
          <Animated.View entering={FadeIn.duration(500).delay(100)}>
            <NameOnboard
              name={formData.name}
              setName={(name) => setFormData((prev) => ({ ...prev, name }))}
            />
          </Animated.View>
        );
      case "birthday":
        return (
          <Animated.View entering={FadeIn.duration(500).delay(100)}>
            <Demographics
              ageRanges={AGE_RANGES}
              selectedAgeRange={formData.ageRange}
              onSelectAgeRange={(value: AgeRange) =>
                setFormData((prev) => ({ ...prev, ageRange: value }))
              }
              genders={GENDERS}
              selectedGender={formData.gender}
              onSelectGender={(value: Gender) =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
              title="A bit about you"
              helperText="This helps personalize your experience"
            />
          </Animated.View>
        );
      case "options":
        return (
          <Animated.View
            className="flex-1 "
            entering={FadeIn.duration(500).delay(100)}
          >
            <JournalOptions
              reasons={Array.from(JOURNALING_REASONS)}
              selectedReasons={formData.reasons}
              onChangeSelected={(reasons: string[]) =>
                setFormData((prev) => ({ ...prev, reasons }))
              }
              title="What brings you to journaling?"
              helperText="Pick one or more reasons"
              showCount
              showIcons
            />
          </Animated.View>
        );
      case "reminder":
        return (
          <Animated.View
            entering={FadeIn.duration(500).delay(100)}
            className="flex-1 "
          >
            <NotificationsUI />
          </Animated.View>
        );
      case "great":
        return (
          <Animated.View
            entering={FadeIn.duration(500).delay(100)}
            className="flex-1 w-full"
          >
            <GreatCelebration />
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, backgroundAnimatedStyle]}>
      {/* Premium glass overlay for depth */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: "rgba(255,255,255,0.15)",
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
          },
          glassOverlayStyle,
        ]}
      />

      {/* Content area with proper spacing */}
      <View
        className="flex-1 w-full "
        style={{ paddingTop: 70, paddingBottom: 30 }}
      >
        {renderInput()}
      </View>

      {/* Bottom section for progress and buttons */}
      <View className="w-full" style={{ marginTop: 20 }}>
        {/* Premium progress indicator with step labels */}
        <View className="px-6 mb-2">
          <Dots activeIndex={activeIndex} count={5} dotSize={18} />
        </View>

        {/* Premium navigation buttons with glass effect */}
        <View style={{ marginTop: 24, marginBottom: 24 }}>
          <SplitButton
            splitted={splitted}
            mainAction={{
              label: "Continue",
              labelColor: "white",
              onPress: async () => {
                if (isLastStep) {
                  onComplete && onComplete(formData);
                  return;
                }
                increaseActiveIndex();
                setSplitted(true);
              },
              backgroundColor: "#7C3AED", // Premium violet
            }}
            leftAction={{
              label: "Back",
              labelColor: "#64748B",
              onPress: () => {
                if (activeIndex.value === 1) {
                  setSplitted(false);
                }
                activeIndex.value = Math.max(0, activeIndex.value - 1);
                setCurrentStep((prev) => Math.max(0, prev - 1));
              },
              backgroundColor: "rgba(255,255,255,0.85)",
            }}
            rightAction={{
              label: rightLabel,
              labelColor: "white",
              iconVisible: true,
              onPress: async () => {
                if (isLastStep) {
                  setSplitted(false);
                  onComplete && onComplete(formData);
                  return;
                }
                increaseActiveIndex();
              },
              backgroundColor: "#7C3AED", // Premium violet
            }}
          />
        </View>
        <Animated.View style={keyboardPadding} pointerEvents="none" />
        <KeyboardToolbar
          pointerEvents="none"
          content={<Text></Text>}
          showArrows={false}
          insets={{ left: 16, right: 0 }}
          doneText="Close keyboard"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});

export { App };
