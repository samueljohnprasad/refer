import React from "react";
import { View } from "react-native";
import { Button } from "@/src/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { INK_SOFT } from "@/lib/tokens";

interface StepNavigationProps {
  /** Whether to show the back button */
  canGoBack: boolean;
  /** Whether the next/continue button is enabled */
  canGoNext: boolean;
  /** Handler for back press */
  onBack: () => void;
  /** Handler for next press */
  onNext: () => void;
  /** Custom label for the next button */
  nextLabel?: string;
  /** Whether to show a loading state on the next button */
  isLoading?: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = React.memo(
  ({
    canGoBack,
    canGoNext,
    onBack,
    onNext,
    nextLabel = "Continue",
    isLoading = false,
  }) => {
    const isEnabled: boolean = canGoNext && !isLoading;

    return (
      <View className="pt-4 pb-2 gap-3 w-full">
        {/* Premium 3D Haptic CTA continue button */}
        <Button
          label={nextLabel}
          onPress={onNext}
          disabled={!isEnabled}
          loading={isLoading}
          variant="primary"
          size="lg"
          fullWidth={true}
        />

        {/* Back button — beautifully resolved as a premium secondary ghost CTA */}
        {canGoBack && (
          <Button
            label="Back"
            onPress={onBack}
            variant="ghost"
            size="md"
            fullWidth={true}
            leftIcon={
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={18}
                color={INK_SOFT}
              />
            }
          />
        )}
      </View>
    );
  },
);

StepNavigation.displayName = "StepNavigation";
