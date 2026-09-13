import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { CelebrationContext } from '../../types/celebration';
import { useCelebrationTimeline } from '../../hooks/useCelebrationTimeline';
import { HappyRipple } from './HappyRipple';
import { PandaMetaphor } from './PandaMetaphor';
import { StreakIndicator } from './StreakIndicator';
import { Button } from '@/src/components/ui/Button';
import { SEMANTIC_COLORS } from '../../../src/theme/colors';

export interface CelebrationOverlayProps {
  isVisible: boolean;
  context: CelebrationContext;
  onContinue: () => void;
  onInteractionAvailable?: () => void;
}

export function CelebrationOverlay({
  isVisible,
  context,
  onContinue,
  onInteractionAvailable
}: CelebrationOverlayProps) {
  const [canInteract, setCanInteract] = useState(false);

  const timeline = useCelebrationTimeline(isVisible, context.type, () => {
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

  const eyebrowStyle = useAnimatedStyle(() => ({
    opacity: timeline.eyebrowOpacity.value,
    transform: [{ translateY: 10 * (1 - timeline.eyebrowOpacity.value) }],
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
    <Modal transparent visible={isVisible} animationType="none" statusBarTranslucent>
      <Animated.View 
        style={[StyleSheet.absoluteFill, overlayStyle, { backgroundColor: context.backgroundColor }]}
        className="flex-1 justify-between z-50"
      >
        <Pressable 
          style={StyleSheet.absoluteFill} 
          onPress={handlePress} 
          disabled={!canInteract}
        >
          <View className="flex-1 px-8 pt-12 pb-12 justify-between">
            
            {/* Top / Center - Panda */}
            <View className="flex-1 justify-center items-center mt-8">
              <View className="w-56 h-56 justify-center items-center relative">
                <HappyRipple 
                  progress={timeline.rippleScale} 
                  color={context.backgroundColor === '#1a2a1a' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(88, 204, 2, 0.15)'} 
                />
                <PandaMetaphor progress={timeline.pandaProgress} animationKey={context.pandaAnimationKey} />
              </View>
            </View>
            
            {/* Bottom - Content */}
            <View className="w-full">
              {context.eyebrowText && (
                <Animated.View style={eyebrowStyle} className="mb-3">
                  <Text className="font-nunito-800 text-sm text-center tracking-widest uppercase" style={{ color: SEMANTIC_COLORS.brand.primary }}>
                    {context.eyebrowText}
                  </Text>
                </Animated.View>
              )}
              
              <Animated.View style={textStyle} className="mb-4">
                <Text className="font-nunito-800 text-2xl text-center" style={{ color: SEMANTIC_COLORS.text.primary }}>
                  {context.primaryText}
                </Text>
              </Animated.View>

              <Animated.View style={secondaryTextStyle} className="mb-10">
                <Text className="font-nunito-600 text-lg text-center" style={{ color: SEMANTIC_COLORS.text.secondary }}>
                  {context.secondaryText}
                </Text>
                {context.type === 'lesson_streak' && (
                  <StreakIndicator />
                )}
              </Animated.View>

              <Animated.View style={buttonStyle} className="w-full">
                {/* ponytail: standard 3D tactile button */}
                <Button
                  label="Continue"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={handlePress}
                  disabled={!canInteract}
                />
              </Animated.View>
            </View>

          </View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}
