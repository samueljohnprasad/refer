import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { Exercise } from "@/src/types/journeyV5";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import { readTimelineRewindContent } from "@/src/exercises/TimelineRewind/data";

export function TimelineRewindCategoryEngine({
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
  const {
    title,
    setupText,
    promptText,
    timelineEvents,
    paths,
    reflectionQuestion,
    reflectionOptions,
    finalInsight,
  } = readTimelineRewindContent(exercise);

  // Read saved state
  const saved = readRecord(savedResponse) ?? {};
  const selectedPathId = readString(saved.selectedPathId);
  const revealCount = readNumber(saved.revealCount) ?? 0;
  const revealedMore = saved.revealedMore === true;
  const rewound = saved.rewound === true;
  const alternatePathId = readString(saved.alternatePathId);
  const selectedReflectionId = readString(saved.selectedReflectionId);
  const completed = saved.completed === true;

  // Initialize response if empty
  useEffect(() => {
    if (!readRecord(savedResponse)) {
      onInteraction({ format: "timeline_rewind", phase: "intro" }, false);
    }
  }, [onInteraction, savedResponse]);

  // Hydration recovery hook
  useEffect(() => {
    if (selectedReflectionId && !completed && !saved.recoveredHydration) {
      onInteraction(
        {
          ...saved,
          recoveredHydration: true,
          format: "timeline_rewind",
          phase: "complete",
          isCorrect: true,
        },
        true,
      );
    }
  }, [selectedReflectionId, completed, saved, onInteraction]);

  const activePathId = rewound ? alternatePathId : selectedPathId;
  const activePath = paths.find((p) => p.id === activePathId);

  const targetCount =
    revealedMore || (rewound && activePathId === "whole-night")
      ? timelineEvents.length
      : (activePath?.visibleEventCount ?? 0);

  useEffect(() => {
    if (!selectedPathId) return;
    if (!activePath) return;

    if (revealCount < targetCount) {
      const timer = setTimeout(() => {
        onInteraction(
          { ...saved, format: "timeline_rewind", revealCount: revealCount + 1 },
          false,
        );
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [
    selectedPathId,
    rewound,
    alternatePathId,
    revealCount,
    paths,
    saved,
    onInteraction,
    targetCount,
    activePath,
  ]);

  const selectPath = (pathId: string) => {
    if (locked || selectedPathId) return;

    const altPath = paths.find((p) => p.id !== pathId)?.id ?? null;

    onInteraction(
      {
        ...saved,
        format: "timeline_rewind",
        phase: "question",
        selectedPathId: pathId,
        revealCount: 0,
        alternatePathId: altPath,
      },
      false,
    );
  };

  const visibleEvents = activePath ? timelineEvents.slice(0, revealCount) : [];

  return (
    <View className="flex-1 px-4 pb-10 pt-4">
      <CourseExerciseHeading title={title} instruction={setupText} />

      {!selectedPathId && (
        <View className="flex-1 justify-center gap-6 pb-8">
          <Text className="happy-font-body-medium px-6 text-center text-lg text-ink">
            {promptText}
          </Text>
          <View className="gap-4">
            {paths.map((path) => (
              <CourseExerciseOptionButton
                key={path.id}
                label={path.choiceLabel}
                selected={false}
                disabled={locked}
                onPress={() => selectPath(path.id)}
              />
            ))}
          </View>
        </View>
      )}

      {selectedPathId && (
        <Animated.View
          layout={LinearTransition.springify().damping(18).stiffness(150)}
          className="mt-4 flex-1"
        >
          {visibleEvents.map((event, index) => (
            <Animated.View
              key={index}
              layout={LinearTransition.springify()}
              className="mb-2 flex-row"
            >
              <View className="w-[72px] items-center">
                <Text className="happy-font-body-medium mb-1 text-sm text-ink-soft">
                  {event.time}
                </Text>
                <View className="z-[1] h-2.5 w-2.5 rounded-full bg-gold" />
                {index < visibleEvents.length - 1 && (
                  <View className="-mb-2 -mt-0.5 w-0.5 flex-1 bg-gold-tint" />
                )}
              </View>
              <View className="flex-1 py-6">
                <Text className="happy-font-body text-base text-ink">
                  {event.description}
                </Text>
              </View>
            </Animated.View>
          ))}

          {activePath && revealCount >= activePath.visibleEventCount && (
            <Animated.View
              layout={LinearTransition.springify()}
              className="mt-4 rounded-2xl border border-gold bg-gold-tint p-5"
            >
              <Text className="happy-font-body-medium text-center text-lg leading-[26px] text-bee-dark">
                {activePath.interpretation}
              </Text>

              {!revealedMore && activePath.revealMoreButton && (
                <View className="mt-6">
                  <CourseExerciseOptionButton
                    label={activePath.revealMoreButton}
                    selected={false}
                    disabled={locked}
                    onPress={() =>
                      onInteraction(
                        {
                          ...saved,
                          format: "timeline_rewind",
                          revealedMore: true,
                        },
                        false,
                      )
                    }
                  />
                </View>
              )}

              {revealedMore &&
                activePath.postRevealText &&
                revealCount >= timelineEvents.length && (
                  <Text className="happy-font-body-medium mt-4 text-center text-lg leading-[26px] text-bee-dark">
                    {activePath.postRevealText}
                  </Text>
                )}

              {!rewound &&
                (!activePath.revealMoreButton ||
                  (revealedMore && revealCount >= timelineEvents.length)) &&
                activePath.switchPathButton && (
                  <View className="mt-6">
                    <CourseExerciseOptionButton
                      label={activePath.switchPathButton}
                      selected={false}
                      disabled={locked}
                      onPress={() =>
                        onInteraction(
                          {
                            ...saved,
                            format: "timeline_rewind",
                            rewound: true,
                            revealedMore: false,
                            revealCount: 0,
                          },
                          false,
                        )
                      }
                    />
                  </View>
                )}
            </Animated.View>
          )}

          {rewound &&
            (!activePath?.revealMoreButton || revealedMore) &&
            revealCount >= targetCount &&
            !selectedReflectionId && (
              <Animated.View
                layout={LinearTransition.springify()}
                className="mt-6 gap-4"
              >
                <Text className="happy-font-body-medium text-lg text-ink">
                  {reflectionQuestion}
                </Text>
                <View className="gap-2">
                  {reflectionOptions.map((opt) => (
                    <CourseExerciseOptionButton
                      key={opt.id}
                      label={opt.label}
                      selected={false}
                      disabled={locked}
                      onPress={() =>
                        onInteraction(
                          {
                            ...saved,
                            format: "timeline_rewind",
                            selectedReflectionId: opt.id,
                            phase: "complete",
                            isCorrect: true,
                          },
                          true,
                        )
                      }
                    />
                  ))}
                </View>
              </Animated.View>
            )}

          {selectedReflectionId && (
            <Animated.View
              layout={LinearTransition.springify()}
              className="mt-8 gap-4"
            >
              <Text className="happy-font-heading text-center text-[32px] text-ink">
                {finalInsight.headline}
              </Text>
              {!!finalInsight.body && (
                <Text className="happy-font-body text-center text-base text-ink-soft">
                  {finalInsight.body}
                </Text>
              )}
            </Animated.View>
          )}
        </Animated.View>
      )}
    </View>
  );
}
