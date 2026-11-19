// ponytail: exact S Home scene/header matching .agents/home.html's <section class="scene"> + header.top —
// scene art background, Happi (scene viewBox) with a speech bubble, header icon row + weekly progress chip.
import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';
import { HappiStage } from '@/src/domains/onboarding/ui/presentation/components/HappiStage';
import { useHappiGuideMotion } from '@/src/domains/onboarding/ui/containers/useHappiGuideMotion';
import type { ActingPose } from '@/src/domains/onboarding/ui/containers/happiPoses';
import { sayIn } from '@/src/domains/onboarding/ui/presentation/animations';
import { SceneArtSvg } from '../components/SceneArtSvg';
import { ProgressRing } from '../components/ProgressRing';
import { WEEKLY_GOAL } from '@/src/domains/home/data/reflectionsStorage';

export interface HomeSceneHeaderProps {
  night: boolean;
  pose: ActingPose;
  say: string;
  lifetimeCount: number;
  weeklyCount: number;
  onHelpPress: () => void;
  onAccountPress: () => void;
}

export function HomeSceneHeader({
  night, pose, say, lifetimeCount, weeklyCount,
  onHelpPress, onAccountPress,
}: HomeSceneHeaderProps): React.JSX.Element {
  const motion = useHappiGuideMotion();

  useEffect(() => {
    motion.setPose(pose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pose]);

  const iconColor = night ? '#ffffff' : '#44633f';

  return (
    <View className="relative h-[380px] overflow-hidden">
      <SceneArtSvg night={night} />

      <View className="absolute inset-x-0 top-0 px-4 pt-3 pb-3 flex-row items-center justify-between">
        <Text
          className="text-t-lead font-bold tracking-tight text-happy-label"
          style={night ? { color: '#ffffff' } : undefined}
        >
          Home
        </Text>

        <View className="flex-row items-center gap-1">
          {lifetimeCount > 0 && (
            <View className="flex-row items-center gap-1.5 h-8 px-3 mr-1 rounded-pill bg-happy-tint">
              <ProgressRing value={weeklyCount} goal={WEEKLY_GOAL} size={18} />
              <Text className="text-t-foot font-bold text-happy-accent">{lifetimeCount}</Text>
            </View>
          )}
          <Pressable
            onPress={onHelpPress}
            accessibilityRole="button"
            accessibilityLabel="Need to talk to someone?"
            className="w-11 h-11 items-center justify-center rounded-full active:bg-happy-tint"
          >
            <SymbolView name="questionmark.circle" size={20} tintColor={iconColor} />
          </Pressable>
          <Pressable
            onPress={onAccountPress}
            accessibilityRole="button"
            accessibilityLabel="Account"
            className="w-11 h-11 items-center justify-center rounded-full active:bg-happy-tint"
          >
            <SymbolView name="person.circle" size={20} tintColor={iconColor} />
          </Pressable>
        </View>
      </View>

      <View className="absolute left-1/2 bottom-[38px] -translate-x-[58%] h-[64%] aspect-[220/246]">
        <HappiStage motion={motion} size="scene" width={220} />
      </View>

      <Animated.View
        key={say}
        entering={sayIn(900)}
        className="absolute right-4 top-[27%] max-w-[148px] px-3.5 py-2.5 rounded-2xl bg-white border-2 border-black/[0.08] border-b-4"
      >
        <Text className="font-display font-semibold text-t-sub leading-tight text-happy-label">
          {say}
        </Text>
      </Animated.View>
    </View>
  );
}
