import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';

export function ParadoxStagger({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setStep(1), 800));
    timers.push(setTimeout(() => setStep(2), 1600));
    timers.push(setTimeout(() => setStep(3), 2400));
    timers.push(setTimeout(() => setStep(4), 3200));
    timers.push(setTimeout(() => {
      setStep(5);
      onComplete();
    }, 4000));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <View className="items-center px-4 mt-6">
      {step >= 1 && (
        <Animated.Text entering={FadeInUp} layout={LinearTransition} className="happy-font-body-bold text-[16px] text-[#A74141] mb-2 text-center">
          “Am I asleep yet?”
        </Animated.Text>
      )}
      {step >= 2 && (
        <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center mb-2">
          <Text className="happy-font-body text-[14px] text-[#82796A] mb-2">↓</Text>
          <Text className="happy-font-body-bold text-[16px] text-[#A74141] text-center">
            “Why isn’t this working?”
          </Text>
        </Animated.View>
      )}
      {step >= 3 && (
        <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center mb-2">
          <Text className="happy-font-body text-[14px] text-[#82796A] mb-2">↓</Text>
          <Text className="happy-font-body-bold text-[16px] text-[#A74141] text-center">
            “I NEED to sleep.”
          </Text>
        </Animated.View>
      )}
      {step >= 4 && (
        <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center bg-[#F8F1E7] p-4 rounded-2xl w-full mt-4">
          <Text className="happy-font-heading-bold text-[13px] tracking-[1px] text-[#A74141] mb-2 uppercase">
            ↑ THE ALARM RISES
          </Text>
          <Text className="happy-font-body text-[15px] leading-[22px] text-[#3F3A34] text-center">
            Trying harder made you monitor sleep even more.
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
