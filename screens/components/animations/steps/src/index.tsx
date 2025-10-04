import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  interpolateColor,
  Keyframe,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Dots } from "./steps/dots";
import { SplitButton } from "./steps/split-button";
import { MOOD_PALE_COLORS_ARR_100 } from "@/constants/moodColors";
import { Text } from "@/components/Themed";
import { NameInput } from "../../name-input";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import NotificationsUI from "@/screens/components/NotificationsUI";
import { JournalOptions } from "./steps/journal-options/JournalOptions";
import { JOURNALING_REASONS } from "@/constants/journaling";
import { Demographics } from "./steps/demographics/Demographics";
import type { Gender } from "./steps/demographics/Demographics";

type InputType = "name" | "birthday" | "options" | "reminder" | "";

interface MoodDef {
  emoji: string;
  name: string;
  backgroundColor: string;
  headline: string;
  subtext: string;
  inputType: InputType;
}

interface FormData {
  name: string;
  ageRange: string;
  gender: Gender | "";
  reasons: string[];
  reminderEnabled: boolean;
  reminderTime: string;
  currentMood: string;
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
    backgroundColor: "#CCE5FF",
    headline: "Welcome to Great 🎉",
    subtext: "",
    inputType: "",
  },
];

const AGE_RANGES: readonly string[] = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55+",
];

const GENDERS: readonly Gender[] = ["male", "female", "other"];

const ScaleOpacityKeyframe = {
  from: {
    opacity: 0,
    transform: [{ scale: 0 }],
  },
  to: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
};

// Instead of using Entering and Exiting Layout Animations, we can use Keyframes!
// I created a detailed tutorial about it at https://www.reanimate.dev
const ScaleIconEnteringKeyframe = new Keyframe(ScaleOpacityKeyframe).duration(
  250
);

const ScaleIconExitingKeyframe = new Keyframe({
  from: ScaleOpacityKeyframe.to,
  to: ScaleOpacityKeyframe.from,
}).duration(200);

const App = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const activeIndex = useSharedValue(0);
  const backgroundProgress = useSharedValue(0);

  const [splitted, setSplitted] = useState(false);
  const [isLastStep, setIsLastStep] = useState(false);

  const rightLabel = isLastStep ? "Finish" : "Continue";

  const increaseActiveIndex = useCallback(() => {
    activeIndex.value = (activeIndex.value + 1) % 5;
    setCurrentStep((prev) => (prev + 1) % 5);
  }, [activeIndex]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    ageRange: "",
    gender: "",
    reasons: [],
    reminderEnabled: false,
    reminderTime: "9:00 AM",
    currentMood: "",
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
          formData.gender !== ""
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
        return <NameInput />;
      case "birthday":
        return (
          <Demographics
            ageRanges={AGE_RANGES}
            selectedAgeRange={formData.ageRange}
            onSelectAgeRange={(value: string) =>
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
          {/*
           * I explained in detail in one of my tutorials how to recreate (almost) this exact component:
           * Split Button: https://youtu.be/GxkzFYI6eqI
           * Side note: the code can be cleaner 😅
           */}

          <SplitButton
            splitted={splitted}
            mainAction={{
              label: "Continue",
              labelColor: "white",
              onPress: () => {
                // if (!canProceed()) return;
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
              // icon: (
              //   <Animated.View
              //     entering={ScaleIconEnteringKeyframe}
              //     exiting={ScaleIconExitingKeyframe}
              //     style={styles.icon}
              //   >
              //     <Feather name="arrow-right" size={20} />
              //   </Animated.View>
              // ),
              iconVisible: true,
              onPress: () => {
                // if (!canProceed()) return;
                if (activeIndex.value === 4) {
                  setSplitted(false);
                }
                increaseActiveIndex();
              },
              backgroundColor: "#0c86f7",
            }}
          />
        </View>
        <Animated.View style={keyboardPadding} />
        <KeyboardToolbar
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
