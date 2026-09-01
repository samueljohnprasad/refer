import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import { CourseExerciseTeachingPanel } from "@/src/components/exercise/CourseExerciseTeachingPanel";
import { readRecord, readString } from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

// Define the expected content types for the new nested structure
type IfThenAction = { id: string; text: string };
type IfThenCue = { id: string; text: string; actions: IfThenAction[] };

export function IfThenPlanCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  
  // Parse content using the new structure or fallback for safety
  const rawCues = content.cues as any[];
  const rawActions = Array.isArray(content.actions) ? content.actions : [];
  const defaultActions = rawActions.map((a: any) => ({
    id: typeof a === 'string' ? a : a?.id ?? '',
    text: typeof a === 'string' ? a : a?.text ?? ''
  }));
  const cues: IfThenCue[] = Array.isArray(rawCues) ? rawCues.map(c => ({
    id: typeof c === 'string' ? c : c?.id ?? '',
    text: typeof c === 'string' ? c : c?.text ?? '',
    actions: (Array.isArray(c?.actions) && c.actions.length > 0) ? c.actions.map((a: any) => ({
      id: typeof a === 'string' ? a : a?.id ?? '',
      text: typeof a === 'string' ? a : a?.text ?? ''
    })) : defaultActions
  })) : [];

  const phase = (saved?.phase as string) || "selecting_trigger";
  const cueId = saved?.cueId as string | undefined;
  const actionId = saved?.actionId as string | undefined;

  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse(), false);
    } else if (phase === "selecting_trigger" || phase === "selecting_action") {
      // Ensure the "Save to My Plans" button is hidden during selection by reporting incomplete (ready: false)
      onInteraction(saved, false);
    } else if (phase === "review") {
      // Ready to save
      onInteraction(saved, true);
    }
  }, [onInteraction, saved, phase]);

  const selectCue = (id: string) => {
    if (locked) return;
    const next = createResponse({ ...saved, cueId: id, phase: "selecting_action", actionId: null });
    onInteraction(next, false);
  };

  const selectAction = (id: string) => {
    if (locked) return;
    const next = createResponse({ ...saved, actionId: id, phase: "review" });
    onInteraction(next, true);
  };

  const selectedCue = cues.find(c => c.id === cueId);
  const selectedAction = selectedCue?.actions.find(a => a.id === actionId);

  return (
    <ScrollView 
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <CourseExerciseHeading
        title={readString(content.title) ?? "Set up the next small test"}
        instruction={
          phase === "selecting_trigger"
            ? "Choose something you've noticed."
            : phase === "selecting_action"
            ? "Choose how you'll test it."
            : ""
        }
      />

      {phase === "selecting_trigger" && (
        <View className="mb-4">
          <Text className="happy-font-body-bold mb-3 text-[10.5px] tracking-[0.5px] text-[#82796A] uppercase">
            IF
          </Text>
          <View className="gap-2.5">
            {cues.map(cue => (
              <CourseExerciseOptionButton
                key={cue.id}
                label={cue.text}
                selected={cue.id === cueId}
                onPress={() => selectCue(cue.id)}
                showConfirmationIcon={false}
              />
            ))}
          </View>
        </View>
      )}

      {phase === "selecting_action" && selectedCue && (
        <View className="mb-4">
          <Text className="happy-font-body-bold mb-3 text-[10.5px] tracking-[0.5px] text-[#82796A] uppercase">
            IF
          </Text>
          <View className="mb-6 opacity-90">
             <CourseExerciseOptionButton
                label={selectedCue.text}
                selected={true}
                onPress={() => {}}
                disabled={true}
                showConfirmationIcon={false}
              />
          </View>

          <Text className="happy-font-body-bold mb-3 text-[10.5px] tracking-[0.5px] text-[#82796A] uppercase">
            THEN I WILL
          </Text>
          <View className="gap-2.5">
            {selectedCue.actions.map(action => (
              <CourseExerciseOptionButton
                key={action.id}
                label={action.text}
                selected={action.id === actionId}
                onPress={() => selectAction(action.id)}
                showConfirmationIcon={false}
              />
            ))}
          </View>
        </View>
      )}

      {(phase === "review" || phase === "complete") && selectedCue && selectedAction && (
        <View>
          <View className="mb-3">
             <Text className="happy-font-body-bold mb-2 text-[10.5px] tracking-[0.5px] text-[#82796A] uppercase">
               Your small test
             </Text>
             <View className="rounded-[20px] border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] px-5 py-5">
               <Text className="happy-font-heading-bold text-[18px] leading-[26px] text-[#3F4A31]">
                 If {selectedCue.text},
               </Text>
               <Text className="happy-font-heading-bold mt-3 text-[18px] leading-[26px] text-[#3F4A31]">
                 then I will {selectedAction.text}.
               </Text>
             </View>
          </View>

          {phase === "review" && (
            <View className="mt-4 px-2">
              <Text className="happy-font-body text-center text-[13px] text-[#82796A]">
                Private to you · No reminders unless you ask.
              </Text>
            </View>
          )}

          {phase === "complete" && (
            <View className="mt-4">
              <CourseExerciseTeachingPanel
                title="✓ Added to My Plans"
                body=""
              />
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.IfThenPlan,
    phase: "selecting_trigger",
    isCorrect: false, // isCorrect isn't highly relevant for this builder, but we keep the key
    ...extra,
  };
}
