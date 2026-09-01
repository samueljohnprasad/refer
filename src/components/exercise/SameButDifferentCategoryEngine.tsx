import React, { useEffect, useState } from "react";
import { LayoutAnimation, Pressable, Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface ComparisonRow {
  question: string;
  left: string;
  right: string;
}

export function SameButDifferentCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const rows = readComparisonRows(content.rows);
  const completedRowIndexes = readNumberArray(saved?.openedRowIndexes);
  const reduceMotion = useReducedMotion();
  const allCompleted = rows.length > 0 && completedRowIndexes.length >= rows.length;

  const firstUncompleted = rows.findIndex((_, i) => !completedRowIndexes.includes(i));
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(
    allCompleted ? null : (firstUncompleted >= 0 ? firstUncompleted : 0)
  );

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const toggleRow = (index: number) => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setActiveRowIndex(activeRowIndex === index ? null : index);
  };

  const markCompleted = (index: number) => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    
    const nextCompleted = completedRowIndexes.includes(index) 
      ? completedRowIndexes 
      : [...completedRowIndexes, index];
      
    const isAllCompleted = nextCompleted.length >= rows.length;
    
    // Auto-advance to the next uncompleted row, or close if all completed
    const nextActive = isAllCompleted ? null : rows.findIndex((_, i) => !nextCompleted.includes(i));
    setActiveRowIndex(nextActive);

    onInteraction(
      createResponse({ ...saved, openedRowIndexes: nextCompleted }),
      isAllCompleted
    );
  };

  return (
    <View className="px-2 pb-10 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Experiment, not performance test"}
        instruction={readString(content.instruction) ?? "See what separates an experiment from a performance test."}
      />

      <View className="mt-2 rounded-[24px] border-[1.5px] border-[#DCD3C4] bg-[#FAF8F5] overflow-hidden">
        
        {/* The Column Headers */}
        <View className="flex-row border-b-[1.5px] border-[#DCD3C4] bg-[#F2F0EA] px-4 py-[14px]">
          <Text className="flex-1 happy-font-body-bold text-[11px] tracking-[0.8px] text-[#82796A] uppercase">
            {readString(content.leftHeading) ?? "Experiment"}
          </Text>
          <Text className="flex-1 happy-font-body-bold text-[11px] tracking-[0.8px] text-[#82796A] uppercase ml-3">
            {readString(content.rightHeading) ?? "Performance Test"}
          </Text>
        </View>

        {/* The Comparison Rows */}
        {rows.map((row, index) => {
          const isActive = activeRowIndex === index;
          const isCompleted = completedRowIndexes.includes(index);
          const isLast = index === rows.length - 1;

          return (
            <View key={row.question} className={!isLast ? "border-b-[1.5px] border-[#DCD3C4]" : ""}>
              <Pressable 
                accessibilityRole="button"
                accessibilityState={{ expanded: isActive }}
                onPress={() => toggleRow(index)}
                className="px-4 py-4 flex-row items-center justify-between bg-white"
              >
                <Text className={isActive ? "happy-font-body-bold text-[14.5px] text-[#29452A] flex-1 mr-2" : "happy-font-body-bold text-[14.5px] text-[#82796A] flex-1 mr-2"}>
                  {row.question}
                </Text>
                {isCompleted && !isActive ? (
                  <Text className="happy-font-body-bold text-[#185A37] text-lg leading-[20px]">✓</Text>
                ) : (
                  <Text className="happy-font-body-bold text-[#82796A] text-[16px] leading-[20px]">
                    {isActive ? "▴" : "▾"}
                  </Text>
                )}
              </Pressable>

              {isActive && (
                <View className="px-4 pb-5 pt-1 bg-white">
                  <View className="flex-row">
                    <Text className="flex-1 happy-font-body text-[14.5px] leading-[21px] text-[#29452A]">
                      {row.left}
                    </Text>
                    <Text className="flex-1 happy-font-body text-[14.5px] leading-[21px] text-[#29452A] ml-3">
                      {row.right}
                    </Text>
                  </View>
                  
                  {!isCompleted && (
                    <Pressable 
                      accessibilityRole="button"
                      onPress={() => markCompleted(index)}
                      className="mt-5 bg-[#E3ECD5] rounded-full py-[14px] items-center justify-center active:bg-[#D5E3C3]"
                    >
                      <Text className="happy-font-body-bold text-[#29452A] text-[14.5px]">
                        ✓ Difference found
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {allCompleted ? (
        <View className="mt-8 mb-2">
          <View className="flex-row items-center justify-center mb-3.5 gap-2">
            <Text className="happy-font-body-bold text-[#185A37] text-[15px]">✓</Text>
            <Text className="happy-font-body-bold text-[11.5px] text-[#82796A] uppercase tracking-[0.7px]">
              {rows.length} differences found
            </Text>
          </View>
          
          <View className="rounded-[22px] bg-[#F2F8EF] px-5 py-[18px]">
            <Text className="happy-font-body-bold mb-1.5 text-[11px] tracking-[0.8px] text-[#29452A] uppercase">
              THE TELL
            </Text>
            <Text className="happy-font-body text-[15px] leading-[22px] text-[#3F4A31]">
              {readString(content.tell)}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function readComparisonRows(value: unknown): ComparisonRow[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const row = readRecord(item);
    const question = readString(row?.question);
    const left = readString(row?.left);
    const right = readString(row?.right);
    return question && left && right ? [{ question, left, right }] : [];
  });
}

function readNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.SameButDifferent,
    phase: "comparison",
    openedRowIndexes: [],
    isCorrect: true,
    ...extra,
  };
}
