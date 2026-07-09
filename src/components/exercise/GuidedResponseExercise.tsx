import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { MoodSlider } from '@/src/components/ui/MoodSlider';
import { GuidedResponsePayload } from '../../../types/exercises';

interface GuidedResponseState {
  text: string;
  moodBefore: number | null;
  moodAfter: number | null;
}

interface GuidedResponseExerciseProps {
  payload: GuidedResponsePayload & { title?: string };
  savedResponse?: GuidedResponseState;
  onInteraction: (response: GuidedResponseState, isReady: boolean) => void;
}

export const GuidedResponseExercise: React.FC<GuidedResponseExerciseProps> = ({ 
  payload, 
  savedResponse, 
  onInteraction 
}) => {
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
          <View className="flex-1 pt-4 relative">
            <Text variant="body" color="ink" className="leading-relaxed text-lg font-medium">
              {prompt}
            </Text>
          </View>
        </View>
      )}

      {mood_before && (
        <View className="mb-8 bg-white p-6 rounded-xl border border-slate-100 shadow-sm shadow-slate-50 items-center">
          <Text className="text-slate-500 font-bold mb-4 text-xs uppercase tracking-wider text-center">How are you feeling before writing?</Text>
          <MoodSlider value={moodBefore} onChange={handleMoodBefore} />
        </View>
      )}

      {sub_prompts.length > 0 && (
        <View className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm shadow-slate-50">
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

      <View className={`bg-white border rounded-xl p-5 mb-6 ${isFocused ? 'border-sky-500 shadow-md shadow-sky-100' : 'border-slate-200 shadow-sm shadow-slate-100'}`}>
        <TextInput
          className="text-lg text-slate-800 leading-relaxed min-h-[160px]"
          multiline
          placeholder="Start writing here..."
          placeholderTextColor="#475569"
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
        <View className="mb-12 bg-white p-6 rounded-xl border border-slate-100 shadow-sm shadow-slate-50 items-center">
          <Text className="text-slate-500 font-bold mb-4 text-xs uppercase tracking-wider text-center">How are you feeling now?</Text>
          <MoodSlider value={moodAfter} onChange={handleMoodAfter} />
        </View>
      )}
      
      {(!mood_after) && <View className="h-12" />}
    </ScrollView>
  );
};
