import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';

const MOODS = ['😫', '😕', '😐', '🙂', '🤩'];

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
        <View className="mb-8 bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm shadow-slate-50">
          <Text className="text-slate-500 font-medium mb-3 text-center">How are you feeling before writing?</Text>
          <View className="flex-row justify-between px-2">
            {MOODS.map((emoji, i) => (
              <TouchableOpacity 
                key={i} 
                onPress={() => handleMoodBefore(i)} 
                className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
                  moodBefore === i ? 'border-sage-400 bg-sage-50' : 'border-transparent bg-slate-50'
                }`}
              >
                <Text className="text-2xl">{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {sub_prompts.length > 0 && (
        <View className="bg-sky-50 border-2 border-sky-100 rounded-3xl p-5 mb-6">
          <Text className="font-bold text-sky-800 mb-3 uppercase tracking-wider text-sm">
            Try to cover these points:
          </Text>
          {sub_prompts.map((sp: string, idx: number) => (
            <View key={idx} className="flex-row items-start mb-2 pr-4">
              <Text className="text-sky-600 font-bold mr-3 mt-1">•</Text>
              <Text className="text-sky-800 leading-relaxed font-medium">{sp}</Text>
            </View>
          ))}
        </View>
      )}

      <View className="bg-white border-2 border-slate-200 rounded-3xl p-4 mb-6 shadow-sm shadow-slate-100">
        <TextInput
          className="text-lg text-slate-800 leading-relaxed min-h-[160px]"
          multiline
          placeholder="Start writing here..."
          placeholderTextColor="#94a3b8"
          value={text}
          onChangeText={handleTextChange}
          style={{ textAlignVertical: 'top' }}
        />
        <View className="flex-row justify-end mt-2">
          <Text className={`text-sm font-medium ${wordCount < min_words || wordCount > max_words ? 'text-rose-500' : 'text-slate-400'}`}>
            {wordCount} / {max_words} words
          </Text>
        </View>
      </View>

      {mood_after && (
        <View className="mb-12 bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm shadow-slate-50">
          <Text className="text-slate-500 font-medium mb-3 text-center">How are you feeling now?</Text>
          <View className="flex-row justify-between px-2">
            {MOODS.map((emoji, i) => (
              <TouchableOpacity 
                key={i} 
                onPress={() => handleMoodAfter(i)} 
                className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
                  moodAfter === i ? 'border-sage-400 bg-sage-50' : 'border-transparent bg-slate-50'
                }`}
              >
                <Text className="text-2xl">{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      {(!mood_after) && <View className="h-12" />}
    </ScrollView>
  );
};
