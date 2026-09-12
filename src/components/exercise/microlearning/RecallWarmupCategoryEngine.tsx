import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, AccessibilityInfo } from "react-native";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { RecallWarmupContent, RecallWarmupResponse } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { createRecallWarmupResponse } from "./recallWarmupState";
import { trackMicrolearningEvent } from "./microlearningAnalytics";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, SlideInDown, FadeOut } from "react-native-reanimated";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

export function RecallWarmupCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content as unknown as RecallWarmupContent;
  const response = createRecallWarmupResponse(content, savedResponse as RecallWarmupResponse | undefined);
  
  const { currentCardIndex, cardPhase, phase } = response;
  const reducedMotion = useReducedMotion();
  const card = content.cards[currentCardIndex];
  const isAnswerRevealed = cardPhase === "answer";

  const [feedback, setFeedback] = useState<"got_it" | "bring_back" | null>(null);

  useEffect(() => {
    if (!savedResponse) {
      onInteraction(response, false);
    }
  }, [savedResponse]);

  const handleReveal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    AccessibilityInfo.announceForAccessibility("Answer revealed.");
    onInteraction({ ...response, cardPhase: "answer" }, false);
  };

  const handleGrade = (grade: "remembered" | "practice_again") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFeedback(grade === "remembered" ? "got_it" : "bring_back");
    
    // Track opaque scored choice telemetry for this card
    trackMicrolearningEvent({
      eventName: "opaque_scored_choice",
      category: "recall_warmup",
      exerciseId: exercise.id,
      conceptId: card.conceptId,
      stageIndex: currentCardIndex,
      correctness: grade === "remembered",
      attemptCount: 1,
      elapsedSeconds: 0,
      accessibilityFlags: {}
    });

    setTimeout(() => {
      setFeedback(null);
      const isLastCard = currentCardIndex === content.cards.length - 1;
      const nextResponse: RecallWarmupResponse = {
        ...response,
        reviewSignals: {
          ...response.reviewSignals,
          [card.conceptId]: grade,
        },
        currentCardIndex: isLastCard ? currentCardIndex : currentCardIndex + 1,
        cardPhase: isLastCard ? "answer" : "question",
        phase: isLastCard ? "complete" : "card",
      };
      onInteraction(nextResponse, isLastCard);
    }, 1200);
  };

  if (phase === "complete") {
    return (
      <View className="flex-1 px-5 pt-8 pb-10 justify-center">
        <Text className="text-[22px] leading-8 font-medium text-ink-primary text-center">
          Nice — you just tested what you could recall.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-5 pt-5 pb-8">
      {/* HEADER */}
      <View className="mb-6">
        <Text className="text-[24px] font-bold text-forest-900 tracking-[-0.4px] mb-1">
          Recall Warmup
        </Text>
        <Text className="text-[15px] leading-5 text-ink-muted">
          Try to remember the answer, then reveal it.
        </Text>
      </View>

      {/* CARD */}
      <Animated.View 
        key={card.id + (isAnswerRevealed ? "-ans" : "-q")} 
        entering={reducedMotion ? undefined : FadeIn.duration(300)}
        className="rounded-[24px] bg-cream-50 border border-cream-200 px-6 py-7 shadow-sm shadow-black/5"
      >
        <Text className="text-[11px] font-bold tracking-widest uppercase text-sage-500 mb-4">
          CONCEPT {currentCardIndex + 1} OF {content.cards.length}
        </Text>
        
        <Text className="text-[20px] font-semibold leading-[28px] text-ink-primary">
          {card.question}
        </Text>

        {!isAnswerRevealed ? (
          <TouchableOpacity
            onPress={handleReveal}
            activeOpacity={0.7}
            className="mt-8 bg-forest-800 py-3.5 rounded-full items-center"
            accessibilityRole="button"
          >
            <Text className="text-white text-[15px] font-semibold tracking-wide">
              REVEAL ANSWER
            </Text>
          </TouchableOpacity>
        ) : (
          <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(150).duration(300)}>
            <View className="h-px bg-cream-300 w-full my-6" />
            <Text className="text-[18px] leading-[26px] text-ink-primary">
              {card.answer}
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* SELF RATING (Below Card) */}
      {isAnswerRevealed && (
        <Animated.View 
          entering={reducedMotion ? undefined : FadeIn.delay(300).duration(300)}
          className="mt-8"
        >
          {feedback ? (
            <Animated.View entering={FadeIn} exiting={FadeOut} className="items-center py-6">
              <Text className="text-[17px] font-medium text-forest-800">
                {feedback === "got_it" ? "Got it." : "We'll bring this one back."}
              </Text>
            </Animated.View>
          ) : (
            <Animated.View exiting={FadeOut}>
              <Text className="text-center font-medium text-[15px] text-ink-muted mb-5">
                How did that feel?
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => handleGrade("practice_again")}
                  activeOpacity={0.6}
                  className="flex-1 bg-transparent border-2 border-forest-300 py-4 rounded-[20px] items-center justify-center"
                  accessibilityRole="button"
                >
                  <Text className="text-forest-900 font-medium text-[16px]">
                    Practice again
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => handleGrade("remembered")}
                  activeOpacity={0.8}
                  className="flex-1 bg-forest-800 py-4 rounded-[20px] items-center justify-center shadow-sm shadow-black/10"
                  accessibilityRole="button"
                >
                  <Text className="text-white font-medium text-[16px]">
                    Remembered
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      )}
    </View>
  );
}
