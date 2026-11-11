// ponytail: exact S0 Hello view matching .agents/onboarding.html and happy-ui tokens
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { HappiGuideStage } from '../components/HappiGuideStage';

export interface HelloStepViewProps {
  guideStage?: React.ReactNode;
  onHiPress: () => void;
  onWhoPress: () => void;
  onSignInPress: () => void;
}

export function HelloStepView({
  guideStage,
  onHiPress,
  onWhoPress,
  onSignInPress,
}: HelloStepViewProps): React.JSX.Element {
  return (
    <View className="flex-1 justify-between px-6 pb-6 pt-10">
      <View className="items-center text-center">
        {/* Happi speech bubble */}
        <View className="relative bg-happy-surface border border-happy-rim rounded-2xl px-3.5 py-2 mb-2 shadow-xs">
          <Text className="text-t-sub font-semibold text-happy-label">Hi, I’m Happi.</Text>
          <View className="absolute left-1/2 -ml-1.5 -bottom-1.5 w-3 h-3 bg-happy-surface border-r border-b border-happy-rim rotate-45" />
        </View>

        {/* Hero Character */}
        <View className="w-[220px] h-[220px] items-center justify-center my-2">
          {guideStage ?? <HappiGuideStage weather={0.2} size="hero" />}
        </View>

        {/* Headings: Fredoka display for one title per screen */}
        <Text className="text-t-title font-semibold font-display text-happy-label text-center leading-tight mt-2">
          One thought at a time.
        </Text>
        <Text className="text-t-lead font-medium text-happy-label-2 text-center mt-2">
          Two minutes. No sign-up.
        </Text>
        <Text className="text-t-foot font-normal text-happy-label-2 text-center max-w-[280px] mt-3 leading-relaxed">
          Happy helps you practise CBT skills. It isn’t therapy and doesn’t replace professional care.
        </Text>
      </View>

      {/* Buttons matching Duolingo chunky rim */}
      <View className="w-full gap-2.5">
        <Pressable
          onPress={onHiPress}
          className="w-full min-h-[56px] bg-happy-ink rounded-pill items-center justify-center shadow-[0_4px_0_var(--color-happy-accent)] active:translate-y-1 active:shadow-[0_1px_0_var(--color-happy-accent)]"
          accessibilityRole="button"
        >
          <Text className="text-white text-t-body font-bold">Hi, Happi</Text>
        </Pressable>

        <Pressable onPress={onWhoPress} className="items-center py-2 min-h-[44px] justify-center">
          <Text className="text-t-foot font-bold text-happy-label-3 underline">
            Who is Happi?
          </Text>
        </Pressable>

        <Pressable onPress={onSignInPress} className="items-center py-1 min-h-[44px] justify-center">
          <Text className="text-t-foot font-bold text-happy-label-3 underline">
            I already have an account
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
