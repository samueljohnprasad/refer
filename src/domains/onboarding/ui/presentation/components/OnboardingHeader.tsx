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
    <View className="flex-row items-center gap-3 px-3 pt-1 min-h-[48px]">
      {showBack ? (
        <Pressable
          onPress={onBack}
          className="w-10 h-10 items-center justify-center rounded-pill active:scale-95"
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ChevronLeft size={22} color="#142414" strokeWidth={2.5} />
        </Pressable>
      ) : (
        <View className="w-10" />
      )}

      {showProgress ? (
        <View className="flex-1 h-[12px] bg-happy-sep rounded-pill overflow-hidden relative justify-center">
          <View
            className="h-full bg-happy-accent rounded-pill relative"
            style={{ width: `${Math.max(10, Math.min(100, progressFill * 100))}%` }}
          >
            {/* Duolingo glossy sheen strip */}
            <View className="absolute left-[5px] right-[5px] top-[2.5px] h-[2.5px] rounded-[1.5px] bg-white/35" />
          </View>
        </View>
      ) : (
        <View className="flex-1" />
      )}

      {/* Spacer to keep bar centered */}
      <View className="w-10" />
    </View>
  );
}
