import React from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Accordion, AccordionLayoutTransition } from "heroui-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface TermChip {
  id: string;
  label: string;
  details: string;
}

export function TermChipCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const chips = readChips(content.chips);

  const exploredIds = readStringArray(saved?.exploredIds ?? saved?.openedIds);
  const expandedId = readString(saved?.expandedId);
  const isComplete = chips.length > 0 && exploredIds.length >= chips.length;

  // ponytail: sync local state with hero-ui Accordion for instant layout transitions
  const [activeId, setActiveId] = React.useState<string | null>(expandedId);

  React.useEffect(() => {
    setActiveId(expandedId);
  }, [expandedId]);

  const handleValueChange = (nextValue: string | undefined) => {
    if (locked) return;
    const nextId = nextValue ?? null;
    setActiveId(nextId);

    const isNewExploration = nextId !== null && !exploredIds.includes(nextId);
    const nextExplored = isNewExploration ? [...exploredIds, nextId] : exploredIds;
    const willBeComplete = chips.length > 0 && nextExplored.length >= chips.length;

    if (willBeComplete && !isComplete) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (nextId !== null) {
      Haptics.selectionAsync();
    }

    onInteraction(
      createResponse({
        ...saved,
        exploredIds: nextExplored,
        openedIds: nextExplored, // compatibility
        expandedId: nextId,
        isComplete: willBeComplete,
      }),
      willBeComplete,
    );
  };

  return (
    <View className="flex-1 px-2 pb-6 pt-0">
      <View className="mb-4">
        <CourseExerciseHeading
          title={readString(content.title) ?? "Key alarm concepts"}
          instruction={
            isComplete
              ? "Tap any term again to review it."
              : (readString(content.instruction) ?? "Tap each term to reveal its meaning.")
          }
        />
      </View>

      {/* ponytail: HeroUI Native Accordion with polished contrast & alignment */}
      <Accordion
        selectionMode="single"
        variant="surface"
        value={activeId ?? undefined}
        onValueChange={handleValueChange}
        className="rounded-[24px] border border-[#E8DCCB] bg-white shadow-sm"
      >
        {chips.map((chip) => {
          const isOpen = activeId === chip.id;
          const isExplored = exploredIds.includes(chip.id);

          return (
            <Accordion.Item
              key={chip.id}
              value={chip.id}
              isDisabled={locked}
              className={isOpen ? "bg-[#F7FAF5]" : ""}
            >
              <Accordion.Trigger
                accessibilityRole="button"
                accessibilityLabel={
                  isExplored
                    ? `${chip.label}, explored. Tap to toggle definition.`
                    : `${chip.label}. Tap to toggle definition.`
                }
              >
                <View className="flex-1 flex-row items-center gap-3">
                  {isExplored ? (
                    <Ionicons name="checkmark-circle" size={19} color="#55694A" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={17} color="#A8A296" />
                  )}
                  <Text
                    className={`happy-font-heading-bold flex-1 text-[15.5px] ${
                      isOpen ? "text-[#142414]" : "text-[#1F2E1F]"
                    }`}
                  >
                    {chip.label}
                  </Text>
                </View>
                <Accordion.Indicator
                  iconProps={{
                    size: 15,
                    color: isOpen ? "#55694A" : "#8A9784",
                  }}
                />
              </Accordion.Trigger>
              <Accordion.Content className="pb-3.5 pt-0">
                <Text className="happy-font-body pl-[30px] pr-3 text-[14.5px] leading-[22px] text-[#2C3E2C]">
                  {chip.details}
                </Text>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion>

      {/* Quiet exploration progress aligned with AccordionLayoutTransition */}
      <Animated.View layout={AccordionLayoutTransition}>
        <Text className="happy-font-body-medium mt-4 text-center text-[13px] text-[#82796A]">
          {exploredIds.length} of {chips.length} explored
        </Text>
      </Animated.View>
    </View>
  );
}

// ponytail: minimal serialization & reader helpers
function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.TermChip,
    phase: "explore",
    ...extra,
  };
}

function readChips(val: unknown): TermChip[] {
  if (!Array.isArray(val)) return [];
  return val
    .map((item) => ({
      id: readString(item?.id) ?? "",
      label: readString(item?.label) ?? "",
      details: readString(item?.details) ?? "",
    }))
    .filter((c) => c.id && c.label);
}

