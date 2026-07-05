import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { Card } from '@/src/components/ui/Card';

export const OrderingExercise = ({ payload, savedResponse, onInteraction }: any) => {
  const { prompt, items = [], correct_order = [] } = payload.content || {};
  
  // Shuffle items once on mount so they aren't in the correct order by default
  const [shuffledItems] = useState(() => {
    return [...items].sort(() => Math.random() - 0.5);
  });

  const [selectedIds, setSelectedIds] = useState<number[]>(savedResponse?.selected_order || []);

  useEffect(() => {
    if (savedResponse?.selected_order) {
      const isReady = savedResponse.selected_order.length === items.length;
      onInteraction(savedResponse, isReady);
    }
  }, []);

  const handleSelect = (itemId: number) => {
    let newSelectedIds;
    if (selectedIds.includes(itemId)) {
      // Deselect: remove this item and any items that were selected AFTER it? 
      // Actually, just removing this item is fine, the remaining items will shift up in sequence.
      newSelectedIds = selectedIds.filter(id => id !== itemId);
    } else {
      // Select
      newSelectedIds = [...selectedIds, itemId];
    }
    
    setSelectedIds(newSelectedIds);
    
    const isReady = newSelectedIds.length === items.length;
    // We determine correctness if it's ready and matches correct_order
    let isCorrect = false;
    if (isReady && correct_order) {
      isCorrect = JSON.stringify(newSelectedIds) === JSON.stringify(correct_order);
    }

    onInteraction({
      selected_order: newSelectedIds,
      isCorrect
    }, isReady);
  };

  return (
    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Order the Steps"}
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
              <Text className="text-slate-400 text-base mt-2">{'\n'}(Tap them in order)</Text>
            </Text>
          </View>
        </View>
      )}

      <View className="gap-4 pb-12">
        {shuffledItems.map((item: any) => {
          const orderIndex = selectedIds.indexOf(item.id);
          const isSelected = orderIndex !== -1;
          const displayNum = isSelected ? orderIndex + 1 : "";

          return (
            <Card
              key={item.id}
              variant={isSelected ? 'answer-selected' : 'answer'}
              onPress={() => handleSelect(item.id)}
              contentClassName="flex-row items-center p-4"
            >
              <View 
                className={`w-8 h-8 rounded-full items-center justify-center mr-4 ${
                  isSelected 
                    ? 'bg-sage-600' 
                    : 'bg-slate-50 border-2 border-slate-200 border-dashed'
                }`}
              >
                <Text className={`font-bold ${isSelected ? 'text-white' : 'text-transparent'}`}>
                  {displayNum}
                </Text>
              </View>
              
              <Text className={`flex-1 text-lg font-medium ${isSelected ? 'text-sage-800' : 'text-slate-600'}`}>
                {item.text}
              </Text>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
};
