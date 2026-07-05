import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { Card } from '@/src/components/ui/Card';

export const RatingCheckExercise = ({ payload, savedResponse, onInteraction }: any) => {
  const { prompt, scale = 5, labels = [], note_enabled } = payload.content || {};
  const [selectedIndex, setSelectedIndex] = useState<number | null>(savedResponse?.rating ?? null);
  const [note, setNote] = useState(savedResponse?.note || "");

  // Generate an array [1, 2, ..., scale]
  const scaleOptions = Array.from({ length: scale }, (_, i) => i + 1);

  // We are ready to continue as soon as a rating is selected.
  // The note is optional.
  useEffect(() => {
    if (savedResponse?.rating !== undefined) {
      onInteraction(savedResponse, true);
    }
  }, []);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onInteraction({ rating: index, note }, true);
  };

  const handleNoteChange = (text: string) => {
    setNote(text);
    if (selectedIndex !== null) {
      onInteraction({ rating: selectedIndex, note: text }, true);
    }
  };

  return (
    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Check In"}
        </Text>
      </View>

      {prompt && (
        <View className="flex-row items-start mb-8">
          <View className="mr-4 mt-2 z-10">
            <Mascot state="panda-happy" size={80} />
          </View>
          <View className="flex-1 bg-white rounded-3xl p-6 border-2 border-slate-200 relative">
            <View 
              className="absolute -left-3 top-10 w-5 h-5 bg-white border-l-2 border-b-2 border-slate-200" 
              style={{ transform: [{ rotate: '45deg' }] }} 
            />
            <Text variant="body" color="ink" className="leading-relaxed text-lg font-medium">
              {prompt}
            </Text>
          </View>
        </View>
      )}

      <View className="gap-4 mb-8">
        {scaleOptions.map((value, idx) => {
          const isSelected = selectedIndex === value;
          const labelText = labels[idx] ? labels[idx] : `Level ${value}`;
          
          return (
            <Card
              key={value}
              variant={isSelected ? 'answer-selected' : 'answer'}
              onPress={() => handleSelect(value)}
              contentClassName="items-center justify-center p-4"
            >
              <Text className={`text-lg font-medium ${isSelected ? 'text-sage-700' : 'text-slate-600'}`}>
                {labelText}
              </Text>
            </Card>
          );
        })}
      </View>

      {note_enabled && (
        <View className="mb-12">
          <Text className="text-slate-500 font-medium mb-3 ml-2 text-sm uppercase tracking-wider">
            Add a note (optional)
          </Text>
          <View className="bg-white border-2 border-slate-200 rounded-3xl p-4 shadow-sm shadow-slate-100">
            <TextInput
              className="text-lg text-slate-800 leading-relaxed min-h-[100px]"
              multiline
              placeholder="How are you feeling?"
              placeholderTextColor="#94a3b8"
              value={note}
              onChangeText={handleNoteChange}
              style={{ textAlignVertical: 'top' }}
            />
          </View>
        </View>
      )}
      
      {!note_enabled && <View className="h-12" />}
    </ScrollView>
  );
};
