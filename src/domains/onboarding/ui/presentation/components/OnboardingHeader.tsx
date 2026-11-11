// ponytail: exact OnboardingHeader matching .agents/onboarding.html with Duolingo sheen bar
import React from 'react';
import { View, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

export interface OnboardingHeaderProps {
  showBack: boolean;
  showProgress: boolean;
  progressFill: number;
  onBack: () => void;
}

export function OnboardingHeader({
  showBack,
  showProgress,
  progressFill,
  onBack,
}: OnboardingHeaderProps): React.JSX.Element {
  return (
    <View className="flex-row items-center gap-3 px-3 pt-2 min-h-[52px]">
      {showBack ? (
        <Pressable
          onPress={onBack}
          className="w-11 h-11 items-center justify-center rounded-pill active:scale-95"
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ChevronLeft size={22} color="#142414" strokeWidth={2.5} />
        </Pressable>
      ) : (
        <View className="w-11" />
      )}

      {showProgress ? (
        <View className="flex-1 h-[14px] bg-happy-sep rounded-pill overflow-hidden relative justify-center">
          <View
            className="h-full bg-happy-accent rounded-pill relative"
            style={{ width: `${Math.max(10, Math.min(100, progressFill * 100))}%` }}
          >
            {/* Duolingo glossy sheen strip */}
            <View className="absolute left-[7px] right-[7px] top-[3px] h-[3px] rounded-[2px] bg-white/30" />
          </View>
        </View>
      ) : (
        <View className="flex-1" />
      )}

      {/* Spacer to keep bar centered */}
      <View className="w-11" />
    </View>
  );
}
