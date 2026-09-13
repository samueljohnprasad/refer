import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, AccessibilityInfo } from "react-native";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { RecallWarmupContent, RecallWarmupResponse } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { createRecallWarmupResponse } from "./recallWarmupState";
import { trackMicrolearningEvent } from "./microlearningAnalytics";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, SlideInDown, FadeOut } from "react-native-reanimated";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

// ponytail: clean memory check engine with unbiased self-rating tactile buttons
export function RecallWarmupCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content as unknown as RecallWarmupContent;
  const response = createRecallWarmupResponse(content, savedResponse as RecallWarmupResponse | undefined);
  
  const { currentCardIndex, cardPhase, phase } = response;
  const reducedMotion = useReducedMotion();
  const cards = content?.cards ?? [];
  const card = cards[currentCardIndex];
  const isAnswerRevealed = cardPhase === "answer";

  const [feedback, setFeedback] = useState<"got_it" | "bring_back" | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<"remembered" | "practice_again" | null>(null);

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
    if (selectedGrade !== null) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedGrade(grade);
    setFeedback(grade === "remembered" ? "got_it" : "bring_back");
    
    // Track opaque scored choice telemetry for this card
    trackMicrolearningEvent({
      eventName: "opaque_scored_choice",
      category: "recall_warmup",
      exerciseId: exercise.id,
      conceptId: card?.conceptId ?? `card-${currentCardIndex}`,
      stageIndex: currentCardIndex,
      correctness: grade === "remembered",
      attemptCount: 1,
      elapsedSeconds: 0,
      accessibilityFlags: {}
    });

    setTimeout(() => {
      setSelectedGrade(null);
      setFeedback(null);
      const isLastCard = currentCardIndex === cards.length - 1;
      const nextResponse: RecallWarmupResponse = {
        ...response,
        reviewSignals: {
          ...response.reviewSignals,
          [card?.conceptId ?? `card-${currentCardIndex}`]: grade,
        },
        currentCardIndex: isLastCard ? currentCardIndex : currentCardIndex + 1,
        cardPhase: isLastCard ? "answer" : "question",
        phase: isLastCard ? "complete" : "card",
      };
      onInteraction(nextResponse, isLastCard);
    }, 1000);
  };

  if (phase === "complete") {
    return (
      <View className="flex-1 -mt-12 px-5 justify-center items-center">
        <Text className="happy-font-heading-bold text-[22px] leading-[30px] text-[#201E1D] text-center">
          Nice — you tested what you could recall.
        </Text>
      </View>
    );
  }

  if (!card) return null;

  return (
    <View className="flex-1 -mt-12 px-5 pb-8 pt-0">
      {/* Title & Subtitle */}
      <View className="mb-6">
        <Text className="happy-font-heading-bold text-[24px] leading-[30px] text-[#201E1D] tracking-tight">
          {content.title ?? "Recall Warmup"}
        </Text>
        <Text className="happy-font-body text-[14.5px] leading-[20px] text-[#7A7265] mt-1">
          {content.instruction ?? "Try to remember the answer, then reveal it."}
        </Text>
      </View>

      {/* Main Single Recall Card */}
      <Animated.View 
        key={(card.id ?? `card-${currentCardIndex}`) + (isAnswerRevealed ? "-ans" : "-q")} 
        entering={reducedMotion ? undefined : FadeIn.duration(250)}
        className="rounded-[24px] border border-[#DFE8DC] bg-[#F3F8F2] px-6 pt-5 pb-5"
      >
        {/* Concept Metadata Label */}
        <Text className="text-[11px] font-bold tracking-wider uppercase text-[#2D5A32] mb-3">
          CONCEPT {currentCardIndex + 1} OF {cards.length}
        </Text>
        
        {/* Question Text */}
        <Text className="happy-font-heading-semibold text-[20px] leading-[28px] text-[#201E1D]">
          {card.question}
        </Text>

        {!isAnswerRevealed ? (
          <TouchableOpacity
            onPress={handleReveal}
            activeOpacity={0.7}
            className="mt-6 rounded-full border border-[#D0DDD0] bg-[#FAF7F2] py-3 items-center"
            accessibilityRole="button"
          >
            <Text className="happy-font-body-semibold text-[14.5px] text-[#201E1D]">
              Reveal answer
            </Text>
          </TouchableOpacity>
        ) : (
          <Animated.View entering={reducedMotion ? undefined : FadeIn.duration(250)}>
            {/* Quiet Neutral Divider */}
            <View className="h-px bg-[#E2ECE0] w-full my-6" />
            {/* Answer Text */}
            <Text className="happy-font-body text-[16px] leading-[25px] text-[#2C2825]">
              {card.answer}
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Self-Rating (Attached Below Card) */}
      {isAnswerRevealed && (
        <Animated.View 
          entering={reducedMotion ? undefined : FadeIn.delay(150).duration(250)}
          className="mt-5"
        >
          {/* Secondary Question / Quiet Feedback */}
          <Text className="happy-font-body-medium text-center text-[14.5px] text-[#7A7265] mb-3.5">
            {feedback
              ? feedback === "got_it"
                ? "Got it."
                : "We'll bring this one back."
              : "How well did you remember it?"}
          </Text>

          {/* Equal Unbiased Tactile Choice Buttons */}
          <View className="flex-row gap-3">
            {/* Practice Again */}
            <TouchableOpacity
              onPress={() => handleGrade("practice_again")}
              activeOpacity={0.7}
              disabled={selectedGrade !== null}
              className={`flex-1 min-h-[52px] py-3.5 px-2 rounded-[18px] items-center justify-center border-[1.5px] ${
                selectedGrade === "practice_again"
                  ? "bg-[#EAF1E7] border-[#5F7F58] border-b-[3px] border-b-[#476342]"
                  : selectedGrade === "remembered"
                    ? "opacity-40 bg-[#FAF7F2] border-[#D6DFD4] border-b-[3px] border-b-[#C6D2C4]"
                    : "bg-[#FAF7F2] border-[#D6DFD4] border-b-[3px] border-b-[#C6D2C4] active:translate-y-0.5"
              }`}
              accessibilityRole="button"
              accessibilityLabel="Practice again"
            >
              <Text
                className={`happy-font-body-bold text-[15px] text-center ${
                  selectedGrade === "practice_again"
                    ? "text-[#244228]"
                    : "text-[#201E1D]"
                }`}
              >
                Practice again
              </Text>
            </TouchableOpacity>

            {/* Remembered */}
            <TouchableOpacity
              onPress={() => handleGrade("remembered")}
              activeOpacity={0.7}
              disabled={selectedGrade !== null}
              className={`flex-1 min-h-[52px] py-3.5 px-2 rounded-[18px] items-center justify-center border-[1.5px] ${
                selectedGrade === "remembered"
                  ? "bg-[#EAF1E7] border-[#5F7F58] border-b-[3px] border-b-[#476342]"
                  : selectedGrade === "practice_again"
                    ? "opacity-40 bg-[#FAF7F2] border-[#D6DFD4] border-b-[3px] border-b-[#C6D2C4]"
                    : "bg-[#FAF7F2] border-[#D6DFD4] border-b-[3px] border-b-[#C6D2C4] active:translate-y-0.5"
              }`}
              accessibilityRole="button"
              accessibilityLabel="Remembered"
            >
              <Text
                className={`happy-font-body-bold text-[15px] text-center ${
                  selectedGrade === "remembered"
                    ? "text-[#244228]"
                    : "text-[#201E1D]"
                }`}
              >
                Remembered
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Intentional Lower Whitespace */}
      <View className="h-28" />
    </View>
  );
}
