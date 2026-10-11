import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  useGetCourseCatalogQuery,
  useGetCourseTreeQuery,
} from "@/src/domains/journey/data/journeyApi";
import { buildCourseOverview } from "@/src/domains/journey/model/courseOverview";
import { getCourseImageSource } from "@/src/domains/journey/model/courseVisuals";
import { resolveCourseForMotivation } from "../utils/courseResolver";
import {
  PLAN_META,
  getWhyThisCourseKey,
  resolveCourseSummary,
} from "../utils/planMeta";
import type { MotivationAnswer, StressLevel } from "../types";
import { useTranslation } from "react-i18next";
import { useHeaderHeight } from "expo-router/react-navigation";
import { CourseOutlineSkeleton } from "../components/CourseOutlineSkeleton";
import {
  CourseHero,
  MilestoneRow,
  TailoredInsight,
  type Milestone,
} from "./PlanRevealSections";

interface PlanRevealStepProps {
  planName: string;
  motivation?: MotivationAnswer;
  stressLevel?: StressLevel;
}

const PlanRevealStep: React.FC<PlanRevealStepProps> = ({
  planName,
  motivation = "anxiety",
  stressLevel,
}) => {
  const { t } = useTranslation("onboarding");
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const planMeta = PLAN_META[motivation];
  const displayPlanName = planName.replace(/\.$/, "");

  const { data: catalogCourses = [] } = useGetCourseCatalogQuery();
  const resolvedCourseId = useMemo(
    () => resolveCourseForMotivation(motivation, catalogCourses),
    [motivation, catalogCourses],
  );
  const { data: courseTree, isLoading: isTreeLoading } = useGetCourseTreeQuery(
    resolvedCourseId ?? "",
    { skip: !resolvedCourseId },
  );

  const overview = useMemo(
    () => (courseTree ? buildCourseOverview(courseTree) : null),
    [courseTree],
  );
  const courseTitle = overview?.title ?? displayPlanName;
  const courseDescription = resolveCourseSummary(
    overview?.description,
    t(planMeta.summaryKey),
  );
  const mascotArt = getCourseImageSource(motivation);

  const milestones = useMemo<Milestone[]>(() => {
    if (overview?.sections && overview.sections.length > 0) {
      const phaseSubtitles = [
        t("plan_reveal.phase_subtitles.foundation"),
        t("plan_reveal.phase_subtitles.practice"),
        t("plan_reveal.phase_subtitles.integration"),
      ];
      return overview.sections.slice(0, 3).map((section, index) => ({
        title: section.title,
        subtitle:
          phaseSubtitles[index] ||
          t("plan_reveal.units", { count: section.units.length }),
      }));
    }

    return planMeta.practiceItemKeys.map((itemKey, index) => ({
      title: t(itemKey),
      subtitle:
        index === 0
          ? t("plan_reveal.phase_subtitles.initial")
          : index === 1
            ? t("plan_reveal.phase_subtitles.core")
            : t("plan_reveal.phase_subtitles.anchor"),
    }));
  }, [overview, planMeta, t]);

  const milestoneStatusKeys = [
    "plan_reveal.milestone_badges.start_here",
    "plan_reveal.milestone_badges.phase_2",
    "plan_reveal.milestone_badges.mastery",
  ] as const;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: Math.max(insets.bottom + 240, 280),
        paddingTop: Math.max(headerHeight - insets.top + 20, 72),
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <Animated.View entering={FadeInDown.duration(220).delay(120)}>
        <CourseHero
          title={courseTitle}
          description={courseDescription}
          mascotArt={mascotArt}
          paceLabel={t("plan_reveal.pace_per_day")}
          milestonesLabel={t("plan_reveal.milestones_count")}
          selfPacedLabel={t("plan_reveal.self_paced")}
          illustrationLabel={t("plan_reveal.course_illustration", {
            title: courseTitle,
          })}
        />
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(200)} className="mt-8">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
          className="text-[20px] leading-6 text-ink"
        >
          {t("plan_reveal.why_this_course")}
        </Text>
        <TailoredInsight
          label={t("plan_reveal.tailored_label")}
          body={t(getWhyThisCourseKey(motivation, stressLevel))}
        />
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(260)} className="mt-9">
        <View className="flex-row items-end justify-between">
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.bold }}
            className="text-[20px] leading-6 text-ink"
          >
            {t("plan_reveal.milestones_section")}
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
            className="text-[14px] leading-5 text-sage-600"
          >
            {t("plan_reveal.step_by_step")}
          </Text>
        </View>

        {isTreeLoading ? (
          <CourseOutlineSkeleton />
        ) : (
          <View className="relative mt-3">
            <View
              pointerEvents="none"
              className="absolute bottom-7 left-[18px] top-7 w-px bg-sage-200"
            />
            {milestones.map((milestone, index) => (
              <MilestoneRow
                key={`${milestone.title}-${index}`}
                index={index}
                milestone={milestone}
                statusLabel={t(
                  milestoneStatusKeys[index] ?? milestoneStatusKeys[2],
                )}
                isFirst={index === 0}
              />
            ))}
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(PlanRevealStep);
