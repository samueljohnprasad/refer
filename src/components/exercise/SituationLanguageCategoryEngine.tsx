import React, { useEffect, useRef } from "react";
import { Pressable, Text, View, AccessibilityInfo } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

type LanguageMode = "identity" | "situation";

interface LanguageCard {
  identityText: string;
  situationText: string;
  identityWhy: string;
  situationWhy: string;
}

export function SituationLanguageCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const cards = readCards(content.cards);
  
  const modes = readModes(saved?.modes);
  const explored = readExplored(saved?.explored);
  
  const reduceMotion = useReducedMotion();
  const previouslyCompleted = Boolean(saved?.isComplete);
  const currentlyAllExplored = cards.length > 0 && cards.every((_, i) => Boolean(explored[i]));
  const isComplete = previouslyCompleted || currentlyAllExplored;

  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse({ isComplete: false }), false);
    }
  }, [onInteraction, saved]);

  const setMode = (cardIndex: number, mode: LanguageMode) => {
    if (locked) return;
    Haptics.selectionAsync();
    
    const nextModes = [...modes];
    nextModes[cardIndex] = mode;
    
    const nextExplored = [...explored];
    while (nextExplored.length < cards.length) {
      nextExplored.push(false);
    }
    if (mode === "situation") {
      nextExplored[cardIndex] = true;
    }
    
    const card = cards[cardIndex];
    if (card) {
      if (mode === "situation") {
        AccessibilityInfo.announceForAccessibility(`Experience selected. ${card.situationText}.`);
      } else {
        AccessibilityInfo.announceForAccessibility(`Identity selected. ${card.identityText}.`);
      }
    }

    const nextAllExplored = cards.length > 0 && cards.every((_, i) => Boolean(nextExplored[i]));
    const nextIsComplete = previouslyCompleted || nextAllExplored;

    onInteraction(
      createResponse({
        ...saved,
        hasInteracted: true,
        modes: nextModes,
        explored: nextExplored,
        isComplete: nextIsComplete,
      }),
      nextIsComplete
    );
  };

  return (
    <View className="px-5 pb-8 pt-0">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Change the frame"}
        instruction={readString(content.instruction) ?? "Flip each sentence from identity to experience."}
      />

      {/* Cards list */}
      <View className="gap-5 mt-3">
        {cards.map((card, index) => {
          const mode = modes[index] ?? "identity";
          const situation = mode === "situation";
          return (
            <CardItem
              key={`card-${index}`}
              card={card}
              situation={situation}
              reduceMotion={reduceMotion}
              onSelectIdentity={() => setMode(index, "identity")}
              onSelectSituation={() => setMode(index, "situation")}
            />
          );
        })}
      </View>

      {/* Final insight card */}
      {isComplete ? (
        <Animated.View 
          entering={reduceMotion ? undefined : FadeIn.delay(200).duration(350)}
          className="mt-6 rounded-[20px] bg-[#F5F8F4] px-5 py-4 border border-[#D8E2D5]"
          accessible
          accessibilityRole="summary"
        >
          <Text className="text-[12px] font-bold tracking-widest text-sage-600 mb-1.5 uppercase">
            {readString(content.rule) ?? "THE SHIFT"}
          </Text>
          <Text className="text-[15px] leading-[22px] text-ink">
            {readString(content.takeaway) ??
              "A setback or feeling can describe a moment without defining who you are.\n\nDescribe what’s happening without turning it into who you are."}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

function CardItem({
  card,
  situation,
  reduceMotion,
  onSelectIdentity,
  onSelectSituation,
}: {
  card: LanguageCard;
  situation: boolean;
  reduceMotion: boolean;
  onSelectIdentity: () => void;
  onSelectSituation: () => void;
}) {
  const identityOp = useAnimatedStyle(() => ({
    opacity: reduceMotion ? (situation ? 0 : 1) : withTiming(situation ? 0 : 1, { duration: 180 }),
  }));
  const situationOp = useAnimatedStyle(() => ({
    opacity: reduceMotion ? (situation ? 1 : 0) : withTiming(situation ? 1 : 0, { duration: 180 }),
  }));

  return (
    <View className="rounded-[22px] bg-[#FAFAF8] px-5 py-4 border border-[#E2E8DF]">
      {/* Sentence: ~24px gap to switch */}
      <View className="mb-6 min-h-[38px] justify-center items-center relative">
        <Animated.Text
          className="absolute text-center happy-font-heading-bold text-[17px] leading-[22px] text-ink"
          style={identityOp}
        >
          {card.identityText}
        </Animated.Text>
        <Animated.Text
          className="absolute text-center happy-font-heading-bold text-[17px] leading-[22px] text-ink"
          style={situationOp}
        >
          {card.situationText}
        </Animated.Text>
      </View>

      {/* Segmented Switch: ~20px gap to caption */}
      <View className="flex-row rounded-full bg-[#F5F4F0] p-1 border border-[#E2E8DF] relative mb-5">
        <AnimatedBackground situation={situation} reduceMotion={reduceMotion} />
        
        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ selected: !situation }}
          accessibilityLabel="Identity"
          onPress={onSelectIdentity}
          className="flex-1 min-h-[36px] justify-center items-center z-10"
        >
          <Text className={`font-semibold text-[12.5px] tracking-wider ${!situation ? "text-ink" : "text-[#8A8A85]"}`}>
            IDENTITY
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ selected: situation }}
          accessibilityLabel="Experience"
          onPress={onSelectSituation}
          className="flex-1 min-h-[36px] justify-center items-center z-10"
        >
          <Text className={`font-semibold text-[12.5px] tracking-wider ${situation ? "text-white" : "text-[#8A8A85]"}`}>
            EXPERIENCE
          </Text>
        </Pressable>
      </View>

      {/* Caption: one-line / two-line explanation */}
      <View className="min-h-[36px] justify-center items-center relative">
        <Animated.Text
          className="absolute text-center w-full happy-font-body text-[13.5px] leading-[19px] text-[#6B6B6B]"
          style={identityOp}
        >
          {card.identityWhy}
        </Animated.Text>
        <Animated.Text
          className="absolute text-center w-full happy-font-body text-[13.5px] leading-[19px] text-[#6B6B6B]"
          style={situationOp}
        >
          {card.situationWhy}
        </Animated.Text>
      </View>
    </View>
  );
}

