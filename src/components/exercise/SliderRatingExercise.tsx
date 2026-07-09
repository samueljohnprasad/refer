import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import Slider from '@react-native-community/slider';

export const SliderRatingExercise = ({ payload, savedResponse, onInteraction }: any) => {
  const { prompt, min = 1, max = 5, labels = [] } = payload.content || {};
  
  // Default to middle value if no saved response
  const middle = Math.floor((min + max) / 2);
  const [value, setValue] = useState<number>(savedResponse?.rating ?? middle);

  useEffect(() => {
    // Slider always has a valid value, so it's always ready
    onInteraction({ rating: value }, true);
  }, []);

  const handleSlidingComplete = (val: number) => {
    setValue(val);
    onInteraction({ rating: val }, true);
  };

  const handleValueChange = (val: number) => {
    setValue(val);
  };

  // Get current label based on value (mapping value to labels array index)
  // assuming min is typically 1.
  const currentLabel = labels[value - min] || `Level ${value}`;

  return (
    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Rate your experience"}
        </Text>
      </View>

      {prompt && (
        <View className="flex-row items-start mb-12">
          <View className="mr-4 mt-2 z-10">
            <Mascot state="panda-happy" size={80} />
          </View>
          <View className="flex-1 pt-4 relative">
            <Text variant="body" color="ink" className="leading-relaxed text-lg font-medium">
              {prompt}
            </Text>
          </View>
        </View>
      )}

      <View className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm shadow-slate-100 mb-12">
        <Text className="text-center text-3xl font-bold text-sage-600 mb-2">
          {value}
        </Text>
        <Text className="text-center text-lg text-slate-500 font-medium mb-8">
          {currentLabel}
        </Text>

        <Slider
          style={{width: '100%', height: 40}}
          minimumValue={min}
          maximumValue={max}
          step={1}
          value={value}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor="#94a3b8"
          maximumTrackTintColor="#e2e8f0"
          thumbTintColor="#475569"
        />
        
        <View className="flex-row justify-between mt-2">
          <Text className="text-sm font-medium text-slate-400">{labels[0] || min}</Text>
          <Text className="text-sm font-medium text-slate-400">{labels[labels.length - 1] || max}</Text>
        </View>
      </View>
    </ScrollView>
  );
};
