import React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

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
    nextLabel = 'Continue',
    isLoading = false,
  }) => {
    return (
      <View className="flex-row items-center gap-3 pt-4 pb-2">
        {/* Back button */}
        {canGoBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-12 w-12 rounded-2xl bg-slate-100 items-center justify-center active:bg-slate-200"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color="#64748B" />
          </Pressable>
        ) : (
          <View className="w-12" />
        )}

        {/* Next / Continue button */}
        <Pressable
          onPress={onNext}
          disabled={!canGoNext || isLoading}
          accessibilityRole="button"
          accessibilityLabel={nextLabel}
          className={`flex-1 h-12 rounded-2xl items-center justify-center flex-row ${
            canGoNext && !isLoading
              ? 'bg-blue-500 active:bg-blue-600'
              : 'bg-slate-200'
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text
                className={`text-base font-semibold mr-1 ${
                  canGoNext ? 'text-white' : 'text-slate-400'
                }`}
              >
                {nextLabel}
              </Text>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                color={canGoNext ? '#ffffff' : '#94A3B8'}
              />
            </>
          )}
        </Pressable>
      </View>
    );
  }
);

StepNavigation.displayName = 'StepNavigation';
