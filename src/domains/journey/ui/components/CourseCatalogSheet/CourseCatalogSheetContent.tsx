import React from "react";
import { FlatList, View } from "react-native";
import Animated, {
  Easing,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import type { CourseOverview } from "@/src/domains/journey/model/courseOverview";
import type { CourseCatalogListItem } from "@/src/types/journeyV5";
import { CourseCatalogList } from "./CourseCatalogList";
import { CourseOverviewScreen } from "./CourseOverviewScreen";

interface CourseCatalogModel {
  insets: { top: number; bottom: number };
  listRef: React.RefObject<FlatList<CourseCatalogListItem> | null>;
  catalogCourses: CourseCatalogListItem[];
  isCatalogLoading: boolean;
  enrolledCourseIds: Set<string>;
  selectedCourseId: string | null;
  selectedCourse: CourseCatalogListItem | null;
  courseOverview: CourseOverview | null;
  isCourseTreeLoading: boolean;
  hasCourseTreeError: boolean;
  isStartingCourse: boolean;
  enrollmentError: string | null;
}

interface CourseCatalogActions {
  handleCoursePress: (courseId: string) => void;
  handleCourseBack: () => void;
  handlePrimaryActionPress: (courseId: string) => void;
  retryCourseTree: () => void;
  onClose: () => void;
}

export function CourseCatalogSheetContent({
  model,
  actions,
}: {
  model: CourseCatalogModel;
  actions: CourseCatalogActions;
}): React.JSX.Element {
  const isReducedMotion = useReducedMotion();
  const hasOpenedCourse = React.useRef(false);
  const showsCourse = Boolean(model.selectedCourseId && model.selectedCourse);

  if (showsCourse) hasOpenedCourse.current = true;

  return (
    <View className="flex-1 overflow-hidden">
      {showsCourse && model.selectedCourse ? (
        <Animated.View
          key="course-overview"
          entering={
            isReducedMotion
              ? undefined
              : SlideInRight.duration(220).easing(Easing.out(Easing.cubic))
          }
          exiting={
            isReducedMotion
              ? undefined
              : SlideOutRight.duration(180).easing(Easing.in(Easing.cubic))
          }
          className="absolute inset-0"
        >
          <CourseOverviewScreen
            insets={model.insets}
            course={model.selectedCourse}
            overview={model.courseOverview}
            isLoading={model.isCourseTreeLoading}
            hasError={model.hasCourseTreeError}
            isEnrolled={model.enrolledCourseIds.has(model.selectedCourse.id)}
            isStartingCourse={model.isStartingCourse}
            enrollmentError={model.enrollmentError}
            onBack={actions.handleCourseBack}
            onClose={actions.onClose}
            onRetry={actions.retryCourseTree}
            onPrimaryActionPress={actions.handlePrimaryActionPress}
          />
        </Animated.View>
      ) : (
        <Animated.View
          key="course-catalog"
          entering={
            isReducedMotion || !hasOpenedCourse.current
              ? undefined
              : SlideInLeft.duration(220).easing(Easing.out(Easing.cubic))
          }
          exiting={
            isReducedMotion
              ? undefined
              : SlideOutLeft.duration(180).easing(Easing.in(Easing.cubic))
          }
          className="absolute inset-0"
        >
          <CourseCatalogList
            insets={model.insets}
            listRef={model.listRef}
            courses={model.catalogCourses}
            enrolledCourseIds={model.enrolledCourseIds}
            isLoading={model.isCatalogLoading}
            onCoursePress={actions.handleCoursePress}
            onClose={actions.onClose}
          />
        </Animated.View>
      )}
    </View>
  );
}
