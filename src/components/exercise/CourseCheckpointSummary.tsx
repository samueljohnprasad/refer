import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readBooleanResults } from "@/src/components/exercise/courseCheckpointContent";
import { readString } from "@/src/components/exercise/courseExerciseContent";
import type { CheckpointItem } from "@/src/components/exercise/courseCheckpointContent";

export function CourseCheckpointSummary({
  content,
  items,
  saved,
}: {
  content: Record<string, unknown>;
  items: CheckpointItem[];
  saved: Record<string, unknown> | null;
}): React.JSX.Element {
  const { t } = useTranslation("exercises");
  const results = readBooleanResults(saved?.results);
  const solid = items.filter((_, index) => results[index] === true);
  const revisit = items.filter((_, index) => results[index] !== true);

  return (
    <View className="px-3 pb-6 pt-2">
      <CourseExerciseHeading
        title={readString(content.title) ?? t("flow.ui.categoryEngine.checkpoint.summaryTitleFallback")}
        instruction={t("flow.ui.categoryEngine.checkpoint.summaryInstruction")}
      />
      <View className="mt-5 gap-4">
        <SummaryGroup title={t("flow.ui.categoryEngine.checkpoint.solidGroupTitle")} items={solid} solid />
        <SummaryGroup title={t("flow.ui.categoryEngine.checkpoint.revisitGroupTitle")} items={revisit} />
        <View className="mt-1 rounded-[18px] border border-[#EBDDC5] bg-[#FDF9F5] p-4">
          <Text className="happy-font-body text-[13.5px] leading-[21px] text-[#3F3A34]">
            {readString(
              revisit.length > 0 ? content.revisitMessage : content.solidMessage,
            ) ??
              (revisit.length > 0
                ? t("flow.ui.categoryEngine.checkpoint.revisitMessageFallback")
                : t("flow.ui.categoryEngine.checkpoint.solidMessageFallback"))}
          </Text>
        </View>
      </View>
    </View>
  );
}

function SummaryGroup({
  title,
  items,
  solid = false,
}: {
  title: string;
  items: CheckpointItem[];
  solid?: boolean;
}): React.JSX.Element | null {
  if (!items.length) return null;
  return (
    <View>
      <Text
        className={
          solid
            ? "happy-font-body-bold mb-2 text-[10.5px] tracking-[0.8px] text-[#29452A] uppercase"
            : "happy-font-body-bold mb-2 text-[10.5px] tracking-[0.8px] text-[#82796A] uppercase"
        }
      >
        {title}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {items.map((item) => (
          <View
            key={item.concept}
            className={
              solid
                ? "rounded-full border border-[#29452A]/20 bg-[#E1EAD9] px-3.5 py-1.5"
                : "rounded-full border border-[#D8C7AD] bg-[#EBDDC5] px-3.5 py-1.5"
            }
          >
            <Text className="happy-font-body-bold text-[13px] text-[#3F3A34]">
              {item.concept}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