function AnimatedBackground({
  situation,
  reduceMotion,
}: {
  situation: boolean;
  reduceMotion: boolean;
}) {
  const style = useAnimatedStyle(() => {
    return {
      left: reduceMotion
        ? situation ? "50%" : "0%"
        : withTiming(situation ? "50%" : "0%", { duration: 180 }),
      backgroundColor: reduceMotion
        ? situation ? "#7E9874" : "#E4E0D8"
        : withTiming(situation ? "#7E9874" : "#E4E0D8", { duration: 180 }),
    };
  });
  
  return (
    <Animated.View 
      className="absolute top-1 bottom-1 w-1/2 rounded-full"
      style={style}
    />
  );
}

function readCards(value: unknown): LanguageCard[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const card = readRecord(item);
    const identityText = readString(card?.identityText);
    const situationText = readString(card?.situationText);
    const identityWhy = readString(card?.identityWhy);
    const situationWhy = readString(card?.situationWhy);
    return identityText && situationText && identityWhy && situationWhy
      ? [{ identityText, situationText, identityWhy, situationWhy }]
      : [];
  });
}

function readModes(value: unknown): LanguageMode[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (item === "situation" ? "situation" : "identity"));
}

function readExplored(value: unknown): boolean[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => Boolean(item));
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.SituationLanguage,
    phase: "language",
    modes: [],
    explored: [],
    hasInteracted: false,
    isComplete: false,
    isCorrect: true,
    ...extra,
  };
}
