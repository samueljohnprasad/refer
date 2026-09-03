import React, { useEffect, useState } from "react";
import { View, Text, type ViewStyle } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import {
  readString,
  readRecord,
  readNumber,
} from "@/src/components/exercise/courseExerciseContent";
import { Exercise } from "@/src/types/journeyV5";

export function StateSwitchCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
  locked,
}: {
  exercise: Exercise;
  savedResponse?: unknown;
  onInteraction: (response: Record<string, unknown>, ready: boolean) => void;
  locked?: boolean;
}) {
  const content = readRecord(exercise.content) ?? {};

  const title = readString(content.title) ?? "";
  const instruction = readString(content.instruction) ?? "";

  const states = (Array.isArray(content.states) ? content.states : []).map(
    (s) => {
      const rec = readRecord(s);
      return {
        id: readString(rec?.id) ?? "",
        mode: readString(rec?.mode) ?? "",
        meterLabel: readString(rec?.meterLabel) ?? "",
        symptoms: (Array.isArray(rec?.symptoms) ? rec?.symptoms : []).map(
          (sym) => readString(sym) ?? "",
        ),
        stressors: (Array.isArray(rec?.stressors) ? rec?.stressors : []).map(
          (st) => readString(st) ?? "",
        ),
        summary: readString(rec?.summary) ?? "",
        actionLabel: readString(rec?.actionLabel) ?? "",
        meterValue: readNumber(rec?.meterValue) ?? 0,
      };
    },
  );

  const recallRec = readRecord(content.recall);
  const recall = recallRec
    ? {
        scenario: readString(recallRec.scenario) ?? "",
        options: (Array.isArray(recallRec.options)
          ? recallRec.options
          : []
        ).map((o) => {
          const rec = readRecord(o);
          return {
            id: readString(rec?.id) ?? "",
            label: readString(rec?.label) ?? "",
            isCorrect: rec?.isCorrect === true,
          };
        }),
        feedback: {
          correct: readString(readRecord(recallRec.feedback)?.correct) ?? "",
          incorrect:
            readString(readRecord(recallRec.feedback)?.incorrect) ?? "",
        },
      }
    : null;

  const finalInsightRec = readRecord(content.finalInsight);
  const finalInsight = finalInsightRec
    ? {
        headline: readString(finalInsightRec.headline) ?? "",
        body: readString(finalInsightRec.body) ?? "",
      }
    : null;

  const saved = readRecord(savedResponse) ?? {};
  const stepIndex = readNumber(saved.stepIndex) ?? 0;
  const selectedReflectionId = readString(saved.selectedReflectionId);
  const [revealedStressorsCount, setRevealedStressorsCount] = useState(0);

  const currentState =
    stepIndex < states.length ? states[stepIndex] : states[states.length - 1];
  const isRecall = stepIndex >= states.length;

  useEffect(() => {
    if (currentState?.mode === "conflict") {
      setRevealedStressorsCount(0);
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setRevealedStressorsCount((c) => c + 1);
        if (count >= (currentState.stressors?.length || 0)) {
          clearInterval(interval);
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [currentState?.mode, currentState?.stressors?.length]);

  const baseMeterValue = currentState?.meterValue ?? 0;
  const meterValue =
    currentState?.mode === "conflict"
      ? Math.max(15, 100 - revealedStressorsCount * 28.33)
      : baseMeterValue;

  // Replaced useAnimatedStyle to prevent Reanimated crashes with string percentages
  const meterIndicatorStyle = {
    left: `${meterValue}%` as `${number}%`,
  } satisfies ViewStyle;

  const handleNextState = () => {
    if (locked) return;
    onInteraction(
      { ...saved, format: "state_switch", stepIndex: stepIndex + 1 },
      false,
    );
  };

  const handleAnswer = (optionId: string, isCorrect: boolean) => {
    if (locked || selectedReflectionId) return;
    onInteraction(
      {
        ...saved,
        format: "state_switch",
        selectedReflectionId: optionId,
        phase: "complete",
        isCorrect,
      },
      true,
    );
  };

  const selectedOption = recall?.options.find(
    (o) => o.id === selectedReflectionId,
  );
  const feedbackText = selectedOption?.isCorrect
    ? recall?.feedback.correct
    : recall?.feedback.incorrect;

  return (
    <View className="flex-1 px-4 pb-10 pt-4">
      <CourseExerciseHeading title={title} instruction={instruction} />

      <Animated.View
        layout={LinearTransition.springify().damping(18).stiffness(150)}
        className="mb-4 mt-8 px-8"
      >
        {/* The Track */}
        <View className="h-4 justify-center rounded-lg bg-brand-border">
          <Animated.View
            layout={LinearTransition.springify().damping(20).stiffness(90)}
            className="absolute -ml-3 h-6 w-6 items-center justify-center rounded-full bg-ink shadow-sm"
            style={meterIndicatorStyle}
          />
        </View>
        <View className="mt-4 flex-row justify-between">
          <Text className="happy-font-body-medium text-xs tracking-[0.5px] text-ink-soft">
            ALERT
          </Text>
          <Text className="happy-font-body-medium text-xs tracking-[0.5px] text-ink-soft">
            SETTLED
          </Text>
        </View>
      </Animated.View>

      {!isRecall && currentState && (
        <Animated.View
          layout={LinearTransition.springify()}
          className="mt-6 px-2"
        >
          <View className="gap-4">
            {currentState.symptoms.length > 0 && (
              <View className="gap-2">
                {currentState.symptoms.map((sym, idx) => (
                  <Text
                    key={idx}
                    className="happy-font-body-medium text-lg text-ink-soft"
                  >
                    • {sym}
                  </Text>
                ))}
              </View>
            )}

            {currentState.stressors.length > 0 && (
              <View className="gap-2">
                {currentState.stressors
                  .slice(0, revealedStressorsCount)
                  .map((st, idx) => (
                    <Text
                      key={idx}
                      className="happy-font-body-medium text-lg text-ink-soft"
                    >
                      • {st}
                    </Text>
                  ))}
              </View>
            )}

            {!!currentState.summary && (
              <Text className="happy-font-body mt-2 text-base leading-6 text-ink-soft">
                {currentState.summary}
              </Text>
            )}
          </View>

          <View className="mt-6">
            <CourseExerciseOptionButton
              label={currentState.actionLabel}
              selected={false}
              disabled={locked}
              onPress={handleNextState}
            />
          </View>
        </Animated.View>
      )}

      {isRecall && recall && (
        <Animated.View layout={LinearTransition.springify()} className="mt-6">
          <Text className="happy-font-body-medium text-center text-lg leading-[26px] text-ink">
            {recall.scenario}
          </Text>

          <View className="mt-6 gap-3">
            {recall.options.map((opt) => {
              const isSelected = selectedReflectionId === opt.id;
              return (
                <CourseExerciseOptionButton
                  key={opt.id}
                  label={opt.label}
                  selected={isSelected}
                  disabled={locked}
                  result={
                    isSelected && locked
                      ? opt.isCorrect
                        ? "correct"
                        : "incorrect"
                      : undefined
                  }
                  onPress={() => handleAnswer(opt.id, opt.isCorrect)}
                />
              );
            })}
          </View>

          {selectedReflectionId && feedbackText && (
            <Animated.View
              layout={LinearTransition.springify()}
              className="mt-6 rounded-xl border border-brand-border bg-brand-surface-soft p-4"
            >
              <Text className="happy-font-body-medium text-center text-base text-ink-soft">
                {feedbackText}
              </Text>
            </Animated.View>
          )}

          {selectedReflectionId && finalInsight && (
            <Animated.View
              layout={LinearTransition.springify()}
              className="mt-8 items-center gap-3"
            >
              <Text className="happy-font-heading text-center text-[32px] text-ink">
                {finalInsight.headline}
              </Text>
              <Text className="happy-font-body text-center text-base leading-6 text-ink-soft">
                {finalInsight.body}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      )}
    </View>
  );
}
