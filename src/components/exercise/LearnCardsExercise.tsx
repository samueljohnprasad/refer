import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import Animated, { FadeInUp, FadeIn, Easing } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Text } from "@/src/components/ui/Text";
import { Mascot } from "@/src/components/ui/Mascot";
import { OrganicSpeechTail } from "@/src/components/ui/OrganicSpeechTail";
import { Feather } from "@expo/vector-icons";

export interface Card {
  id?: string;
  text: string;
}

export interface LearnCardsExerciseProps {
  payload: {
    title?: string;
    content?: {
      cards?: Card[];
    };
  };
  onInteraction: (ready: boolean) => void;
}

export const LearnCardsExercise = ({ payload, onInteraction }: LearnCardsExerciseProps) => {
  const cards = payload?.content?.cards || [];
  const [visibleCards, setVisibleCards] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-unlock when all cards are revealed or if no cards
  useEffect(() => {
    if (cards.length > 0 && visibleCards >= cards.length) {
      onInteraction(true);
    } else if (cards.length === 0) {
      onInteraction(true);
    }
  }, [visibleCards, cards.length, onInteraction]);

  const handleNext = () => {
    Haptics.selectionAsync();
    setVisibleCards((prev) => Math.min(prev + 1, cards.length));
  };

  if (!cards || cards.length === 0) {
    return (
      <Animated.View entering={FadeIn} className="flex-1 justify-center items-center p-6">
        <Mascot state="panda-thinking" size={120} />
        <Text variant="h3" color="ink" className="mt-6 text-center font-bold">
          Nothing to read here
        </Text>
        <Text variant="body" color="soft" className="mt-2 text-center max-w-[280px]">
          It looks like there are no cards available for this exercise right now.
        </Text>
      </Animated.View>
    );
  }

  return (
    <View className="flex-1 pt-4">
      {/* Header */}
      <View className="px-6 mb-4 flex-row items-baseline justify-between">
        <Text variant="h2" color="ink" className="font-bold flex-shrink mr-4">
          {payload.title || "Read and learn"}
        </Text>
        <Text variant="body" color="soft" className="text-sm font-medium">
          {visibleCards} of {cards.length}
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => {
            if (visibleCards < cards.length) handleNext();
          }} 
          className="flex-1 min-h-full"
        >
          {cards.slice(0, visibleCards).map((card: Card, index: number) => {
            const isLastInSequence = index === visibleCards - 1;
            const isFirstInSequence = index === 0;

            return (
              <Animated.View
                key={card.id || `card-${index}`}
                entering={FadeInUp.duration(400).easing(Easing.out(Easing.quad))}
                className={`flex-row items-end ${isLastInSequence ? 'mb-4' : 'mb-1'}`}
              >
                {/* Mascot */}
                <View className="w-16 mr-3 z-10 items-center justify-end pb-2">
                  {isLastInSequence ? (
                    <Mascot state="panda-happy" size={56} />
                  ) : null}
                </View>

                {/* Chat Bubble */}
                <View 
                  className={`flex-1 bg-white p-5 border border-slate-200 relative ${
                    isFirstInSequence && isLastInSequence ? 'rounded-xl' :
                    isFirstInSequence ? 'rounded-xl rounded-bl-lg' :
                    isLastInSequence ? 'rounded-xl rounded-tl-lg' :
                    'rounded-xl rounded-l-lg'
                  }`}
                >
                  {isLastInSequence && <OrganicSpeechTail />}

                  <Text
                    variant="body"
                    color="ink"
                    className="leading-[28px] text-[16px] font-medium tracking-wide"
                  >
                    {card.text}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
