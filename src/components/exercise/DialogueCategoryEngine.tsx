import React, { useEffect, useState, useRef } from "react";
import { View, Text, AccessibilityInfo, Pressable } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { validateDialogueContent } from "@/src/components/exercise/dialogueContent";
import type { DialogueContent, DialogueBeat } from "@/src/components/exercise/dialogueContent";
import { createDialogueResponse, isPendingDecision, selectDialogueOption } from "@/src/components/exercise/dialogueState";
import { DIALOGUE_STYLES } from "@/src/components/exercise/dialogueStyles";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

export function DialogueCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  // Validate content
  const content = exercise.content as DialogueContent;
  const issues = validateDialogueContent(content);
  if (issues.length > 0) {
    return null; // ponytail: let NodeExerciseDataError boundary handle it
  }

  const response = createDialogueResponse(content, savedResponse);
  const isPending = isPendingDecision(content, response);

  // Initialize and repair old state
  useEffect(() => {
    const prev = savedResponse as any;
    if (
      !prev ||
      prev.phase !== response.phase ||
      prev.beatIndex !== response.beatIndex
    ) {
      onInteraction(response, !isPending);
    }
  }, [savedResponse, onInteraction, response, isPending]);

  // VoiceOver Announcement on beat transition
  const prevBeatIndex = useRef(response.beatIndex);
  useEffect(() => {
    if (response.beatIndex !== prevBeatIndex.current) {
      prevBeatIndex.current = response.beatIndex;
      const currentBeat = content.beats[response.beatIndex];
      if (currentBeat) {
        AccessibilityInfo.announceForAccessibility(`${currentBeat.speaker}. ${currentBeat.message}`);
      }
    }
  }, [response.beatIndex, content.beats]);

  // visibleBeats logic
  let earlierSummary = "";
  let visibleBeats: DialogueBeat[] = [];
  
  if (response.beatIndex <= 1) {
    visibleBeats = content.beats.slice(0, response.beatIndex + 1);
  } else {
    visibleBeats = content.beats.slice(response.beatIndex - 1, response.beatIndex + 1);
    const collapsedBeats = content.beats.slice(0, response.beatIndex - 1);
    earlierSummary = collapsedBeats.map(b => b.historySummary).join(" · ");
  }

  const handleSelectOption = (beatId: string, optionId: string) => {
    Haptics.selectionAsync();
    const nextResponse = selectDialogueOption(response, beatId, optionId);
    onInteraction(nextResponse, true);
  };

  return (
    <View style={{ flex: 1 }} className={DIALOGUE_STYLES.container}>
      <CourseExerciseHeading
        title={content.title}
        instruction={content.instruction}
      />
      <View className={DIALOGUE_STYLES.scrollContent}>
        
        {earlierSummary ? (
          <View className={DIALOGUE_STYLES.earlierRow}>
            <View className={DIALOGUE_STYLES.earlierLine} />
            <View className={DIALOGUE_STYLES.earlierBadge}>
              <Text className={DIALOGUE_STYLES.earlierText}>Earlier · {earlierSummary}</Text>
            </View>
            <View className={DIALOGUE_STYLES.earlierLine} />
          </View>
        ) : null}

        {visibleBeats.map((beat) => {
          const isLeft = beat.side === "left";
          const isDecision = beat.type === "decision";
          const selectedOptionId = response.selectedOptionIds[beat.id];
          const selectedOption = isDecision ? (beat as any).options.find((o: any) => o.id === selectedOptionId) : null;

          return (
            <Animated.View 
              key={beat.id}
              entering={FadeIn}
              className={`${DIALOGUE_STYLES.beatContainer} ${isLeft ? DIALOGUE_STYLES.beatContainerLeft : DIALOGUE_STYLES.beatContainerRight}`}
            >
              <View className="flex-col">
                <Text className={`${DIALOGUE_STYLES.speakerName} ${isLeft ? DIALOGUE_STYLES.speakerLeft : DIALOGUE_STYLES.speakerRight}`}>
                  {beat.speaker}
                </Text>
                
                <View className={`${DIALOGUE_STYLES.bubble} ${isLeft ? DIALOGUE_STYLES.bubbleLeft : DIALOGUE_STYLES.bubbleRight}`}>
                  <Text className={DIALOGUE_STYLES.messageText}>{beat.message}</Text>
                </View>

                {isDecision && !selectedOptionId && (
                  <View className={`${DIALOGUE_STYLES.decisionOptionsContainer} ${isLeft ? DIALOGUE_STYLES.decisionOptionsLeft : DIALOGUE_STYLES.decisionOptionsRight}`}>
                    {(beat as any).options.map((opt: any) => (
                      <Animated.View key={opt.id} entering={SlideInDown}>
                        <Pressable
                          onPress={() => handleSelectOption(beat.id, opt.id)}
                          className={DIALOGUE_STYLES.optionCard}
                        >
                          <Text className={DIALOGUE_STYLES.optionLabel}>{opt.label}</Text>
                        </Pressable>
                      </Animated.View>
                    ))}
                  </View>
                )}

                {isDecision && selectedOption && (
                  <Animated.View entering={FadeIn} className={`${DIALOGUE_STYLES.feedbackContainer} ${isLeft ? DIALOGUE_STYLES.feedbackContainerLeft : DIALOGUE_STYLES.feedbackContainerRight}`}>
                    <Text className={DIALOGUE_STYLES.feedbackText}>{selectedOption.feedback}</Text>
                  </Animated.View>
                )}
              </View>
            </Animated.View>
          );
        })}

        {response.phase === "complete" && (
          <Animated.View entering={FadeIn} className={DIALOGUE_STYLES.insightContainer}>
            <Text className={DIALOGUE_STYLES.insightText}>{content.insight}</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
