import React from "react";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { GlassView } from "expo-glass-effect";
import { LessonHeader } from "@/src/components/ui/LessonHeader";
import { SafeAreaView } from "@/src/components/tw";
import type { OnboardingStepName } from "../types";

export interface HeaderConfig {
  visible: boolean;
  showBackButton?: boolean;
  backButtonVariant?: "arrow" | "close";
  progress?: number;
  progressFillColor?: string;
  progressTrackColor?: string;
  trailingLabel?: string;
  trailingLabelColor?: string;
  trailingLabelTracking?: number;
  trailingLabelAlignment?: "center" | "end";
}

const HEADER_ICON_COLOR = "#4F604F";

// ponytail: centralized header config mapping per step
export const getHeaderConfig = (stepName: OnboardingStepName): HeaderConfig => {
  switch (stepName) {
    case "welcome":
    case "building_journey":
    case "lesson_complete":
    case "soft_paywall":
    case "welcome_to_happy":
      return { visible: false };
    case "journey_map":
      return {
        visible: true,
        trailingLabel: "YOUR COURSE",
        trailingLabelColor: "#7D8D7B",
        trailingLabelTracking: 0.6,
        trailingLabelAlignment: "end",
      };
    case "mascot_greeting":
      return { visible: true, showBackButton: true, progress: 0.15 };
    case "quiz_motivation":
      return { visible: true, showBackButton: true, progress: 0.18 };
    case "quiz_stress_level":
      return { visible: true, showBackButton: true, progress: 0.32 };
    case "daily_goal":
      return { visible: true, showBackButton: true, progress: 0.5 };
    case "plan_reveal":
      return {
        visible: true,
        showBackButton: true,
      };
    case "pact_signing":
      return { visible: true, showBackButton: true, progress: 0.6 };
    case "letter_from_future":
      return {
        visible: true,
        showBackButton: false,
        trailingLabel: "A QUIET MOMENT",
        trailingLabelColor: "#7D8D7B",
        trailingLabelTracking: 0.6,
        trailingLabelAlignment: "center",
      };
    case "notification_permission":
      return { visible: true, progress: 0.88 };
    default:
      return { visible: false };
  }
};

interface OnboardingHeaderProps {
  stepName: OnboardingStepName;
  backgroundColor: string;
  onBack: () => void;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  stepName,
  backgroundColor,
  onBack,
}) => {
  const headerConfig = getHeaderConfig(stepName);

  return (
    <Stack.Screen
      options={{
        headerShown: headerConfig.visible,
        headerShadowVisible: false,
        headerTransparent: true,
        header: () => (
          <SafeAreaView
            edges={["top"]}
            className="justify-end pb-4"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255, 255, 255, 0.1)",
              elevation: 0,
              shadowOpacity: 0,
              shadowRadius: 0,
              overflow: "hidden",
            }}
          >
            <GlassView
              glassEffectStyle="clear"
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor, opacity: 0.97 },
              ]}
            />
            <LessonHeader
              onClose={headerConfig.showBackButton ? onBack : undefined}
              backButtonVariant={
                headerConfig.backButtonVariant === "close"
                  ? "close-icon"
                  : "arrow"
              }
              progress={headerConfig.progress}
              trailingLabel={headerConfig.trailingLabel}
              iconColor={HEADER_ICON_COLOR}
              trailingLabelColor={headerConfig.trailingLabelColor ?? "#7D8D7B"}
              progressFillColor={headerConfig.progressFillColor}
              progressTrackColor={headerConfig.progressTrackColor}
            />
          </SafeAreaView>
        ),
      }}
    />
  );
};
