# Guided Reflection UI Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Guided Reflection screen UI by introducing a custom `MoodSlider` component, modernizing the "Try to cover" card, and polishing the text area.

**Architecture:** A new reusable `MoodSlider` component will be created using `react-native-reanimated` and `react-native-gesture-handler` for smooth drag interactions. The `GuidedResponseExercise` will be refactored to consume it and apply updated Tailwind styling for the prompts and text input.

**Tech Stack:** React Native, Expo, NativeWind (Tailwind), React Native Reanimated, React Native Gesture Handler

## Global Constraints

- Use Tailwind CSS (`className`) for styles.
- Use TypeScript strictly; avoid `any`.
- Keep the component interface compatible with existing payloads (`moodBefore`, `moodAfter`, `text`).

---

### Task 1: Create MoodSlider Component

**Files:**
- Create: `src/components/ui/MoodSlider.tsx`

**Interfaces:**
- Consumes: `react-native-reanimated`, `react-native-gesture-handler`
- Produces: `MoodSlider` component with props `{ value: number | null, onChange: (val: number) => void }`

- [ ] **Step 1: Write the component implementation**

```tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler, runOnJS } from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const MOODS = ['😫', '😕', '😐', '🙂', '🤩'];
const SLIDER_WIDTH = 280; // approximate width
const THUMB_SIZE = 28;

interface MoodSliderProps {
  value: number | null;
  onChange: (val: number) => void;
}

export const MoodSlider = ({ value, onChange }: MoodSliderProps) => {
  const translateX = useSharedValue(value !== null ? (value / 4) * SLIDER_WIDTH : SLIDER_WIDTH / 2);

  useEffect(() => {
    if (value !== null) {
      translateX.value = withSpring((value / 4) * SLIDER_WIDTH, { damping: 20 });
    }
  }, [value]);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number }>({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      let nextX = ctx.startX + event.translationX;
      if (nextX < 0) nextX = 0;
      if (nextX > SLIDER_WIDTH) nextX = SLIDER_WIDTH;
      translateX.value = nextX;
    },
    onEnd: () => {
      const step = SLIDER_WIDTH / 4;
      const snapIndex = Math.round(translateX.value / step);
      translateX.value = withSpring(snapIndex * step, { damping: 15, stiffness: 100 });
      runOnJS(onChange)(snapIndex);
    },
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
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            className="absolute bg-white border-2 border-sky-500 rounded-full shadow-sm"
            style={[
              { width: THUMB_SIZE, height: THUMB_SIZE, left: -THUMB_SIZE / 2 },
              thumbStyle
            ]}
          />
        </PanGestureHandler>
      </View>
    </View>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/MoodSlider.tsx
git commit -m "feat: add MoodSlider component"
```

### Task 2: Refactor GuidedResponseExercise

**Files:**
- Modify: `src/components/exercise/GuidedResponseExercise.tsx`

**Interfaces:**
- Consumes: `MoodSlider` from Task 1

- [ ] **Step 1: Replace discrete emoji buttons with MoodSlider and update styling**

Update `src/components/exercise/GuidedResponseExercise.tsx` to import and use `MoodSlider`. Update the sub_prompts card and text area.

```tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { MoodSlider } from '@/src/components/ui/MoodSlider';

export const GuidedResponseExercise = ({ payload, savedResponse, onInteraction }: any) => {
  const { 
    prompt, 
    sub_prompts = [], 
    min_words = 1, 
    max_words = 200,
    mood_before,
    mood_after
  } = payload.content || {};

  const [text, setText] = useState(savedResponse?.text || "");
  const [moodBefore, setMoodBefore] = useState<number | null>(savedResponse?.moodBefore ?? null);
  const [moodAfter, setMoodAfter] = useState<number | null>(savedResponse?.moodAfter ?? null);
  const [isFocused, setIsFocused] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
  
  const isReady = () => {
    if (wordCount < min_words || wordCount > max_words) return false;
    if (mood_before && moodBefore === null) return false;
    if (mood_after && moodAfter === null) return false;
    return true;
  };

  useEffect(() => {
    if (savedResponse) {
      onInteraction(savedResponse, isReady());
    }
  }, []);

  const triggerUpdate = (newText: string, newMB: number | null, newMA: number | null) => {
    const newWordCount = newText.trim().split(/\s+/).filter(w => w.length > 0).length;
    const ready = newWordCount >= min_words && newWordCount <= max_words &&
                  (!mood_before || newMB !== null) &&
                  (!mood_after || newMA !== null);
    
    onInteraction({ text: newText, moodBefore: newMB, moodAfter: newMA }, ready);
  };

  const handleTextChange = (val: string) => {
    setText(val);
    triggerUpdate(val, moodBefore, moodAfter);
  };

  const handleMoodBefore = (val: number) => {
    setMoodBefore(val);
    triggerUpdate(text, val, moodAfter);
  };

  const handleMoodAfter = (val: number) => {
    setMoodAfter(val);
    triggerUpdate(text, moodBefore, val);
  };

  return (
    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Guided Reflection"}
        </Text>
      </View>

      {prompt && (
        <View className="flex-row items-start mb-8">
          <View className="mr-4 mt-2 z-10">
            <Mascot state="panda-happy" size={80} />
          </View>
          <View className="flex-1 bg-white rounded-3xl p-6 border-2 border-slate-200 relative">
            <View 
              className="absolute -left-3 top-10 w-5 h-5 bg-white border-l-2 border-b-2 border-slate-200 rounded-bl-[4px]" 
              style={{ transform: [{ rotate: '45deg' }] }} 
            />
            <Text variant="body" color="ink" className="leading-relaxed text-lg font-medium">
              {prompt}
            </Text>
          </View>
        </View>
      )}

      {mood_before && (
        <View className="mb-8 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm shadow-slate-50 items-center">
          <Text className="text-slate-500 font-bold mb-4 text-xs uppercase tracking-wider text-center">How are you feeling before writing?</Text>
          <MoodSlider value={moodBefore} onChange={handleMoodBefore} />
        </View>
      )}

      {sub_prompts.length > 0 && (
        <View className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-6 shadow-sm shadow-slate-50">
          <Text className="font-bold text-slate-500 mb-4 uppercase tracking-wider text-xs">
            Try to cover these points:
          </Text>
          {sub_prompts.map((sp: string, idx: number) => (
            <View key={idx} className="flex-row items-start mb-3 pr-4">
              <View className="w-5 h-5 rounded-full bg-sky-100 items-center justify-center mr-3 mt-0.5">
                <Text className="text-sky-600 font-bold text-xs">✓</Text>
              </View>
              <Text className="text-slate-700 leading-relaxed font-medium flex-1">{sp}</Text>
            </View>
          ))}
        </View>
      )}

      <View className={`bg-white border-2 rounded-3xl p-5 mb-6 ${isFocused ? 'border-sky-500 shadow-md shadow-sky-100' : 'border-slate-200 shadow-sm shadow-slate-100'}`}>
        <TextInput
          className="text-lg text-slate-800 leading-relaxed min-h-[160px]"
          multiline
          placeholder="Start writing here..."
          placeholderTextColor="#94a3b8"
          value={text}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ textAlignVertical: 'top' }}
        />
        <View className="flex-row justify-end mt-4">
          <View className={`px-3 py-1 rounded-full ${wordCount < min_words || wordCount > max_words ? 'bg-rose-100' : 'bg-slate-100'}`}>
            <Text className={`text-xs font-bold ${wordCount < min_words || wordCount > max_words ? 'text-rose-600' : 'text-slate-500'}`}>
              {wordCount} / {max_words} words
            </Text>
          </View>
        </View>
      </View>

      {mood_after && (
        <View className="mb-12 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm shadow-slate-50 items-center">
          <Text className="text-slate-500 font-bold mb-4 text-xs uppercase tracking-wider text-center">How are you feeling now?</Text>
          <MoodSlider value={moodAfter} onChange={handleMoodAfter} />
        </View>
      )}
      
      {(!mood_after) && <View className="h-12" />}
    </ScrollView>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/exercise/GuidedResponseExercise.tsx
git commit -m "feat: upgrade GuidedResponseExercise UI"
```
