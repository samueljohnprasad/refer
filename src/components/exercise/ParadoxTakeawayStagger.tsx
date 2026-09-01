import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';

export function ParadoxTakeawayStagger({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setStep(1), 1000));
    timers.push(setTimeout(() => setStep(2), 2200));
    timers.push(setTimeout(() => {
      setStep(3);
      onComplete();
    }, 3000));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <View className="items-center px-4 mt-6">
      <Animated.Text entering={FadeInUp} layout={LinearTransition} className="happy-font-body-bold text-[16px] text-[#29452A] mb-1 text-center">
        The alarm didn't disappear.
      </Animated.Text>
      <Animated.Text entering={FadeInUp} layout={LinearTransition} className="happy-font-body text-[15px] text-[#3F3A34] text-center mb-6">
        But you stopped adding fuel to it.
      </Animated.Text>

      {step >= 1 && (
        <Animated.View entering={FadeInUp} layout={LinearTransition} className="w-full items-center">
          <View className="bg-[#D3E0CD] px-4 py-1.5 rounded-full mb-5">
            <Text className="happy-font-body-bold text-[11px] tracking-[1px] text-[#29452A] uppercase">
              ✓ You found the pattern
            </Text>
          </View>

          <View className="flex-row w-full justify-between mb-6">
            <View className="flex-1 mr-2 bg-[#F8F1E7] p-3 rounded-2xl">
              <Text className="happy-font-body-bold text-[11px] tracking-[0.5px] text-[#82796A] uppercase mb-2">
                Forcing
              </Text>
              <Text className="happy-font-body text-[14px] leading-[20px] text-[#3F3A34]">
                Try harder{"\n"}↓{"\n"}check if it's working{"\n"}↓{"\n"}more alarm
              </Text>
            </View>
            <View className="flex-1 ml-2 bg-[#E1EAD9] p-3 rounded-2xl">
              <Text className="happy-font-body-bold text-[11px] tracking-[0.5px] text-[#29452A] uppercase mb-2">
                Letting Go
              </Text>
              <Text className="happy-font-body text-[14px] leading-[20px] text-[#3F3A34]">
                Stop pushing{"\n"}↓{"\n"}less monitoring{"\n"}↓{"\n"}room to settle
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      {step >= 2 && (
        <Animated.View entering={FadeInUp} layout={LinearTransition} className="w-full bg-[#FDF9F5] p-4 rounded-2xl mb-4">
          <Text className="happy-font-body-bold text-[11px] tracking-[1px] text-[#82796A] uppercase mb-1">
            Remember This
          </Text>
          <Text className="happy-font-body text-[15px] leading-[22px] text-[#3F3A34]">
            Stopping the struggle isn't giving up.{"\n\n"}You don't have to force yourself calm. You can stop adding fuel and give your body room to settle.
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
