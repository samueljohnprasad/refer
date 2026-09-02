import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';

export function InteractiveReframeStagger({ path, onComplete }: { path: 'correct' | 'wrong', onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setStep(1), 600));
    timers.push(setTimeout(() => setStep(2), 1400));
    timers.push(setTimeout(() => {
      setStep(3);
      onComplete();
    }, 2400));
    return () => timers.forEach(clearTimeout);
  }, [path]);

  if (path === 'wrong') {
    return (
      <View className="items-center w-full mt-4">
        {step >= 1 && (
          <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full">
            <Text className="happy-font-body text-[16px] text-[#A74141] mb-2 opacity-50">↓</Text>
            <Text className="happy-font-body-bold text-[18px] text-[#A74141] mb-2 text-center uppercase tracking-[1px]">TRY HARDER</Text>
          </Animated.View>
        )}
        {step >= 2 && (
          <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full mt-2">
            <Text className="happy-font-body text-[16px] text-[#A74141] mb-2 opacity-50">↓</Text>
            <Text className="happy-font-body-bold text-[18px] text-[#A74141] text-center">more checking</Text>
          </Animated.View>
        )}
        {step >= 3 && (
          <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full mt-2">
            <Text className="happy-font-body text-[16px] text-[#A74141] mb-2 opacity-50">↓</Text>
            <Text className="happy-font-body-bold text-[18px] text-[#A74141] text-center">more pressure</Text>
          </Animated.View>
        )}
      </View>
    );
  }

  return (
    <View className="items-center w-full mt-4">
      {step >= 1 && (
        <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full">
          <Text className="happy-font-body text-[16px] text-[#29452A] mb-2 opacity-50">↓</Text>
          <Text className="happy-font-body-bold text-[18px] text-[#29452A] mb-2 text-center uppercase tracking-[1px]">WHAT CHANGED?</Text>
        </Animated.View>
      )}
      {step >= 2 && (
        <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full mt-2">
          <Text className="happy-font-body text-[16px] text-[#29452A] mb-2 opacity-50">↓</Text>
          <Text className="happy-font-body-bold text-[16px] text-[#29452A] text-center mb-2 leading-[26px]">
            nap? · timing? · stress?{"\n"}light? · routine?
          </Text>
        </Animated.View>
      )}
      {step >= 3 && (
        <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full mt-2">
          <Text className="happy-font-body text-[16px] text-[#29452A] mb-2 opacity-50">↓</Text>
          <Text className="happy-font-body-bold text-[18px] text-[#29452A] text-center">something I can investigate</Text>
        </Animated.View>
      )}
    </View>
  );
}
