import { JSX, useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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
import { MOOD_PALE_COLORS_ARR_100 } from "@/constants/moodColors";
import NotificationsUI from "../../NotificationsUI";
import { NameOnboard } from "../NameOnboard";
type InputType = "name" | "birthday" | "options" | "reminder" | "great";

interface MoodDef {
  emoji: string;
  name: string;
  backgroundColor: string;
  headline?: string;
  subtext?: string;
  inputType: InputType;
}

export interface OnBoardingFormData {
  name: string;
  ageRange?: AgeRange;
  gender?: Gender;
  reasons: string[];
  reminderEnabled: boolean;
  reminderTime: string;
}

const moods: MoodDef[] = [
  {
    emoji: "😞",
    name: "Terrible",
    backgroundColor: "#F8D7DA",
    headline: "Bad day? You're not alone.",
    subtext: "Let's take one step upward.",
    inputType: "name",
  },
  {
    emoji: "😢",
    name: "Sad",
    backgroundColor: "#FFE4CC",
    headline: "Even heavy feelings are easier when shared with yourself.",
    subtext: "When is your special day?",
    inputType: "birthday",
  },
  {
    emoji: "😐",
    name: "Fine",
    backgroundColor: "#FFF3CD",
    headline: "Fine is okay… but let's aim higher.",
    subtext: "What brings you to journaling?",
    inputType: "options",
  },
  {
    emoji: "🙂",
    name: "Good",
    backgroundColor: "#D4EDDA",
    headline: "Good feels good. Let's grow it.",
    subtext: "Stay consistent with gentle reminders",
    inputType: "reminder",
  },
  {
    emoji: "😄",
    name: "Great",
    backgroundColor: "#FEF3E7",
    headline: "",
    subtext: "",
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

const App = ({ onComplete }: StepsAppProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const activeIndex = useSharedValue(0);
  const backgroundProgress = useSharedValue(0);

  const [splitted, setSplitted] = useState(false);
  const [isLastStep, setIsLastStep] = useState(false);

  const rightLabel = isLastStep ? "Finish" : "Continue";

  const increaseActiveIndex = useCallback(() => {
    // advance until last step; do not wrap around
    if (activeIndex.value < 4) {
      activeIndex.value = activeIndex.value + 1;
      setCurrentStep((prev) => Math.min(4, prev + 1));
    }
  }, [activeIndex]);

  const [formData, setFormData] = useState<OnBoardingFormData>({
    name: "",
    ageRange: undefined,
    gender: undefined,
    reasons: [],
    reminderEnabled: true,
    reminderTime: "9:00 AM",
  });

  useAnimatedReaction(
    () => activeIndex.value,
    (index) => {
      runOnJS(setIsLastStep)(index === 4);
    }
  );

  useEffect(() => {
    backgroundProgress.value = withTiming(activeIndex.value, { duration: 300 });
  }, [activeIndex.value]);

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        backgroundProgress.value,
        [0, 1, 2, 3, 4],
        MOOD_PALE_COLORS_ARR_100
      ),
      opacity: withTiming(1, { duration: 300 }),
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

  const renderInput = (): JSX.Element | null => {
    const current = moods[currentStep];

    switch (current?.inputType) {
      case "name":
        return (
          <NameOnboard
            name={formData.name}
            setName={(name) => setFormData((prev) => ({ ...prev, name }))}
          />
        );
      case "birthday":
        return (
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
        );
      case "options":
        return (
          <JournalOptions
            reasons={Array.from(JOURNALING_REASONS)}
            multiple
            selectedReasons={formData.reasons}
            onChangeSelected={(reasons: string[]) =>
              setFormData((prev) => ({ ...prev, reasons }))
            }
            title="What brings you to journaling?"
            helperText="Pick one or more reasons"
            showCount
            showIcons
          />
        );
      case "reminder":
        return <NotificationsUI />;
      case "great":
        return (
          <View className="flex-1 w-full mt-24">
            <GreatCelebration />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, backgroundAnimatedStyle]}>
      <View className="flex-1 w-full justify-end ">
        {renderInput()}
        <View className="ml-6">
          <Dots activeIndex={activeIndex} count={5} dotSize={24} />
        </View>
        <View style={{ marginTop: 48, marginBottom: 24 }}>
          <SplitButton
            splitted={splitted}
            mainAction={{
              label: "Continue",
              labelColor: "white",
              onPress: () => {
                if (isLastStep) {
                  // finish onboarding
                  onComplete && onComplete(formData);
                  return;
                }
                increaseActiveIndex();
                setSplitted(true);
              },
              backgroundColor: "#0c86f7",
            }}
            leftAction={{
              label: "Back",
              labelColor: "black",
              onPress: () => {
                if (activeIndex.value === 1) {
                  setSplitted(false);
                }
                activeIndex.value = Math.max(0, activeIndex.value - 1);
                setCurrentStep((prev) => (prev - 1) % 5);
              },
              backgroundColor: "rgba(0,0,0,0.08)",
            }}
            rightAction={{
              label: rightLabel,
              labelColor: "white",
              iconVisible: true,
              onPress: () => {
                // if (!canProceed()) return;
                if (isLastStep) {
                  setSplitted(false);
                  onComplete && onComplete(formData);
                  return;
                }
                increaseActiveIndex();
              },
              backgroundColor: "#0c86f7",
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
  icon: {
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 18,
    height: 18,
    marginBottom: -1.5,
  },
});

export { App };
