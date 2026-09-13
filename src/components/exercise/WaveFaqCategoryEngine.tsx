import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readCourseExerciseOptions,
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import {
  DEFAULT_WAVE_FAQ_INSIGHT,
  DEFAULT_WAVE_FAQ_MECHANISM,
  DEFAULT_WAVE_FAQ_OPTIONS,
  WaveFaqInsightCard,
  WaveFaqMechanismCard,
  WaveFaqWrongFeedback,
} from "@/src/components/exercise/WaveFaqCards";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

// ponytail: progressive discovery engine for panic re-trigger waves
export function WaveFaqCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const savedOptionId = readString(saved?.selectedOptionId);
  const isPreviouslyCompleted = Boolean(saved?.ready || saved?.isComplete);

  const rawOptions = readCourseExerciseOptions(content.options);
  const options = rawOptions.length > 0 ? rawOptions : DEFAULT_WAVE_FAQ_OPTIONS;
  const rawMechanism = readStringArray(content.mechanism);
  const mechanism = rawMechanism.length > 0 ? rawMechanism : DEFAULT_WAVE_FAQ_MECHANISM;

  const insightRecord = readRecord(content.insight);
  const insightEyebrow =
    readString(insightRecord?.eyebrow) ?? DEFAULT_WAVE_FAQ_INSIGHT.eyebrow;
  const insightTitle =
    readString(insightRecord?.title) ?? DEFAULT_WAVE_FAQ_INSIGHT.title;
  const insightBody = readString(insightRecord?.body);
  const insightParagraphs = insightBody
    ? insightBody.split("\n\n").map((p) => p.trim()).filter(Boolean)
    : DEFAULT_WAVE_FAQ_INSIGHT.paragraphs;

  const isTargetOption = (id: string | null) => {
    if (!id) return false;
    const opt = options.find((o) => o.id === id);
    return opt ? Boolean(opt.isCorrect) : id === "body-sensation";
  };

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(savedOptionId);
  const [hasSelectedWrong, setHasSelectedWrong] = useState(
    Boolean(savedOptionId) && !isTargetOption(savedOptionId),
  );
  const [hasSelectedCorrect, setHasSelectedCorrect] = useState(
    isPreviouslyCompleted || isTargetOption(savedOptionId),
  );
  const [revealedStep, setRevealedStep] = useState<number>(
    isPreviouslyCompleted || isTargetOption(savedOptionId) ? mechanism.length : 0,
  );
  const [showInsight, setShowInsight] = useState<boolean>(isPreviouslyCompleted);

  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.WaveFaq,
          selectedOptionId: null,
          hasInteracted: false,
          ready: false,
          isCorrect: false,
          isComplete: false,
        },
        false,
      );
    }
  }, [onInteraction, saved]);

  useEffect(() => {
    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, []);

  const triggerProgressiveReveal = (step: number, optionId: string) => {
    setRevealedStep(step);
    if (step < mechanism.length) {
      stepTimerRef.current = setTimeout(() => triggerProgressiveReveal(step + 1, optionId), 150);
    } else {
      stepTimerRef.current = setTimeout(() => {
        setShowInsight(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        AccessibilityInfo.announceForAccessibility(
          `${insightEyebrow}. ${insightTitle}. ${insightParagraphs.join(" ")}`,
        );
        onInteraction(
          {
            ...saved,
            format: CourseExerciseCategoryEnum.WaveFaq,
            selectedOptionId: optionId,
            hasInteracted: true,
            ready: true,
            isCorrect: true,
            isComplete: true,
          },
          true,
        );
      }, 200);
    }
  };

  const chooseOption = (optionId: string) => {
    if (locked || hasSelectedCorrect) return;

    setSelectedOptionId(optionId);
    const isCorrect = isTargetOption(optionId);

    if (!isCorrect) {
      setHasSelectedWrong(true);
      Haptics.selectionAsync();
      AccessibilityInfo.announceForAccessibility(
        "Not necessarily. The alarm can return without new danger. What else might have restarted the loop?",
      );
      onInteraction(
        {
          ...saved,
          format: CourseExerciseCategoryEnum.WaveFaq,
          selectedOptionId: optionId,
          hasInteracted: true,
          ready: false,
          isCorrect: false,
          isComplete: false,
        },
        false,
      );
    } else {
      setHasSelectedWrong(false);
      setHasSelectedCorrect(true);
      Haptics.selectionAsync();
      onInteraction(
        {
          ...saved,
          format: CourseExerciseCategoryEnum.WaveFaq,
          selectedOptionId: optionId,
          hasInteracted: true,
          ready: false,
          isCorrect: true,
          isComplete: false,
        },
        false,
      );
      // Wait ~120ms before causal sequence begins
      stepTimerRef.current = setTimeout(() => {
        triggerProgressiveReveal(1, optionId);
      }, 120);
    }
  };

  return (
    <View className="px-5 pb-8 pt-0">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Why did the alarm return?"}
        instruction={
          readString(content.instruction) ??
          "A second wave can feel like you're back at the beginning."
        }
      />

      {/* Scenario Quote Card */}
      <View className="mb-4 rounded-[18px] bg-[#FAF6EF] px-4.5 py-3.5 border border-[#EDE6DA]">
        <Text className="font-serif italic text-[15.5px] leading-[23px] text-[#2C2825]">
          {readString(content.scenario) ??
            "“I was finally calming down.\nWhy is the anxiety coming back?”"}
        </Text>
      </View>

      {/* Question Prompt */}
      <Text className="text-[11.5px] font-bold tracking-wider text-[#7A7265] uppercase mb-2">
        {readString(content.prompt) ?? "WHAT MIGHT EXPLAIN IT?"}
      </Text>

      {/* Options Stack */}
      <View className="gap-2.5">
        {options.map((option) => {
          const isCorrect = isTargetOption(option.id);
          const isSelected = selectedOptionId === option.id;
          const isCorrectSelected = hasSelectedCorrect && isCorrect;
          const isWrongSelected = hasSelectedWrong && isSelected && !isCorrect;
          const isDimmed = hasSelectedCorrect && !isCorrect;

          let containerStyle = "";
          let textStyle = "";

          if (isCorrectSelected) {
            // FLAT informational card after evaluation (Happy rule: informational = flat)
            containerStyle = "bg-[#F2F8EF] border-[1.5px] border-[#5F7F58]";
            textStyle = "text-[#1B3B2B]";
          } else if (isDimmed) {
            // FLAT dimmed informational card
            containerStyle = "bg-[#FAF8F5] border-[1.5px] border-[#EAE4DC] opacity-50";
            textStyle = "text-[#7A7265]";
          } else if (isWrongSelected) {
            // Corrective feedback state
            containerStyle = "bg-[#F7F5F0] border-[1.5px] border-[#8A8275]";
            textStyle = "text-[#3D3833]";
          } else {
            // TACTILE clickable button depth before evaluation
            containerStyle =
              "bg-[#FCFBF8] border-[1.5px] border-b-[3.5px] border-[#E2DDD5] border-b-[#C2BBB0] active:border-b-[1.5px] active:translate-y-[1px]";
            textStyle = "text-[#201E1D]";
          }

          return (
            <View key={option.id}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  selected: isSelected,
                  disabled: locked || hasSelectedCorrect,
                }}
                disabled={locked || hasSelectedCorrect}
                onPress={() => chooseOption(option.id)}
                className={`w-full rounded-[18px] px-4.5 py-3.5 ${containerStyle}`}
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    className={`flex-1 happy-font-body-medium text-[15px] leading-[21px] ${textStyle}`}
                  >
                    {option.label}
                  </Text>
                  {isCorrectSelected ? (
                    <View className="ml-3 h-6 w-6 rounded-full bg-[#5F7F58] items-center justify-center">
                      <Text className="text-white text-[13px] font-bold">✓</Text>
                    </View>
                  ) : null}
                </View>
              </Pressable>

              {/* Wrong Choice Corrective Cue */}
              {isWrongSelected && !hasSelectedCorrect ? (
                <WaveFaqWrongFeedback />
              ) : null}
            </View>
          );
        })}
      </View>

      {/* Causal Mechanism Sequence */}
      {revealedStep >= 1 ? (
        <WaveFaqMechanismCard
          mechanism={mechanism}
          revealedStep={revealedStep}
        />
      ) : null}

      {/* The Idea / Final Insight Card */}
      {showInsight ? (
        <WaveFaqInsightCard
          eyebrow={insightEyebrow}
          title={insightTitle}
          paragraphs={insightParagraphs}
        />
      ) : null}

      {/* Generous bottom spacing: guarantees no sticky Continue overlap */}
      <View className="h-44" />
    </View>
  );
}
