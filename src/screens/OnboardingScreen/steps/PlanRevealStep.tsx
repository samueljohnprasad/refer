import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, ScrollView, Platform, Image } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SparklesIcon } from "@hugeicons/core-free-icons";
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
import { CourseOutlineSkeleton } from "../components/CourseOutlineSkeleton";

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
  const insets = useSafeAreaInsets();
  const planMeta = PLAN_META[motivation];
  const displayPlanName = planName.replace(/\.$/, "");
  const contentTopPadding = Platform.OS === "ios" ? 100 : insets.top + 100;

  // ponytail: query catalog and course tree to resolve actual course and visual asset
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

  // ponytail: Ahead/Finch benchmark - present 3 gentle milestones rather than dense 89-lesson syllabus
  const milestones = useMemo(() => {
    if (overview?.sections && overview.sections.length > 0) {
      const phaseSubtitles = [
        t("plan_reveal.phase_subtitles.foundation"),
        t("plan_reveal.phase_subtitles.practice"),
        t("plan_reveal.phase_subtitles.integration"),
      ];
      return overview.sections.slice(0, 3).map((section, idx) => ({
        title: section.title,
        subtitle: phaseSubtitles[idx] || t("plan_reveal.units", { count: section.units.length }),
      }));
    }
    return planMeta.practiceItemKeys.map((itemKey, idx) => ({
      title: t(itemKey),
      subtitle: idx === 0 ? t("plan_reveal.phase_subtitles.initial") : idx === 1 ? t("plan_reveal.phase_subtitles.core") : t("plan_reveal.phase_subtitles.anchor"),
    }));
  }, [overview, planMeta, t]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 140,
        paddingTop: contentTopPadding,
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      {/* Eyebrow */}
      <Animated.View entering={FadeIn.duration(160).delay(60)}>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
          className="text-[11px] font-bold uppercase tracking-wider text-sage-600"
        >
          {t("plan_reveal.step_label")}
        </Text>
      </Animated.View>

      {/* Hero Course Card - Luminous brand gradient with cute mascot art */}
      <Animated.View entering={FadeInDown.duration(220).delay(120)}>
        <LinearGradient
          // ponytail: uplifting forest emerald gradient replacing dark somber box
          colors={["#3D6536", "#2B4B25"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginTop: 12,
            overflow: "hidden",
            borderRadius: 24,
            paddingHorizontal: 20,
            paddingVertical: 22,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.15)",
          }}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
                className="text-[26px] leading-[32px] text-white happy-font-body-extrabold"
              >
                {courseTitle}
              </Text>
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.regular }}
                className="mt-2 text-[14px] leading-relaxed text-emerald-50/90 happy-font-body"
              >
                {courseDescription}
              </Text>
            </View>

            {mascotArt && (
              <Image
                source={mascotArt}
                className="h-20 w-20 -mr-1"
                resizeMode="contain"
                accessibilityLabel={t("plan_reveal.course_illustration", { title: courseTitle })}
              />
            )}
          </View>

          {/* Low-friction pacing badges - single row guaranteed */}
          <View className="mt-4 flex-row items-center justify-between border-t border-white/15 pt-3">
            <View className="rounded-full bg-white/20 px-2.5 py-1">
              <Text className="text-[11px] happy-font-body-bold text-white">
                ⏱ {t("plan_reveal.pace_per_day")}
              </Text>
            </View>
            <View className="rounded-full bg-white/20 px-2.5 py-1">
              <Text className="text-[11px] happy-font-body-bold text-white">
                🌱 {t("plan_reveal.milestones_count")}
              </Text>
            </View>
            <View className="rounded-full bg-white/20 px-2.5 py-1">
              <Text className="text-[11px] happy-font-body-bold text-white">
                ✨ {t("plan_reveal.self_paced")}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Why This Course - Personalized Insight Card */}
      <Animated.View entering={FadeIn.duration(180).delay(200)} className="mt-6">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
          className="text-[11px] font-bold uppercase tracking-wider text-sage-600 mb-2.5"
        >
          {t("plan_reveal.why_this_course")}
        </Text>
        <View className="rounded-2xl border border-sage-200/80 bg-white p-4 shadow-sm">
          <View className="flex-row items-start gap-3">
            <View className="h-8 w-8 items-center justify-center rounded-xl bg-sage-100">
              <HugeiconsIcon icon={SparklesIcon} size={18} color="#587C51" />
            </View>
            <View className="flex-1">
              <Text className="text-xs happy-font-body-bold text-sage-800 uppercase tracking-wide">
                {t("plan_reveal.tailored_label")}
              </Text>
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.regular }}
                className="mt-1 text-[14px] leading-relaxed text-ink-soft happy-font-body"
              >
                {t(getWhyThisCourseKey(motivation, stressLevel))}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* 3 Milestones Roadmap */}
      <Animated.View entering={FadeIn.duration(180).delay(260)} className="mt-6">
        <View className="mb-3 flex-row items-center justify-between">
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.bold }}
            className="text-[11px] font-bold uppercase tracking-wider text-sage-600"
          >
            {t("plan_reveal.milestones_section")}
          </Text>
          <Text className="text-xs happy-font-body-semibold text-sage-600">
            {t("plan_reveal.step_by_step")}
          </Text>
        </View>

        {isTreeLoading ? (
          <CourseOutlineSkeleton />
        ) : (
          <View className="gap-3">
            {milestones.map((milestone, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;

              return (
                <View
                  key={idx}
                  className={`flex-row items-start gap-3.5 rounded-2xl border p-4 ${
                    isFirst
                      ? "border-sage-300 bg-sage-50/70"
                      : "border-neutral-200/80 bg-white"
                  }`}
                >
                  {/* Step Number Badge */}
                  <View
                    className={`h-9 w-9 items-center justify-center rounded-full mt-0.5 ${
                      isFirst
                        ? "bg-sage-600"
                        : "bg-neutral-100 border border-neutral-200"
                    }`}
                  >
                    <Text
                      className={`text-sm happy-font-body-bold ${
                        isFirst ? "text-white" : "text-ink-muted"
                      }`}
                    >
                      {idx + 1}
                    </Text>
                  </View>

                  {/* Title & Badge */}
                  <View className="flex-1 pr-1">
                    <View className="flex-row items-start justify-between gap-2">
                      <Text
                        numberOfLines={2}
                        className="flex-1 text-[15px] leading-snug happy-font-body-bold text-ink"
                      >
                        {milestone.title}
                      </Text>
                      {isFirst ? (
                        <View className="rounded-full bg-emerald-100 px-2 py-0.5 mt-0.5">
                          <Text className="text-[10px] happy-font-body-bold text-emerald-800">
                            {t("plan_reveal.milestone_badges.start_here")}
                          </Text>
                        </View>
                      ) : isSecond ? (
                        <View className="rounded-full bg-neutral-100 px-2 py-0.5 mt-0.5">
                          <Text className="text-[10px] happy-font-body-semibold text-ink-muted">
                            {t("plan_reveal.milestone_badges.phase_2")}
                          </Text>
                        </View>
                      ) : (
                        <View className="rounded-full bg-sage-100 px-2 py-0.5 mt-0.5">
                          <Text className="text-[10px] happy-font-body-semibold text-sage-700">
                            {t("plan_reveal.milestone_badges.mastery")}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      numberOfLines={1}
                      className="mt-1 text-xs happy-font-body text-ink-muted"
                    >
                      {milestone.subtitle}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(PlanRevealStep);
