import React, { useEffect } from "react";
import { Pressable, Text, View, LayoutAnimation } from "react-native";
import * as Haptics from "expo-haptics";
import { useReducedMotion } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import { StorySerialComparisonCard } from "@/src/components/exercise/StorySerialComparisonCard";
import { StorySerialBeatItem } from "@/src/components/exercise/StorySerialBeatItem";
import { StorySerialReflectionList } from "@/src/components/exercise/StorySerialReflectionList";
import { StorySerialPatternCard } from "@/src/components/exercise/StorySerialPatternCard";
import { readRecord, readString } from "@/src/components/exercise/courseExerciseContent";
import {
  createResponse,
  readBranches,
  readComparison,
  readReflectionOptions,
  readIndex,
  type ReflectionOption,
} from "@/src/components/exercise/storySerialContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";

export function StorySerialCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const branches = readBranches(content.branches);
  const comparison = readComparison(content.comparison);
  const reflectionOptions = readReflectionOptions(content.reflectionOptions);

  const firstBranchIndex =
    readIndex(saved?.firstBranchIndex) ?? readIndex(saved?.selectedBranchIndex);
  const hasRewound = saved?.hasRewound === true || saved?.rewinding === true;
  const activeBranchIndex =
    readIndex(saved?.activeBranchIndex) ?? (hasRewound && firstBranchIndex != null ? 1 - firstBranchIndex : firstBranchIndex);
  const beatCount = readIndex(saved?.beatCount) ?? (hasRewound ? (readIndex(saved?.alternateBeatCount) ?? 0) : (readIndex(saved?.mainBeatCount) ?? 0));
  const comparisonReady = saved?.comparisonReady === true;
  const activeReflectionId = readString(saved?.activeReflectionId);
  const isFinalComplete = saved?.isFinalComplete === true;

  const firstBranch = firstBranchIndex == null ? null : branches[firstBranchIndex];
  const activeBranch = activeBranchIndex == null ? null : branches[activeBranchIndex];
  const totalBeats = activeBranch ? activeBranch.beats.length : 0;
  const isPathComplete = activeBranch != null && beatCount >= totalBeats;

  const reducedMotion = useReducedMotion();
  const animate = () => {
    if (!reducedMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  };

  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse(), false);
    }
  }, [onInteraction, saved]);

  // Progressive reveal for active path, and auto-transition after path 2
  useEffect(() => {
    if (!activeBranch || comparisonReady) return;
    if (beatCount < totalBeats) {
      const timer = setTimeout(() => {
        animate();
        onInteraction(
          createResponse({ ...saved, beatCount: beatCount + 1 }),
          false,
        );
      }, reducedMotion ? 40 : 180);
      return () => clearTimeout(timer);
    }
    // Path 2 completed: pause 400ms then auto-compress into comparison
    if (hasRewound && isPathComplete) {
      const timer = setTimeout(() => {
        animate();
        onInteraction(
          createResponse({ ...saved, comparisonReady: true }),
          false,
        );
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [activeBranch, beatCount, comparisonReady, hasRewound, isPathComplete, onInteraction, reducedMotion, saved, totalBeats]);

  const chooseBranch = (branchIndex: number) => {
    if (locked || firstBranchIndex != null) return;
    Haptics.selectionAsync();
    animate();
    onInteraction(
      createResponse({
        firstBranchIndex: branchIndex,
        selectedBranchIndex: branchIndex,
        activeBranchIndex: branchIndex,
        beatCount: 0,
        hasRewound: false,
        comparisonReady: false,
      }),
      false,
    );
  };

  const rewind = () => {
    if (locked || hasRewound || firstBranchIndex == null) return;
    animate();
    const secondIndex = 1 - firstBranchIndex;
    onInteraction(
      createResponse({
        ...saved,
        activeBranchIndex: secondIndex,
        hasRewound: true,
        beatCount: 0,
        comparisonReady: false,
      }),
      false,
    );
  };

  const chooseReflection = (option: ReflectionOption) => {
    if (locked || isFinalComplete) return;
    const isCorrect = option.id === "reading";
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.selectionAsync();
    }
    animate();
    onInteraction(
      createResponse({
        ...saved,
        activeReflectionId: option.id,
        isFinalComplete: isCorrect,
      }),
      isCorrect,
    );
  };

  const isSignal = activeBranch?.label.includes("SIGNAL");

  return (
    <View className="flex-1 -mt-5 px-2 pb-6">
      <View className="mb-2.5">
        <CourseExerciseHeading
          title={readString(content.title) ?? "Walk both alarm paths"}
          instruction={!comparisonReady ? (readString(content.instruction) ?? "Walk one path, then rewind and compare.") : undefined}
        />
      </View>

      {/* Scenario */}
      {firstBranchIndex == null ? (
        <View className="mb-5">
          <Text className="happy-font-body text-[15px] leading-[22px] text-[#201E1D]">
            {readString(content.opening)}
          </Text>
        </View>
      ) : !comparisonReady ? (
        <View
          accessible
          accessibilityLabel="Same start. Unexpected meeting and tight chest."
          className="mb-4 w-full rounded-[16px] border border-[#EAE4D9] bg-[#FAF7F2] px-4 py-2"
        >
          <Text className="happy-font-heading-bold mb-0.5 text-[10px] uppercase tracking-wider text-[#8C8275]">
            SAME START
          </Text>
          <Text className="happy-font-body-bold text-[13.5px] text-[#2C2723]">
            Unexpected meeting + tight chest
          </Text>
        </View>
      ) : null}

      {/* Initial Decision */}
      {firstBranchIndex == null && (
        <View className="mt-2">
          <Text className="happy-font-heading-bold mb-3 text-[11px] uppercase tracking-wider text-[#82796A]">
            YOU CHOOSE FOR SAM
          </Text>
          <View className="gap-3">
            {branches.map((branch, index) => (
              <CourseExerciseOptionButton
                key={branch.label}
                label={branch.choice}
                selected={false}
                disabled={locked}
                onPress={() => chooseBranch(index)}
              />
            ))}
          </View>
        </View>
      )}

      {/* Compressed First Path summary when walking second path */}
      {hasRewound && !comparisonReady && firstBranch && (
        <View
          accessible
          accessibilityLabel={`${firstBranch.label.includes("SIGNAL") ? "Alarm as signal" : "Alarm as proof"} path summary: ${(firstBranchIndex === 0 ? comparison.path1 : comparison.path2).join(", ")}`}
          className={`mb-4 w-full rounded-[16px] border px-4 py-2.5 opacity-85 ${
            firstBranchIndex === 0
              ? "border-[#E8DCCB] bg-[#FAF5EE]"
              : "border-[#ABC0A2] bg-[#F2F7F0]"
          }`}
        >
          <Text
            className={`happy-font-heading-bold mb-0.5 text-[10.5px] uppercase tracking-wider ${
              firstBranchIndex === 0 ? "text-[#82796A]" : "text-[#55694A]"
            }`}
          >
            {firstBranch.label}
          </Text>
          <Text
            className={`happy-font-body text-[13px] ${
              firstBranchIndex === 0 ? "text-[#5C5549]" : "text-[#3F4A31]"
            }`}
          >
            {(firstBranchIndex === 0 ? comparison.path1 : comparison.path2).join(" → ")}
          </Text>
        </View>
      )}

      {/* Active Path Card */}
      {activeBranch && !comparisonReady && (
        <View
          accessible
          accessibilityLabel={isSignal ? "Alarm as signal." : "Alarm as proof."}
          className={`w-full rounded-[18px] border px-4 py-3.5 ${
            isSignal
              ? "border-[#ABC0A2] bg-[#F2F7F0]"
              : "border-[#E8DCCB] bg-[#FDF8F3]"
          }`}
        >
          <Text
            className={`happy-font-heading-bold mb-2 text-[10.5px] uppercase tracking-wider ${
              isSignal ? "text-[#4A6B53]" : "text-[#82796A]"
            }`}
          >
            {activeBranch.label}
          </Text>
          <View>
            {activeBranch.beats.slice(0, beatCount).map((beat, i) => (
              <StorySerialBeatItem key={i} beat={beat} showArrow={i > 0} />
            ))}
          </View>
        </View>
      )}

      {/* Rewind CTA — Secondary Tactile button, ONLY shown after path 1 */}
      {!hasRewound && isPathComplete && (
        <View className="relative mt-5 w-full pb-[3px]">
          <View className="absolute inset-x-0 bottom-0 top-[3px] rounded-[16px] bg-[#C2D5BD]" />
          <Pressable
            accessibilityRole="button"
            onPress={rewind}
            className="min-h-[50px] w-full items-center justify-center rounded-[16px] border border-[#ABC0A2] bg-white px-5 active:translate-y-[3px]"
          >
            <Text className="happy-font-body-bold text-[15px] text-[#3C5A3E]">
              Rewind and walk the other path
            </Text>
          </Pressable>
        </View>
      )}

      {/* Comparison & Discrimination */}
      {comparisonReady && (
        <View className="mb-6">
          <StorySerialComparisonCard comparison={comparison} />

          <View className="mb-3 mt-7">
            <Text className="happy-font-body-bold text-[16px] leading-[22px] text-[#201E1D]">
              {readString(content.reflectionPrompt)}
            </Text>
          </View>

          <StorySerialReflectionList
            options={reflectionOptions}
            activeId={activeReflectionId}
            isFinalComplete={isFinalComplete}
            locked={locked}
            onSelect={chooseReflection}
          />

          {/* Single Merged Final Insight Card — Flat pale sage */}
          {isFinalComplete && (
            <StorySerialPatternCard pattern={readString(content.pattern)} />
          )}
        </View>
      )}
    </View>
  );
}
