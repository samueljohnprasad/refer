import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Text } from "@/src/components/ui/Text";
import { Mascot } from "@/src/components/ui/Mascot";
import { OrganicSpeechTail } from "@/src/components/ui/OrganicSpeechTail";

export const LearnCardsExercise = ({ payload, onInteraction }: any) => {
  const cards = payload?.content?.cards || [];
  const [visibleCards, setVisibleCards] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-unlock if there's only one card
  useEffect(() => {
    if (cards.length <= 1) {
      onInteraction(true);
    }
  }, [cards.length, onInteraction]);

  const handleNext = () => {
    if (visibleCards < cards.length) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setVisibleCards((prev) => prev + 1);
      
      // Unlock continue button on last card
      if (visibleCards + 1 === cards.length) {
        onInteraction(true);
      }

      // Scroll to bottom so new message is visible
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  if (cards.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text variant="body" color="soft">
          No cards available.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 pt-4">
      {/* Title */}
      <View className="px-6 mb-4">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Read and learn"}
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {cards.slice(0, visibleCards).map((card: any, index: number) => {
          const isLastInSequence = index === visibleCards - 1;
          
          return (
            <Animated.View
              key={index}
              entering={FadeInUp.springify().damping(20).stiffness(200)}
              className="flex-row items-end mb-4"
            >
              {/* Mascot - Only show on the last message in a sequence to stack cleanly */}
              <View className="w-16 mr-3 z-10 items-center justify-end pb-2">
                {isLastInSequence ? (
                  <Mascot state="panda-happy" size={56} />
                ) : null}
              </View>

              {/* Chat Bubble */}
              <View className="flex-1 bg-white rounded-3xl p-5 border-2 border-brand-border/60 shadow-sm relative">
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
      </ScrollView>

      {/* Floating Action to Progress */}
      {visibleCards < cards.length && (
        <Animated.View 
          entering={FadeIn.delay(300)}
          className="absolute bottom-6 left-0 right-0 items-center"
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNext}
            className="bg-brand-primary/10 border border-brand-primary/20 px-6 py-3 rounded-full flex-row items-center shadow-sm backdrop-blur-md"
          >
            <Text className="text-brand-primary font-bold text-[15px]">
              Tap to continue
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};
