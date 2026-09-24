import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, ScrollView, Platform } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { CourseOutline } from "@/src/domains/journey/ui/components/CourseCatalogSheet/CourseOutline";
import {
  useGetCourseCatalogQuery,
  useGetCourseTreeQuery,
} from "@/src/domains/journey/data/journeyApi";
import { buildCourseOverview } from "@/src/domains/journey/model/courseOverview";
import { resolveCourseForMotivation } from "../utils/courseResolver";
import {
  PLAN_META,
  getWhyThisCourse,
  formatCount,
  resolveCourseSummary,
} from "../utils/planMeta";
import type { MotivationAnswer, StressLevel } from "../types";

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
  const insets = useSafeAreaInsets();
  const planMeta = PLAN_META[motivation];
  const displayPlanName = planName.replace(/\.$/, "");
  const contentTopPadding = Platform.OS === "ios" ? 100 : insets.top + 100;

  // ponytail: query catalog and course tree to show real full course outline
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
  // ponytail: use concise 'You’ll learn...' phrasing instead of syllabus objectives
  const courseDescription = resolveCourseSummary(
    overview?.description,
    planMeta.youWillLearn,
  );

  // ponytail: replace legacy days concept with sections, units, lessons & session pacing
  const hierarchyMeta = overview
    ? `${formatCount(overview.sectionCount, "section")} · ${formatCount(overview.unitCount, "unit")} · ${formatCount(overview.lessonCount, "lesson")} · ~5 min/lesson`
    : "Self-paced · ~5 min/lesson";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 120,
        paddingTop: contentTopPadding,
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <Animated.View entering={FadeIn.duration(160).delay(60)}>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-xs font-semibold uppercase tracking-wider text-sage-600"
        >
          Built around your goal
        </Text>
      </Animated.View>

      {/* Hero Course Card */}
      <Animated.View entering={FadeInDown.duration(220).delay(120)}>
        <LinearGradient
          colors={["#243e26", "#182c19"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginTop: 12,
            overflow: "hidden",
            borderRadius: 20,
            borderCurve: "continuous",
            paddingHorizontal: 22,
            paddingVertical: 24,
            borderWidth: 1,
            borderColor: "rgba(95, 127, 88, 0.25)",
          }}
        >
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.bold }}
            className="text-[26px] leading-[1.15] text-white"
          >
            {courseTitle}
          </Text>

          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.regular }}
            className="mt-2 text-[15px] leading-relaxed text-white/80"
          >
            {courseDescription}
          </Text>

          <View className="mt-5 flex-row items-center border-t border-white/10 pt-4">
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-xs font-semibold tracking-wide text-sage-200"
            >
              {hierarchyMeta}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Why This Course - Open content */}
      <Animated.View entering={FadeIn.duration(180).delay(220)} className="mt-7">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-xs font-semibold uppercase tracking-wider text-sage-600"
        >
          Why this course
        </Text>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.regular }}
          className="mt-2 text-[15px] leading-relaxed text-ink"
        >
          {getWhyThisCourse(motivation, stressLevel)}
        </Text>
      </Animated.View>

      {/* Full Course Outline matching Course Catalog */}
      <Animated.View entering={FadeIn.duration(180).delay(280)} className="mt-7">
        <View className="mb-2 flex-row items-center justify-between">
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
            className="text-xs font-semibold uppercase tracking-wider text-sage-600"
          >
            Course outline
          </Text>
          {overview?.lessonCount ? (
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-xs text-sage-600"
            >
              {formatCount(overview.lessonCount, "lesson")}
            </Text>
          ) : null}
        </View>

        {isTreeLoading ? (
          <CourseOutlineSkeleton />
        ) : overview?.sections && overview.sections.length > 0 ? (
          <CourseOutline sections={overview.sections} />
        ) : (
          <View className="mt-3 gap-2.5">
            {planMeta.practiceItems.map((item, idx) => (
              <View key={idx} className="flex-row items-start gap-3">
                <View className="mt-2 h-1.5 w-1.5 rounded-full bg-sage-500" />
                <Text
                  style={{ fontFamily: APP_FONT_FAMILIES.regular }}
                  className="flex-1 text-[15px] leading-relaxed text-ink"
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
};

function CourseOutlineSkeleton(): React.JSX.Element {
  return (
    <View className="mt-2 gap-4 py-2" accessibilityLabel="Loading course outline">
      {Array.from({ length: 3 }).map((_, index) => (
        <View
          key={index}
          className="flex-row items-center gap-3 border-b border-slate-100 py-3.5"
        >
          <Skeleton width={22} height={22} radius={6} />
          <View className="flex-1 gap-1.5">
            <Skeleton width="55%" height={16} radius={6} />
            <Skeleton width="35%" height={12} radius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

export default React.memo(PlanRevealStep);
