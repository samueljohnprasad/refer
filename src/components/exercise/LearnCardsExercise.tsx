import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';

export const LearnCardsExercise = ({ payload, onInteraction }: any) => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Ensure we safely read cards array
  const cards = payload?.content?.cards || [];
  
  // If there's only one card, unlock the next button immediately
  useEffect(() => {
    if (cards.length <= 1) {
      onInteraction(true);
    }
  }, [cards.length, onInteraction]);
  
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Calculate current index based on scroll position
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    
    if (index !== activeIndex) {
      setActiveIndex(index);
      
      // If we've reached the last card, notify parent that exercise is "ready" to continue
      if (index === cards.length - 1) {
        onInteraction(true);
      }
    }
  }, [activeIndex, width, cards.length, onInteraction]);

  if (cards.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text variant="body" color="soft">No cards available.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {cards.map((card: any, index: number) => (
          <View 
            key={index} 
            style={{ width }} 
            className="flex-1 justify-center items-center px-6 pt-4 pb-2"
          >
            {/* Visual Container (Using Mascot instead of image url for now) */}
            <View className="bg-brand-surface rounded-3xl p-6 shadow-sm border border-brand-border/60 mb-8 items-center justify-center min-h-[200px] w-full max-w-[300px]">
              <Mascot state="panda-happy" size={120} />
            </View>
            
            {/* Text Content */}
            <Text variant="h3" color="ink" className="text-center leading-relaxed">
              {card.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View className="flex-row justify-center items-center pb-8 pt-4">
        {cards.map((_: any, index: number) => (
          <View
            key={index}
            className={`h-2.5 rounded-full mx-1.5 transition-all duration-300 ${
              index === activeIndex ? "w-6 bg-sage-500" : "w-2.5 bg-brand-border/80"
            }`}
          />
        ))}
      </View>
    </View>
  );
};
