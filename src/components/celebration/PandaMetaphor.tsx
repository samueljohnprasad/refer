import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue, interpolate, Extrapolation, runOnJS } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { CelebrationContext } from '../../types/celebration';

interface PandaMetaphorProps {
  progress: SharedValue<number>;
  animationKey: CelebrationContext['pandaAnimationKey'];
}

export function PandaMetaphor({ progress, animationKey }: PandaMetaphorProps) {
  const lottieRef = useRef<LottieView>(null);

  const playLottie = () => {
    lottieRef.current?.play();
  };

  const pandaStyle = useAnimatedStyle(() => {
    // ponytail: slightly more dramatic rise as requested in audit
    const translateY = interpolate(progress.value, [0, 0.5, 1], [40, -5, 0], Extrapolation.CLAMP);
    const opacity = interpolate(progress.value, [0, 0.2, 1], [0, 1, 1], Extrapolation.CLAMP);
    
    // Auto-play lottie when opacity hits 1
    if (opacity === 1) {
      runOnJS(playLottie)();
    }

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const getAnimationSource = () => {
    switch (animationKey) {
      case 'anxiety_relax': return require('../../../assets/lottie/panda/anxiety_relax.json');
      case 'thought_reframe': return require('../../../assets/lottie/panda/thought_reframe.json');
      case 'sleep_calm': return require('../../../assets/lottie/panda/sleep_calm.json');
      case 'generic_success': return require('../../../assets/lottie/panda/generic_success.json');
      default: return require('../../../assets/lottie/panda/generic_success.json');
    }
  };

  return (
    <Animated.View style={pandaStyle} className="items-center justify-center absolute w-full h-full">
      <LottieView
        ref={lottieRef}
        source={getAnimationSource()}
        style={{ width: '100%', height: '100%' }}
        autoPlay={false}
        loop={false}
        resizeMode="contain"
      />
    </Animated.View>
  );
}
