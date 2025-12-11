import React from "react";
import { AgeRange, Gender } from "@/types/types";
import { Demographics } from "./steps/demographics/Demographics";
import { MoodDef, OnBoardingFormData } from "./types";
import Animated, { FadeIn } from "react-native-reanimated";
import { AGE_RANGES, GENDERS } from "./constants";
import { JournalOptions } from "./steps/journal-options/JournalOptions";
import { JOURNALING_REASONS } from "@/constants/journaling";
import GreatCelebration from "./steps/great/GreatCelebration";
import NotificationsUI from "../../NotificationsUI";

interface RenderInputProps {
  currentMood: MoodDef;
  formData: OnBoardingFormData;
  updateFormData: (updates: Partial<OnBoardingFormData>) => void;
}

/**
 * Renders the appropriate input component based on the current step
 */
export const StepInput = React.memo(
  ({ currentMood, formData, updateFormData }: RenderInputProps) => {
    switch (currentMood?.inputType) {
      case "birthday":
        return (
          <Animated.View entering={FadeIn.duration(500).delay(100)}>
            <Demographics
              ageRanges={AGE_RANGES}
              selectedAgeRange={formData.ageRange}
              onSelectAgeRange={(value: AgeRange | undefined) =>
                updateFormData({ ageRange: value })
              }
              genders={GENDERS}
              selectedGender={formData.gender}
              onSelectGender={(value: Gender | undefined) =>
                updateFormData({ gender: value })
              }
              title="A bit about you"
              helperText="This helps personalize your experience"
            />
          </Animated.View>
        );

      case "options":
        return (
          <Animated.View
            className="flex-1"
            entering={FadeIn.duration(500).delay(100)}
          >
            <JournalOptions
              reasons={Array.from(JOURNALING_REASONS)}
              selectedReasons={formData.reasons}
              onChangeSelected={(reasons: string[]) =>
                updateFormData({ reasons })
              }
              title="What brings you to journaling?"
              helperText="Select all that apply"
              showCount
              showIcons
            />
          </Animated.View>
        );

      case "reminder":
        return (
          <Animated.View
            entering={FadeIn.duration(500).delay(100)}
            className="flex-1"
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
  }
);
