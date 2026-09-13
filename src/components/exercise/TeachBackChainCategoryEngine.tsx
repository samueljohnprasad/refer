import React, { useState } from "react";
import { Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readRecord } from "@/src/components/exercise/courseExerciseContent";
import {
  createTeachBackChainResponse,
  getOrderedTeachBackSteps,
  readTeachBackChainContent,
  type TeachBackChainResponse,
} from "@/src/components/exercise/teachBackChainContent";
import {
  EvolvingChainCard,
  ReferenceBlock,
  TactileChoiceButton,
} from "./TeachBackChainComponents";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";

// ponytail: streamlined teach-back engine separating loop construction from interrupt
export function TeachBackChainCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const chain = readTeachBackChainContent(exercise.content);
  const saved = readRecord(savedResponse);
  const [response, setResponse] = useState<TeachBackChainResponse | null>(() =>
    chain ? createTeachBackChainResponse(chain, saved) : null,
  );
  const [brieflyCorrectId, setBrieflyCorrectId] = useState<string | null>(null);

  if (!chain || !response) return null;

  const orderedSteps = getOrderedTeachBackSteps(chain);
  const completedSteps = response.orderedStepIds
    .map((id) => orderedSteps.find((step) => step.id === id))
    .filter((step): step is (typeof orderedSteps)[number] => Boolean(step));
  const activeIndex = completedSteps.length;
  const expectedStep = orderedSteps[activeIndex];

  const handleStepPress = (stepId: string) => {
    if (locked || response.mode !== "chain" || brieflyCorrectId !== null) return;

    if (stepId !== expectedStep?.id) {
      Haptics.selectionAsync();
      const next = createTeachBackChainResponse(chain, {
        ...response,
        selectedStepId: stepId,
        attemptCount: (response.attemptCount ?? 0) + 1,
      });
      setResponse(next);
      onInteraction(next, false);
      return;
    }

    // ponytail: brief confirmation before physically joining chain
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setBrieflyCorrectId(stepId);

    setTimeout(() => {
      setBrieflyCorrectId(null);
      const nextOrdered = [...response.orderedStepIds, stepId];
      const isChainComplete = nextOrdered.length === chain.steps.length;

      if (isChainComplete) {
        // ponytail: seamless conceptual turn directly to interrupt question
        const next = createTeachBackChainResponse(chain, {
          ...response,
          orderedStepIds: nextOrdered,
          selectedStepId: null,
          attemptCount: 0,
          mode: "transfer",
          phase: "active",
        });
        setResponse(next);
        onInteraction(next, false);
      } else {
        const next = createTeachBackChainResponse(chain, {
          ...response,
          orderedStepIds: nextOrdered,
          selectedStepId: null,
          attemptCount: 0,
        });
        setResponse(next);
        onInteraction(next, false);
      }
    }, 220);
  };

  const handleTransferOptionPress = (optionId: string) => {
    if (locked || response.mode !== "transfer" || response.phase === "complete" || brieflyCorrectId !== null) return;
    const option = chain.transfer.options.find((item) => item.id === optionId);
    if (!option) return;

    if (option.isSupported) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setBrieflyCorrectId(optionId);
      setTimeout(() => {
        setBrieflyCorrectId(null);
        const next = createTeachBackChainResponse(chain, {
          ...response,
          selectedTransferOptionId: optionId,
          attemptCount: 0,
          phase: "complete",
          isCorrect: true,
        });
        setResponse(next);
        onInteraction(next, true);
      }, 240);
    } else {
      Haptics.selectionAsync();
      const next = createTeachBackChainResponse(chain, {
        ...response,
        selectedTransferOptionId: optionId,
        attemptCount: (response.attemptCount ?? 0) + 1,
        phase: "feedback",
        isCorrect: false,
      });
      setResponse(next);
      onInteraction(next, false);
    }
  };

  const remainingChoices = chain.steps.filter(
    (step) => !response.orderedStepIds.includes(step.id),
  );

  return (
    <View className="-mt-10 px-2 pb-24">
      <CourseExerciseHeading title={chain.title} instruction={chain.instruction} />
      <ReferenceBlock message={chain.message} />

      {/* Transformed evolving chain card (item 1 & 2: expands with BREAK THE LOOP in final state) */}
      <EvolvingChainCard
        completedSteps={completedSteps}
        breakTheLoopText={
          response.mode === "transfer" && response.phase === "complete"
            ? "Check what you know before treating the prediction as fact."
            : null
        }
      />

      {/* Building state */}
      {response.mode === "chain" && expectedStep ? (
        <View className="gap-3">
          <Text className="happy-font-heading-bold text-[16px] leading-[22px] text-[#201E1D]">
            {activeIndex === 0 ? "What happens first?" : "What happens next?"}
          </Text>
          <View className="gap-2.5">
            {remainingChoices.map((choice) => {
              const isWrong = response.selectedStepId === choice.id;
              const isBrieflyCorrect = brieflyCorrectId === choice.id;
              return (
                <TactileChoiceButton
                  key={choice.id}
                  label={choice.label}
                  isCorrectBriefly={isBrieflyCorrect}
                  isIncorrect={isWrong}
                  feedbackText={isWrong ? response.feedbackText : null}
                  disabled={locked || brieflyCorrectId !== null}
                  onPress={() => handleStepPress(choice.id)}
                />
              );
            })}
          </View>
        </View>
      ) : null}

      {/* Transfer question / Interrupt choice */}
      {response.mode === "transfer" && response.phase !== "complete" ? (
        <View className="gap-3">
          <Text className="happy-font-heading-bold text-[16px] leading-[22px] text-[#201E1D]">
            {chain.transfer.prompt}
          </Text>
          <View className="gap-2.5">
            {chain.transfer.options.map((option) => {
              const isWrong =
                response.selectedTransferOptionId === option.id && !option.isSupported;
              const isBrieflyCorrect = brieflyCorrectId === option.id;
              return (
                <TactileChoiceButton
                  key={option.id}
                  label={option.label}
                  isCorrectBriefly={isBrieflyCorrect}
                  isIncorrect={isWrong}
                  feedbackText={isWrong ? option.response : null}
                  disabled={locked || brieflyCorrectId !== null}
                  onPress={() => handleTransferOptionPress(option.id)}
                />
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}
