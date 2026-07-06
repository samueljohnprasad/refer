import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const MOODS = ['😫', '😕', '😐', '🙂', '🤩'];
const SLIDER_WIDTH = 280; // approximate width
const THUMB_SIZE = 28;

interface MoodSliderProps {
  value: number | null;
  onChange: (val: number) => void;
}

export const MoodSlider = ({ value, onChange }: MoodSliderProps) => {
  const translateX = useSharedValue(value !== null ? (value / 4) * SLIDER_WIDTH : SLIDER_WIDTH / 2);
  const startX = useSharedValue(0);

  useEffect(() => {
    if (value !== null) {
      translateX.value = withSpring((value / 4) * SLIDER_WIDTH, { damping: 20 });
    }
  }, [value]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      let nextX = startX.value + event.translationX;
      if (nextX < 0) nextX = 0;
      if (nextX > SLIDER_WIDTH) nextX = SLIDER_WIDTH;
      translateX.value = nextX;
    })
    .onEnd(() => {
      const step = SLIDER_WIDTH / 4;
      const snapIndex = Math.round(translateX.value / step);
      translateX.value = withSpring(snapIndex * step, { damping: 15, stiffness: 100 });
      runOnJS(onChange)(snapIndex);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="items-center w-full py-4">
      <View className="flex-row justify-between w-full mb-2 px-2">
        {MOODS.map((emoji, i) => (
          <Text key={i} className={`text-2xl ${value === i ? 'opacity-100 scale-125' : 'opacity-40'}`}>
            {emoji}
          </Text>
        ))}
      </View>
      <View style={{ width: SLIDER_WIDTH }} className="h-2 bg-slate-200 rounded-full justify-center">
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className="absolute bg-white border-2 border-sky-500 rounded-full shadow-sm"
            style={[
              { width: THUMB_SIZE, height: THUMB_SIZE, left: -THUMB_SIZE / 2 },
              thumbStyle
            ]}
          />
        </GestureDetector>
      </View>
    </View>
  );
};
