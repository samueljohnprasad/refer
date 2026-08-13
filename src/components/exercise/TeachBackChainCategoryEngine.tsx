import React, { useEffect } from "react";
import { Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readRecord } from "@/src/components/exercise/courseExerciseContent";
import {
  ActivePrompt,
  ChoiceTray,
  CompactHistory,
  ExerciseWorkspace,
  InlineFeedback,
} from "@/src/components/exercise/microlearning";
import {
  createTeachBackChainResponse,
  getOrderedTeachBackSteps,
  getTeachBackTransferFeedback,
  hasSameTeachBackChainResponse,
  readTeachBackChainContent,
  type TeachBackChainContent,
  type TeachBackChainResponse,
} from "@/src/components/exercise/teachBackChainContent";
import { teachBackChainStyles as styles } from "@/src/components/exercise/teachBackChainStyles";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";

export function TeachBackChainCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const chain = readTeachBackChainContent(exercise.content);
  const saved = readRecord(savedResponse);
  const response = chain ? createTeachBackChainResponse(chain, saved) : null;

  useEffect(() => {
    if (!chain || !response || (saved && hasSameTeachBackChainResponse(saved, response))) {
      return;
    }
    onInteraction(response, isFooterReady(chain, response));
  }, [chain, onInteraction, response, saved]);

  if (!chain || !response) return null;

  const selectStep = (stepId: string) => {
    if (locked || response.mode !== "chain" || response.orderedStepIds.length === chain.steps.length) {
      return;
    }
    const orderedSteps = getOrderedTeachBackSteps(chain);
    const expected = orderedSteps[response.orderedStepIds.length];
    if (!expected) return;
    if (stepId !== expected.id) {
      onInteraction(
        createTeachBackChainResponse(chain, {
          ...response,
          selectedStepId: stepId,
        }),
        false,
      );
      return;
    }

    Haptics.selectionAsync();
    const next = createTeachBackChainResponse(chain, {
      ...response,
      orderedStepIds: [...response.orderedStepIds, stepId],
      selectedStepId: null,
    });
    onInteraction(next, isFooterReady(chain, next));
  };

  const selectTransferOption = (optionId: string) => {
    if (locked || response.mode !== "transfer" || response.phase !== "active") return;
    const option = chain.transfer.options.find((item) => item.id === optionId);
    if (!option) return;
    Haptics.selectionAsync();
    const next = createTeachBackChainResponse(chain, {
      ...response,
      selectedTransferOptionId: optionId,
      attemptCount: option.isSupported ? response.attemptCount : response.attemptCount + 1,
    });
    onInteraction(next, isFooterReady(chain, next));
  };

  return (
    <View style={styles.screen}>
      <CourseExerciseHeading title={chain.title} instruction={chain.instruction} />
      <ReferenceMessage message={chain.message} />
      <ExerciseWorkspace transitionKey={getTransitionKey(response)}>
        {response.mode === "chain" ? (
          <ChainWorkspace
            chain={chain}
            response={response}
            locked={locked}
            onSelect={selectStep}
          />
        ) : (
          <TransferWorkspace
            chain={chain}
            response={response}
            locked={locked}
            onSelect={selectTransferOption}
          />
        )}
      </ExerciseWorkspace>
    </View>
  );
}

function ReferenceMessage({ message }: { message: string }) {
  return (
    <View accessibilityLabel="Reference" style={styles.reference}>
      <Text style={styles.referenceLabel}>Reference</Text>
      <Text style={styles.referenceText}>{message}</Text>
    </View>
  );
}

function ChainWorkspace({
  chain,
  response,
  locked,
  onSelect,
}: ChainWorkspaceProps) {
  const orderedSteps = getOrderedTeachBackSteps(chain);
  const completed = response.orderedStepIds
    .map((id) => orderedSteps.find((step) => step.id === id))
    .filter((step): step is (typeof orderedSteps)[number] => Boolean(step));
  const activeIndex = completed.length;
  const active = orderedSteps[activeIndex];
  const remaining = chain.steps.filter((step) => !response.orderedStepIds.includes(step.id));
  const futureCount = Math.max(orderedSteps.length - activeIndex - 1, 0);

  return (
    <>
      <CompactHistory
        items={completed.map((step, index) => ({
          id: step.id,
          label: `Step ${index + 1}`,
          value: step.label,
        }))}
      />
      {active ? (
        <>
          <ActivePrompt prompt={activeIndex === 0 ? "What happens first?" : "What happens next?"} />
          <View accessibilityLabel={`Step ${activeIndex + 1} active slot`} style={styles.activeSlot}>
            <Text style={styles.slotLabel}>Step {activeIndex + 1}</Text>
            <Text style={styles.slotHint}>Choose the next part of the explanation.</Text>
          </View>
          <ChoiceTray
            choices={remaining}
            selectedId={response.selectedStepId}
            disabled={locked}
            onSelect={onSelect}
          />
          {futureCount > 0 ? (
            <Text style={styles.future}>{futureCount} more step{futureCount === 1 ? "" : "s"} to join</Text>
          ) : null}
          <InlineFeedback message={response.feedbackText} tone="neutral" />
        </>
      ) : (
        <View accessibilityLiveRegion="polite" style={styles.ready}>
          <Text style={styles.readyText}>Your explanation is ready.</Text>
        </View>
      )}
    </>
  );
}

function TransferWorkspace({
  chain,
  response,
  locked,
  onSelect,
}: TransferWorkspaceProps) {
  const feedback = getTeachBackTransferFeedback(chain, response);
  const showTakeaway = Boolean(feedback?.isSupported) || response.phase === "complete";
  return (
    <>
      <ActivePrompt context="Try it yourself" prompt={chain.transfer.prompt} />
      {response.phase === "active" ? (
        <ChoiceTray choices={chain.transfer.options} disabled={locked} onSelect={onSelect} />
      ) : (
        <>
          <InlineFeedback
            message={feedback?.response ?? null}
            title={feedback?.label}
            tone={feedback?.isSupported ? "supported" : "neutral"}
          />
          {showTakeaway && feedback ? <Text style={styles.takeaway}>{feedback.takeaway}</Text> : null}
        </>
      )}
    </>
  );
}

function isFooterReady(
  chain: TeachBackChainContent,
  response: TeachBackChainResponse,
): boolean {
  return response.mode === "transfer"
    ? response.phase !== "active"
    : response.orderedStepIds.length === chain.steps.length;
}

function getTransitionKey(response: TeachBackChainResponse): string {
  return [
    response.mode,
    response.phase,
    response.orderedStepIds.join("-"),
    response.selectedStepId ?? "",
    response.selectedTransferOptionId ?? "",
    response.attemptCount,
  ].join(":");
}

interface ChainWorkspaceProps {
  chain: TeachBackChainContent;
  response: TeachBackChainResponse;
  locked: boolean;
  onSelect: (id: string) => void;
}

interface TransferWorkspaceProps extends ChainWorkspaceProps {}
