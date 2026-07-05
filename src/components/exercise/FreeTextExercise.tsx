import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';

export const FreeTextExercise = ({ payload, savedResponse, onInteraction }: any) => {
  const { prompt, placeholder, min_words = 1, max_words = 100 } = payload.content || {};
  const [text, setText] = useState(savedResponse?.text || "");

  const wordCount = text.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
  const isReady = wordCount >= min_words && wordCount <= max_words;

  // We only want to trigger onInteraction when text actually changes
  // to avoid infinite loops, but we also want it to fire initially if there is a savedResponse
  useEffect(() => {
    if (savedResponse?.text) {
      onInteraction({ text: savedResponse.text }, isReady);
    }
  }, []);

  const handleChange = (newText: string) => {
    setText(newText);
    const newWordCount = newText.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
    const newIsReady = newWordCount >= min_words && newWordCount <= max_words;
    onInteraction({ text: newText }, newIsReady);
  };

  return (
    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Reflect"}
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

      <View className="bg-white border-2 border-slate-200 rounded-3xl p-4 mb-12 shadow-sm shadow-slate-100">
        <TextInput
          className="text-lg text-slate-800 leading-relaxed min-h-[160px]"
          multiline
          placeholder={placeholder || "Type your answer here..."}
          placeholderTextColor="#94a3b8"
          value={text}
          onChangeText={handleChange}
          style={{ textAlignVertical: 'top' }}
        />
        <View className="flex-row justify-end mt-2">
          <Text className={`text-sm font-medium ${wordCount < min_words || wordCount > max_words ? 'text-rose-500' : 'text-slate-400'}`}>
            {wordCount} / {max_words} words {min_words > 0 && `(min ${min_words})`}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
