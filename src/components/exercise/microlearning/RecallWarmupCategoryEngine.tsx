import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, AccessibilityInfo } from "react-native";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { RecallWarmupContent, RecallWarmupResponse } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { createRecallWarmupResponse } from "./recallWarmupState";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { trackMicrolearningEvent } from "./microlearningAnalytics";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

export function RecallWarmupCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  // Use ponytail mode: minimal, YAGNI, direct cast since the validator guarantees the shape upstream
  const content = exercise.content as unknown as RecallWarmupContent;
  const response = createRecallWarmupResponse(content, savedResponse as RecallWarmupResponse | undefined);
  
  const { currentCardIndex, cardPhase, phase } = response;
  const reducedMotion = useReducedMotion();
  const card = content.cards[currentCardIndex];
  const isAnswerRevealed = cardPhase === "answer";

  // ponytail: ensure initialized state is emitted
  useEffect(() => {
    if (!savedResponse) {
      onInteraction(response, false);
    }
  }, [savedResponse]);

  const handleReveal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Announce the reveal
    AccessibilityInfo.announceForAccessibility("Answer revealed.");
    
    onInteraction(
      {
        ...response,
        cardPhase: "answer",
      },
      false
    );
  };

  const handleGrade = (grade: "remembered" | "practice_again") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const isLastCard = currentCardIndex === content.cards.length - 1;
    
    const nextResponse: RecallWarmupResponse = {
      ...response,
      reviewSignals: {
        ...response.reviewSignals,
        [card.conceptId]: grade,
      },
      currentCardIndex: isLastCard ? currentCardIndex : currentCardIndex + 1,
      cardPhase: isLastCard ? "answer" : "question", // keep on answer if complete
      phase: isLastCard ? "complete" : "card",
    };
    
    // Track opaque scored choice telemetry for this card
    trackMicrolearningEvent({
      eventName: "opaque_scored_choice",
      category: "recall_warmup",
      exerciseId: exercise.id,
      conceptId: card.conceptId,
      stageIndex: currentCardIndex,
      correctness: grade === "remembered",
      attemptCount: 1,
      elapsedSeconds: 0, // Simplified for ponytail mode
      accessibilityFlags: {}
    });

    onInteraction(nextResponse, isLastCard);
  };

  if (phase === "complete") {
    // Complete phase UI
    return (
      <View className="flex-1 px-4 py-8 justify-center">
        <Text className="text-3xl font-cormorant text-ink text-center mb-6">
          Warmup Complete
        </Text>
        <Text className="text-lg font-geist text-sage-600 text-center">
          Great job! You've primed your memory for the next concepts.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 pt-4 pb-8">
      <CourseExerciseHeading
        title="Recall Warmup"
        instruction="Try to remember the answer, then reveal it."
      />

      <View className="mt-8 flex-1">
        <Animated.View 
          key={card.id + "q"} 
          entering={reducedMotion ? undefined : FadeIn.duration(400)}
          className="bg-sage-50 rounded-3xl p-8 mb-6 border border-sage-200"
        >
          <Text className="text-xs font-geist text-sage-500 uppercase tracking-widest mb-4">
            Concept {currentCardIndex + 1} of {content.cards.length}
          </Text>
          <Text className="text-2xl font-geist text-ink leading-relaxed">
            {card.question}
          </Text>
          
          {isAnswerRevealed && (
            <Animated.View entering={reducedMotion ? undefined : SlideInDown.duration(300).springify()}>
              <View className="h-px bg-sage-200 my-6" />
              <Text className="text-xl font-geist text-sage-800 leading-relaxed">
                {card.answer}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </View>

      {/* Controls */}
      <View className="min-h-[120px] justify-end pb-4">
        {!isAnswerRevealed ? (
          <TouchableOpacity
            onPress={handleReveal}
            className="w-full bg-ink py-4 rounded-xl items-center"
            accessibilityRole="button"
            accessibilityLabel="Reveal answer"
          >
            <Text className="text-white font-geist text-lg font-bold">
              Reveal Answer
            </Text>
          </TouchableOpacity>
        ) : (
          <Animated.View entering={reducedMotion ? undefined : FadeIn.duration(300)} className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => handleGrade("practice_again")}
              className="flex-1 bg-white border border-sage-300 py-4 rounded-xl items-center"
              accessibilityRole="button"
            >
              <Text className="text-ink font-geist text-lg">
                Practice Again
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleGrade("remembered")}
              className="flex-1 bg-ink py-4 rounded-xl items-center"
              accessibilityRole="button"
            >
              <Text className="text-white font-geist text-lg font-bold">
                Remembered
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
