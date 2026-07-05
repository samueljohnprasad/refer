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
    <View className="flex-1 pt-4">
      {/* Exercise Title (like the Duolingo "Read and respond") */}
      <View className="px-6 mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Read and learn"}
        </Text>
      </View>

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
            className="flex-row items-start px-6"
          >
            {/* Mascot on the left */}
            <View className="mr-5 mt-2 z-10">
              <Mascot state="panda-happy" size={80} />
            </View>
            
            {/* Speech Bubble on the right */}
            <View className="flex-1 bg-white rounded-3xl p-6 border-2 border-brand-border/60 shadow-sm relative">
              {/* Pointer Triangle - overlapping the left border */}
              <View 
                className="absolute -left-[11px] top-10 w-5 h-5 bg-white border-l-2 border-b-2 border-brand-border/60" 
                style={{ transform: [{ rotate: '45deg' }] }} 
              />
              
              {/* Text Content */}
              <Text variant="body" color="ink" className="leading-[32px] text-[17px] font-medium tracking-wide">
                {card.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View className="flex-row justify-center items-center pb-12 pt-6">
        {cards.map((_: any, index: number) => (
          <View
            key={index}
            className={`h-2.5 rounded-full mx-1.5 transition-all duration-300 ${
              index === activeIndex ? "w-8 bg-sage-500" : "w-3 bg-brand-border/80"
            }`}
          />
        ))}
      </View>
    </View>
  );
};
