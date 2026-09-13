import React, { useEffect } from "react";
import { AccessibilityInfo, LayoutAnimation, Pressable, Text, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface FeelingWord {
  description: string;
  word: string;
}

interface FeelingFamily {
  name: string;
  words: FeelingWord[];
}

export function NameItCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const families = readFamilies(content.families);
  const phase = readString(saved?.phase) ?? "family";
  const selectedFamily = families.find(
    (family) => family.name === readString(saved?.selectedFamily),
  );
  const selectedWord = readString(saved?.selectedWord);

  useEffect(() => {
    if (!saved) {
      onInteraction(buildFamilyResponse(), false);
    }
  }, [onInteraction, saved]);

  const reducedMotion = useReducedMotion();

  const animate = () => {
    if (!reducedMotion) {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(250, "easeInEaseOut", "opacity")
      );
    } else {
      // Just a direct crossfade for reduced motion if supported, else instant
      LayoutAnimation.configureNext(
        LayoutAnimation.create(150, "linear", "opacity")
      );
    }
  };

  const selectFamily = (family: FeelingFamily) => {
    Haptics.selectionAsync();
    AccessibilityInfo.announceForAccessibility(`${family.name} family selected.`);
    animate();
    onInteraction(
      {
        ...buildFamilyResponse(),
        phase: "word",
        selectedFamily: family.name,
      },
      false,
    );
  };

  const selectWord = (word: string) => {
    Haptics.selectionAsync();
    AccessibilityInfo.announceForAccessibility(`${word} selected.`);
    if (!selectedWord) {
      animate(); // Animate feedback block appearing
    }
    onInteraction(
      {
        ...saved,
        selectedWord: word,
        isCorrect: true,
      },
      true, // This indicates completion to the layout
    );
  };

  const changeFamily = () => {
    animate();
    onInteraction(buildFamilyResponse(), false);
  };

  const getFeedbackFirstSentence = (word: string) => {
    if (word === "Terrified") return "“Terrified” names a more intense form of fear.";
    if (word === "Afraid") return "“Afraid” points to a sense of threat or danger.";
    if (word === "Anxious") return "“Anxious” points to worry about what might happen.";
    return `“${word}” is more specific than simply “bad” or “upset.”`;
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-0">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Name the feeling"}
        instruction={
          phase === "family"
            ? "Start with the closest family."
            : "Now choose the closest word."
        }
      />

      {phase === "family" ? (
        <View className="flex-row flex-wrap justify-center gap-2.5 pt-1">
          {families.map((family) => (
            <View key={family.name} className="relative">
              <View className="absolute inset-x-0 bottom-0 top-[3px] rounded-[25px] bg-[#D8C7B5]" />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${family.name}, emotion family`}
                onPress={() => selectFamily(family)}
                className="min-h-[50px] justify-center rounded-[25px] border border-[#E8DCCB] bg-[#FDF8F3] px-6 active:translate-y-[2px]"
              >
                <Text className="happy-font-body-bold text-base text-[#201E1D]">
                  {family.name}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      {phase === "word" && selectedFamily ? (
        <>
          <View className="mb-4 flex-row items-center justify-between px-1">
            <Text className="happy-font-body-bold text-[11px] uppercase tracking-wider text-[#82796A]">
              {selectedFamily.name} FAMILY
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={changeFamily}
              className="px-2 py-1 active:opacity-60"
            >
              <Text className="happy-font-body-bold text-xs text-[#55694A]">
                Change
              </Text>
            </Pressable>
          </View>

          <View className="gap-2.5">
            {selectedFamily.words.map((item) => {
              const isSelected = selectedWord === item.word;
              return (
                <View key={item.word} className="relative mb-1">
                  <View
                    className="absolute inset-x-0 bottom-0 top-[3px] rounded-[20px]"
                    style={{
                      backgroundColor: isSelected ? "#7E9874" : "#D8C7B5",
                    }}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${item.word}. ${item.description}.`}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => selectWord(item.word)}
                    className={
                      isSelected
                        ? "min-h-[60px] justify-center rounded-[20px] border-[1.5px] border-[#7E9874] bg-[#F2F8EF] px-4 py-3 active:translate-y-[2px]"
                        : "min-h-[60px] justify-center rounded-[20px] border border-[#E8DCCB] bg-[#FDF8F3] px-4 py-3 active:translate-y-[2px]"
                    }
                  >
                    <Text className="happy-font-body-bold text-[15px] text-[#201E1D]">
                      {isSelected ? `${item.word} — selected` : item.word}
                    </Text>
                    <Text className="happy-font-body mt-[3px] text-[12.5px] leading-[17px] text-[#5C5549]">
                      {item.description}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </>
      ) : null}

      {selectedWord ? (
        <View className="mt-4 rounded-[20px] border border-[#E8DCCB] bg-[#FDF8F3] px-4 py-4">
          <Text className="happy-font-heading-bold mb-[6px] text-[13px] uppercase tracking-wider text-[#55694A]">
            Why naming helps
          </Text>
          <Text className="happy-font-body text-[13.5px] leading-[20px] text-[#201E1D]">
            {getFeedbackFirstSentence(selectedWord)}
            {"\n\n"}
            A precise label can help you notice what you’re experiencing more clearly.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function buildFamilyResponse() {
  return {
    format: CourseExerciseCategoryEnum.NameIt,
    phase: "family",
    selectedFamily: null,
    selectedWord: null,
    isCorrect: true,
  };
}

function readFamilies(value: unknown): FeelingFamily[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((familyValue) => {
    const family = readRecord(familyValue);
    const name = readString(family?.name);
    if (!family || !name || !Array.isArray(family.words)) return [];
    const words = family.words.flatMap((wordValue) => {
      const word = readRecord(wordValue);
      const label = readString(word?.word);
      const description = readString(word?.description);
      return label && description ? [{ word: label, description }] : [];
    });
    return [{ name, words }];
  });
}
