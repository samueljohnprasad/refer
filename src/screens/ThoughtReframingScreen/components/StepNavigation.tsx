import React from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

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
  /** Accent color for the CTA. Defaults to Duolingo-green. */
  accentColor?: string;
}

const DISABLED_BG = "#E2E8F0";
const DISABLED_TEXT = "#94A3B8";

export const StepNavigation: React.FC<StepNavigationProps> = React.memo(
  ({
    canGoBack,
    canGoNext,
    onBack,
    onNext,
    nextLabel = "Continue",
    isLoading = false,
    accentColor = "#58CC02",
  }) => {
    const isEnabled: boolean = canGoNext && !isLoading;

    return (
      <View className="pt-4 pb-2 gap-3">
        {/* ── Big bold Duolingo-style CTA ── */}
        <Pressable
          onPress={onNext}
          disabled={!isEnabled}
          accessibilityRole="button"
          accessibilityLabel={nextLabel}
          className="h-14 rounded-2xl items-center justify-center active:opacity-90"
          style={{
            backgroundColor: isEnabled ? accentColor : DISABLED_BG,
            shadowColor: isEnabled ? accentColor : "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isEnabled ? 0.3 : 0,
            shadowRadius: 0,
            elevation: isEnabled ? 4 : 0,
          }}
        >
          {isLoading ? (
            <ActivityIndicator
              color="#fff"
              size="small"
            />
          ) : (
            <Text
              className="text-base font-extrabold uppercase tracking-wider"
              style={{ color: isEnabled ? "#FFFFFF" : DISABLED_TEXT }}
            >
              {nextLabel}
            </Text>
          )}
        </Pressable>

        {/* ── Back button — secondary, below the CTA ── */}
        {canGoBack && (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-11 rounded-2xl items-center justify-center flex-row active:bg-slate-100"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={18}
              color="#94A3B8"
            />
            <Text className="text-sm font-bold text-slate-400 ml-1.5">
              Back
            </Text>
          </Pressable>
        )}
      </View>
    );
  },
);

StepNavigation.displayName = "StepNavigation";
