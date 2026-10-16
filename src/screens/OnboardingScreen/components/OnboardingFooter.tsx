import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { ScreenLayout } from "@/src/components/ui/ScreenLayout";
import { SymbolImage } from "@/src/components/symbol-image";
import TactileButton from "./TactileButton";
import { OnboardingStepConfig, OnboardingStepName } from "../types";

export type OnboardingButtonKey =
  | "buttons.setting_up"
  | "buttons.lets_begin"
  | "buttons.start_my_journey"
  | "buttons.set_reminders"
  | "buttons.save_my_progress"
  | "buttons.continue";

// ponytail: extracted footer component to keep OnboardingScreen < 300 lines
export const getStepButtonLabel = (
  step: OnboardingStepName,
  loading: boolean,
): OnboardingButtonKey => {
  if (loading) return "buttons.setting_up";
  switch (step) {
    case "welcome": return "buttons.lets_begin";
    case "plan_reveal": return "buttons.start_my_journey";
    case "notification_permission": return "buttons.set_reminders";
    case "welcome_to_happy": return "buttons.save_my_progress";
    default: return "buttons.continue";
  }
};

const WELCOME_FOOTER_BOTTOM_OFFSET = 20;

interface OnboardingFooterProps {
  currentStep: OnboardingStepName;
  currentStepConfig: OnboardingStepConfig;
  containerBackgroundColor: string;
  footerAnimatedStyle?: StyleProp<any>;
  isContinueDisabled: boolean;
  loading: boolean;
  onContinue: (skipped?: boolean) => void;
  onSkip: () => void;
}

export const OnboardingFooter: React.FC<OnboardingFooterProps> = React.memo(({
  currentStep,
  currentStepConfig,
  containerBackgroundColor,
  footerAnimatedStyle,
  isContinueDisabled,
  loading,
  onContinue,
  onSkip,
}) => {
  const { t } = useTranslation("onboarding");

  if (!currentStepConfig.showContinueButton) return null;

  return (
    <ScreenLayout.Footer
      pointerEvents="box-none"
      variant={currentStepConfig.transparentFooter ? "transparent" : "solid"}
      style={
        !currentStepConfig.transparentFooter
          ? { backgroundColor: containerBackgroundColor }
          : currentStep === "welcome_to_happy"
            ? { bottom: WELCOME_FOOTER_BOTTOM_OFFSET }
            : undefined
      }
    >
      <Animated.View
        style={footerAnimatedStyle}
        className="w-full gap-3"
      >
        <TactileButton
          label={t(getStepButtonLabel(currentStep, loading))}
          onPress={() => onContinue(false)}
          disabled={isContinueDisabled}
          rightIcon={currentStepConfig.name === "welcome" ? <SymbolImage name="arrow.up" size={18} tintColor="#FFFFFF" /> : undefined}
        />
        {currentStepConfig.canSkip && (
          <TactileButton
            label={t(currentStep === "welcome_to_happy" ? "buttons.maybe_later" : "buttons.skip_for_now")}
            onPress={onSkip}
            variant="secondary"
          />
        )}
      </Animated.View>
    </ScreenLayout.Footer>
  );
});
