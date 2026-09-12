import React, { useEffect } from "react";
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
  const allExplored = explored.length >= cards.length && explored.every((v) => v);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const setMode = (cardIndex: number, mode: LanguageMode) => {
    if (locked) return;
    Haptics.selectionAsync();
    
    const nextModes = [...modes];
    nextModes[cardIndex] = mode;
    
    const nextExplored = [...explored];
    while (nextExplored.length <= cardIndex) nextExplored.push(false);
    if (mode === "situation") {
      nextExplored[cardIndex] = true;
    }
    
    const card = cards[cardIndex];
    if (mode === "situation") {
      AccessibilityInfo.announceForAccessibility(`Experience selected. ${card.situationText}. ${card.situationWhy}`);
    } else {
      AccessibilityInfo.announceForAccessibility(`Identity selected. ${card.identityText}. ${card.identityWhy}`);
    }

    const nextAllExplored = nextExplored.length >= cards.length && nextExplored.every((v) => v);

    onInteraction(
      createResponse({ ...saved, modes: nextModes, explored: nextExplored }),
      nextAllExplored
    );
  };

  return (
    <View className="px-5 pb-8 pt-0">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Change the frame"}
        instruction={readString(content.instruction) ?? "Flip each sentence from identity to experience."}
      />

      {/* gap-6 for generous space between the two cards */}
      <View className="gap-8 mt-2">
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

      {allExplored ? (
        <Animated.View 
          entering={reduceMotion ? undefined : FadeIn.duration(400)}
          className="mt-8 rounded-[20px] bg-sage-50 px-5 py-5 border border-sage-100"
        >
          <Text className="text-[12px] font-bold tracking-widest text-sage-600 mb-2 uppercase">
            {readString(content.rule) ?? "THE SHIFT"}
          </Text>
          <Text className="text-[15px] leading-[22px] text-ink">
            {readString(content.takeaway)}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

function CardItem({ card, situation, reduceMotion, onSelectIdentity, onSelectSituation }: any) {
  const identityOp = useAnimatedStyle(() => ({
    opacity: reduceMotion ? (situation ? 0 : 1) : withTiming(situation ? 0 : 1, { duration: 200 })
  }));
  const situationOp = useAnimatedStyle(() => ({
    opacity: reduceMotion ? (situation ? 1 : 0) : withTiming(situation ? 1 : 0, { duration: 200 })
  }));

  return (
    <View className="rounded-[20px] bg-cream-50 px-5 py-5 border border-cream-200">
      {/* Sentence: 24-28pt gap to switch */}
      <View className="mb-6 min-h-[44px] justify-center items-center relative">
         <Animated.Text className="absolute text-center happy-font-heading-bold text-[17px] leading-[22px] text-ink" style={identityOp}>
           {card.identityText}
         </Animated.Text>
         <Animated.Text className="absolute text-center happy-font-heading-bold text-[17px] leading-[22px] text-ink" style={situationOp}>
           {card.situationText}
         </Animated.Text>
      </View>

      {/* Switch */}
      <View className="flex-row rounded-full bg-white p-1 border border-cream-200 relative mb-4">
        {/* Animated background */}
        <AnimatedBackground situation={situation} reduceMotion={reduceMotion} />
        
        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ selected: !situation }}
          accessibilityLabel="Identity"
          onPress={onSelectIdentity}
          className="flex-1 min-h-[36px] justify-center items-center z-10"
        >
          <Text className={`font-semibold text-[13px] tracking-wide ${!situation ? "text-ink" : "text-ink-soft"}`}>
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
          <Text className={`font-semibold text-[13px] tracking-wide ${situation ? "text-white" : "text-ink-soft"}`}>
            EXPERIENCE
          </Text>
        </Pressable>
      </View>

      {/* Caption: one-line / two-line explanation */}
      <View className="min-h-[40px] justify-center relative">
        <Animated.Text className="absolute text-center w-full happy-font-body text-[14px] leading-[20px] text-ink-soft" style={identityOp}>
          {card.identityWhy}
        </Animated.Text>
        <Animated.Text className="absolute text-center w-full happy-font-body text-[14px] leading-[20px] text-ink-soft" style={situationOp}>
          {card.situationWhy}
        </Animated.Text>
      </View>
    </View>
  );
}

function AnimatedBackground({ situation, reduceMotion }: any) {
  // brand sage: sage-600 is roughly #7E9874
  // taupe: #D5CEC4 or #E4DDD3
  const style = useAnimatedStyle(() => {
    return {
      left: reduceMotion ? (situation ? '50%' : '0%') : withTiming(situation ? '50%' : '0%', { duration: 200 }),
      backgroundColor: reduceMotion 
        ? (situation ? '#7E9874' : '#E6E2DA') 
        : withTiming(situation ? '#7E9874' : '#E6E2DA', { duration: 200 }),
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
  return value.map((item) => !!item);
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.SituationLanguage,
    phase: "language",
    modes: [],
    explored: [],
    isCorrect: true,
    ...extra,
  };
}
