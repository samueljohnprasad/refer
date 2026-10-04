import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readString } from "@/src/components/exercise/courseExerciseContent";

export function CourseCheckpointIntro({
  content,
}: {
  content: Record<string, unknown>;
}): React.JSX.Element {
  const { t } = useTranslation("exercises");
  const title =
    readString(content.title) ??
    t("flow.ui.categoryEngine.checkpoint.introTitleFallback");
  const introTitle =
    readString(content.introTitle) ??
    t("flow.ui.categoryEngine.checkpoint.introHeadingFallback");
  const intro =
    readString(content.intro) ??
    t("flow.ui.categoryEngine.checkpoint.introBodyFallback");
  const tag =
    readString(content.introTag) ??
    t("flow.ui.categoryEngine.checkpoint.introTagFallback");

  return (
    <View className="items-center px-3 pb-6 pt-2">
      <CourseExerciseHeading title={title} />
      <Animated.View entering={FadeIn} className="mt-6 w-full items-center">
        <View className="w-full items-center rounded-[22px] border border-[#EBDDC5] bg-[#FDF9F5] p-5">
          <Text className="happy-font-heading-bold mb-2.5 text-center text-[20px] text-[#29452A]">
            {introTitle}
          </Text>
          <Text className="happy-font-body mb-5 text-center text-[14.5px] leading-[22px] text-[#3F3A34]">
            {intro}
          </Text>
          <View className="rounded-full bg-[#EBDDC5] px-3.5 py-1.5">
            <Text className="happy-font-body-bold text-[10.5px] tracking-[0.8px] text-[#5C5346] uppercase">
              {tag}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
