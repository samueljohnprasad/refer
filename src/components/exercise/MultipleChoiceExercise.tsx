import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { OrganicSpeechTail } from '@/src/components/ui/OrganicSpeechTail';
import { BRAND_SURFACE, BRAND_BORDER_STRONG, INK_SOFT, OTTER_BLUE_TINT, OTTER_BLUE } from '@/lib/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OptionButton = ({ label, isSelected, onPress }: { label: string; isSelected: boolean; onPress: () => void }) => {
  const pressY = useSharedValue(0);
  
  const faceColor = isSelected ? OTTER_BLUE_TINT : BRAND_SURFACE;
  const rimColor = isSelected ? OTTER_BLUE : BRAND_BORDER_STRONG;
  const labelColor = isSelected ? '#0A7DB8' : INK_SOFT;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pressY.value = withTiming(4, { duration: 20 });
  };

  const handlePressOut = () => {
    pressY.value = withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressY.value }],
  }));

  return (
    <View className="w-full relative mb-1">
      {/* Rim (Shadow Base) */}
      <View
        className="absolute left-0 right-0 top-[4px] bottom-[-4px] rounded-2xl"
        style={{ backgroundColor: rimColor }}
      />
      
      {/* 3D Face */}
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        className="rounded-2xl px-5 py-4 border-2 flex-row justify-center items-center"
        style={[
          {
            backgroundColor: faceColor,
            borderColor: rimColor,
            minHeight: 56,
          },
          animatedStyle
        ]}
      >
        <Text
          className="text-center"
          style={{ 
            fontSize: 16, 
            color: labelColor, 
            fontFamily: "GeistBold",
            letterSpacing: 0.16 
          }}
        >
          {label}
        </Text>
      </AnimatedPressable>
    </View>
  );
};

export const MultipleChoiceExercise = ({ payload, onInteraction }: any) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (option: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setSelectedId(option.id);
    onInteraction({
      optionId: option.id,
      isCorrect: option.correct === true,
      text: option.text,
    });
  };

  const { prompt, subPrompt, options } = payload.content || {};

  return (
    <ScrollView 
      className="flex-1 p-6"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Read and respond"}
        </Text>
      </View>

      {/* Premium Speech Bubble Layout */}
      <View className="flex-row items-start mb-8">
        <View className="mr-4 mt-2 z-10">
          <Mascot state="panda-happy" size={76} />
        </View>
        <View className="flex-1 bg-white rounded-3xl p-6 border-2 border-brand-border/60 shadow-sm relative">
          <OrganicSpeechTail />
          
          <Text variant="body" color="ink" className="leading-[32px] text-[17px] font-medium tracking-wide">
            {prompt}
          </Text>
        </View>
      </View>

      {subPrompt && (
        <Text className="text-slate-500 font-bold text-lg mb-5 tracking-wide">
          {subPrompt}
        </Text>
      )}

      {/* Options Stack */}
      <View className="gap-3 pb-12">
        {options?.map((opt: any) => {
          const isSelected = selectedId === opt.id;
          return (
            <OptionButton
              key={opt.id}
              label={opt.text}
              isSelected={isSelected}
              onPress={() => handleSelect(opt)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};
