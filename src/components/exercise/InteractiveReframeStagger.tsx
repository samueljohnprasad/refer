import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn, FadeOut, FadeInUp, LinearTransition } from 'react-native-reanimated';

export function InteractiveReframeStagger({ 
  path, 
  onComplete,
  content
}: { 
  path: 'correct' | 'wrong', 
  onComplete: () => void,
  content?: Record<string, any>
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    
    if (path === 'wrong') {
      timers.push(setTimeout(() => setStep(1), 400));
      timers.push(setTimeout(() => setStep(2), 1200));
      timers.push(setTimeout(() => setStep(3), 2000));
      timers.push(setTimeout(() => setStep(4), 2800));
      timers.push(setTimeout(() => {
        onComplete();
      }, 3200));
    } else {
      timers.push(setTimeout(() => setStep(1), 200));
      timers.push(setTimeout(() => setStep(2), 450));
      timers.push(setTimeout(() => setStep(3), 700));
      timers.push(setTimeout(() => setStep(4), 900));
      timers.push(setTimeout(() => setStep(5), 1100));
      timers.push(setTimeout(() => {
        onComplete();
      }, 1400));
    }
    
    return () => timers.forEach(clearTimeout);
  }, [path]);

  const correctOption = content?.correctOption || "What might have changed";
  const wrongCascade1 = content?.wrongCascade?.[0] || "TRY HARDER";
  const wrongCascade2 = content?.wrongCascade?.[1] || "“Is it working yet?”";
  const wrongCascade3 = content?.wrongCascade?.[2] || "more checking";
  const wrongCascade4 = content?.wrongCascade?.[3] || "more pressure";

  const correctHeroMorph = content?.correctHeroMorph || "“Something may have shifted.”";
  const correctCascade1 = content?.correctCascade?.[0] || "WHAT CHANGED?";
  const correctCascade2 = content?.correctCascade?.[1] || "timing · pressure · arousal";
  const correctCascade3 = content?.correctCascade?.[2] || "nap · light · stress · routine...";
  const correctCascade4 = content?.correctCascade?.[3] || "something I can investigate";

  if (path === 'wrong') {
    return (
      <View className="items-center w-full mt-4">
        {step >= 1 && (
          <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full mt-2">
            <Text className="happy-font-body text-[16px] text-[#A74141] mb-2 opacity-50">↓</Text>
            <Text className="happy-font-body-bold text-[18px] text-[#A74141] mb-2 text-center uppercase tracking-[1px]">{wrongCascade1}</Text>
          </Animated.View>
        )}
        {step >= 2 && (
          <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full mt-2">
            <Text className="happy-font-body text-[16px] text-[#A74141] mb-2 opacity-50">↓</Text>
            <Text className="happy-font-body-bold text-[18px] text-[#A74141] text-center">{wrongCascade2}</Text>
          </Animated.View>
        )}
        {step >= 3 && (
          <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full mt-2">
            <Text className="happy-font-body text-[16px] text-[#A74141] mb-2 opacity-50">↓</Text>
            <Text className="happy-font-body-bold text-[18px] text-[#A74141] text-center">{wrongCascade3}</Text>
          </Animated.View>
        )}
        {step >= 4 && (
          <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full mt-2">
            <Text className="happy-font-body text-[16px] text-[#A74141] mb-2 opacity-50">↓</Text>
            <Text className="happy-font-body-bold text-[18px] text-[#A74141] text-center">{wrongCascade4}</Text>
          </Animated.View>
        )}
      </View>
    );
  }

  // Correct path
  return (
    <View className="items-center w-full">
      {/* Morphing Hero Text */}
      {step === 0 && (
        <Animated.Text key="s0" entering={FadeIn} exiting={FadeOut} layout={LinearTransition} className="happy-font-heading-bold text-[24px] text-center text-[#29452A]">
          {correctOption}
        </Animated.Text>
      )}
      {step >= 1 && (
        <Animated.Text key="s1" entering={FadeIn} exiting={FadeOut} layout={LinearTransition} className="happy-font-heading-bold text-[24px] text-center text-[#29452A]">
          {correctHeroMorph}
        </Animated.Text>
      )}

      {/* The Cascade */}
      {step >= 2 && (
        <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full mt-4">
          <Text className="happy-font-body text-[16px] text-[#29452A] mb-2 opacity-50">↓</Text>
          <Text className="happy-font-body-bold text-[18px] text-[#29452A] mb-2 text-center uppercase tracking-[1px]">{correctCascade1}</Text>
        </Animated.View>
      )}
      {step >= 3 && (
        <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full mt-2">
          <Text className="happy-font-body text-[16px] text-[#29452A] mb-2 opacity-50">↓</Text>
          <Text className="happy-font-body-bold text-[16px] text-[#29452A] text-center mb-1 leading-[24px]">
            {correctCascade2}
          </Text>
        </Animated.View>
      )}
      {step >= 4 && (
        <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full">
          <Text className="happy-font-body text-[14px] text-[#29452A] text-center mb-2 opacity-70 leading-[24px]">
            {correctCascade3}
          </Text>
        </Animated.View>
      )}
      {step >= 5 && (
        <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center w-full mt-2">
          <Text className="happy-font-body text-[16px] text-[#29452A] mb-2 opacity-50">↓</Text>
          <Text className="happy-font-body-bold text-[18px] text-[#29452A] text-center">{correctCascade4}</Text>
        </Animated.View>
      )}
    </View>
  );
}
