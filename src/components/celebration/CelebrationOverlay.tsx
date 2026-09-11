import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { CelebrationOverlayProps } from '../../types/celebration';
import { useCelebrationTimeline } from '../../hooks/useCelebrationTimeline';
import { HappyRipple } from './HappyRipple';
import { PandaMetaphor } from './PandaMetaphor';
import { StreakIndicator } from './StreakIndicator';

export function CelebrationOverlay({
  isVisible,
  context,
  onContinue,
  onInteractionAvailable
}: CelebrationOverlayProps) {
  const [canInteract, setCanInteract] = useState(false);

  const timeline = useCelebrationTimeline(isVisible, context.level, () => {
    setCanInteract(true);
    if (onInteractionAvailable) onInteractionAvailable();
  });

  useEffect(() => {
    if (!isVisible) {
      setCanInteract(false);
    }
  }, [isVisible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: timeline.overlayOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: timeline.textOpacity.value,
    transform: [{ translateY: 10 * (1 - timeline.textOpacity.value) }],
  }));

  const secondaryTextStyle = useAnimatedStyle(() => ({
    opacity: timeline.secondaryTextOpacity.value,
    transform: [{ translateY: 10 * (1 - timeline.secondaryTextOpacity.value) }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: timeline.buttonOpacity.value,
    transform: [{ scale: 0.95 + 0.05 * timeline.buttonOpacity.value }],
  }));

  const handlePress = () => {
    if (canInteract) {
      onContinue();
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View 
      style={[StyleSheet.absoluteFill, overlayStyle, { backgroundColor: context.backgroundColor }]}
      className="flex-1 justify-center items-center z-50"
    >
      <Pressable 
        style={StyleSheet.absoluteFill} 
        onPress={handlePress} 
        disabled={!canInteract}
      >
        <View className="flex-1 justify-center items-center px-6">
          
          <View className="w-64 h-64 justify-center items-center mb-8 relative">
            <HappyRipple progress={timeline.rippleScale} color="rgba(255, 255, 255, 0.4)" />
            <PandaMetaphor progress={timeline.pandaProgress} animationKey={context.pandaAnimationKey} />
          </View>
          
          <Animated.View style={textStyle} className="mb-2">
            <Text className="font-nunito-800 text-3xl text-center text-slate-800">
              {context.primaryText}
            </Text>
          </Animated.View>

          <Animated.View style={secondaryTextStyle} className="mb-12">
            <Text className="font-nunito-600 text-lg text-slate-500 text-center">
              {context.secondaryText}
            </Text>
            {context.level === 2 && (
              <StreakIndicator />
            )}
          </Animated.View>

          <Animated.View style={buttonStyle} className="w-full">
            <Pressable 
              onPress={handlePress}
              className="bg-slate-900 py-4 rounded-2xl items-center w-full shadow-sm"
              disabled={!canInteract}
            >
              <Text className="font-nunito-700 text-white text-lg">Continue</Text>
            </Pressable>
          </Animated.View>

        </View>
      </Pressable>
    </Animated.View>
  );
}
