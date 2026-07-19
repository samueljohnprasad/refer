import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "@/src/components/exercise/steps/StepLayout";
import { 
  ReflectionTimeline, 
  ReflectionTimelineItem, 
  ReflectionScoreShift 
} from "@/src/components/exercise/ReflectionTimeline";
import type { StepProps, WorryDecisionTreeResponse } from "@/src/types/exerciseFlow";
import { INK, INK_SOFT } from "@/lib/tokens";

interface WorryTreeSummaryStepProps extends StepProps {
  title?: string;
  subtitle?: string;
}

export const WorryTreeSummaryStep: React.FC<WorryTreeSummaryStepProps> = React.memo(
  ({
    response,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
    stepIndex,
    totalSteps,
    title,
    subtitle,
    isSaving,
  }) => {
    const data = response as WorryDecisionTreeResponse;

    return (
      <StepLayout
        title={title || "Worry Processed"}
        subtitle={subtitle || "Here is the path you took."}
        progress={progress}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        canGoBack={canGoBack}
        isValid={isValid}
        onBack={onBack}
        onNext={onNext}
        isLoading={isSaving}
        scrollable
      >
        <View className="px-4 py-6">
          <ReflectionTimeline>
            <ReflectionTimelineItem label="The Worry">
              <Text style={{ color: INK }} className="text-[17px] leading-[24px]">
                {data.worry}
              </Text>
            </ReflectionTimelineItem>

            <ReflectionTimelineItem label="The Decision">
              <Text style={{ color: INK }} className="text-[17px] leading-[24px]">
                {data.canAct === "yes" ? "In my control" : "Out of my hands"}
              </Text>
            </ReflectionTimelineItem>

            {data.canAct === "yes" ? (
              <ReflectionTimelineItem label="Action Plan">
                <Text style={{ color: INK }} className="text-[17px] leading-[24px]">
                  {data.actionPlan}
                </Text>
                {data.scheduledAction && (
                  <Text style={{ color: INK_SOFT }} className="text-[15px] leading-[22px] mt-1">
                    Scheduled for: {data.scheduledAction}
                  </Text>
                )}
              </ReflectionTimelineItem>
            ) : (
              <ReflectionTimelineItem label="Acceptance">
                <Text style={{ color: INK }} className="text-[17px] leading-[24px]">
                  {data.acceptanceExercise}
                </Text>
              </ReflectionTimelineItem>
            )}

            <ReflectionTimelineItem label="Anxiety Shift" isLast>
              <ReflectionScoreShift 
                before={data.preAnxietyRating}
                after={data.postAnxietyRating}
                label={data.preAnxietyRating > data.postAnxietyRating ? "Feeling better" : "Processed"}
              />
            </ReflectionTimelineItem>
          </ReflectionTimeline>
        </View>
      </StepLayout>
    );
  },
);

WorryTreeSummaryStep.displayName = "WorryTreeSummaryStep";
