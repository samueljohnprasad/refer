import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { FullWindowOverlay } from "react-native-screens";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  useGetCourseCatalogQuery,
  useGetCourseTreeQuery,
  useStartCourseMutation,
} from "@/src/features/journey/journeyApi";
import { buildCourseJourneyPreview } from "@/src/features/journey/courseCatalogPreview";
import type {
  CourseCatalogListItem,
  CourseJourneyPreviewSection,
  EnrolledCourseListItem,
} from "@/src/types/journeyV5";
import {
  getCourseMonogram,
  resolveCourseAccentColor,
} from "./courseVisuals";

const PALETTE = {
  cream: "#FAF6ED",
  warmWhite: "#FFFCF5",
  sage50: "#F4F1EA",
  sage100: "#E8E2D2",
  sage200: "#D4CCB5",
  sage300: "#A8B89A",
  sage500: "#5A7A56",
  sage600: "#3F5A3D",
  sage700: "#2A3F2A",
  ink: "#1A2A1A",
  inkSoft: "#4A5A4A",
  inkMuted: "#7A8A7A",
} as const;

const FONTS = {
  body: "GeistRegular",
  bodyMedium: "GeistMedium",
  bodyBold: "GeistBold",
  heading: "FrauncesSemiBold",
} as const;

type CourseCatalogSheetProps = {
  isPresented: boolean;
  activeCourseId?: string | null;
  enrolledCourses?: EnrolledCourseListItem[];
  onClose: () => void;
  onCourseSelect?: (courseId: string) => void;
};

type CourseCardProps = {
  course: CourseCatalogListItem;
  isSelected: boolean;
  isEnrolled: boolean;
  onPress: (courseId: string) => void;
};

type CoursePreviewSectionRowProps = {
  accentColor: string;
  section: CourseJourneyPreviewSection;
};

function resolveInitialCourseId(
  courses: CourseCatalogListItem[],
  enrolledCourseIds: Set<string>,
  activeCourseId?: string | null,
): string | null {
  if (courses.length === 0) {
    return null;
  }

  const firstNotEnrolledCourse = courses.find(
    (course) => !enrolledCourseIds.has(course.id),
  );
  if (firstNotEnrolledCourse) {
    return firstNotEnrolledCourse.id;
  }

  const activeCourse = courses.find((course) => course.id === activeCourseId);
  if (activeCourse) {
    return activeCourse.id;
  }

  return courses[0]?.id ?? null;
}

function formatEstimatedDuration(estimatedMinutes: number): string {
  if (estimatedMinutes < 60) {
    return `${estimatedMinutes} min`;
  }

  const totalHours = Math.round((estimatedMinutes / 60) * 10) / 10;
  return `${totalHours} hrs`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "error" in error) {
    const value = (error as { error?: unknown }).error;
    if (typeof value === "string") {
      return value;
    }
  }

  return "Something went wrong while opening this course.";
}

const CourseCard = React.memo(function CourseCard({
  course,
  isSelected,
  isEnrolled,
  onPress,
}: CourseCardProps): React.JSX.Element {
  const courseAccentColor = resolveCourseAccentColor(course.colorHex);

  return (
    <Pressable
      style={styles.courseCard}
      onPress={() => onPress(course.id)}
      accessibilityRole="button"
      accessibilityLabel={`Preview ${course.title}`}
    >
      <View
        style={[
          styles.courseAvatar,
          {
            backgroundColor: isSelected ? "#EEF2E8" : PALETTE.warmWhite,
            borderColor: isSelected ? PALETTE.sage500 : PALETTE.sage100,
            borderBottomColor: isSelected ? PALETTE.sage600 : PALETTE.sage100,
          },
        ]}
      >
        {course.iconUrl ? (
          <Image
            source={course.iconUrl}
            style={styles.courseAvatarImage}
            cachePolicy="memory-disk"
            contentFit="contain"
            transition={150}
          />
        ) : (
          <Text style={[styles.courseAvatarInitial, { color: courseAccentColor }]}>
            {getCourseMonogram(course.title)}
          </Text>
        )}
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.courseCardTitle,
          { color: isSelected ? PALETTE.sage700 : PALETTE.inkMuted },
        ]}
      >
        {course.title}
      </Text>

      {isEnrolled ? (
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            Enrolled
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
});

const CoursePreviewSectionRow = React.memo(function CoursePreviewSectionRow({
  accentColor,
  section,
}: CoursePreviewSectionRowProps): React.JSX.Element {
  return (
    <View style={styles.sectionRow}>
      <View style={[styles.sectionIndex, { backgroundColor: `${accentColor}1A` }]}>
        <Text style={[styles.sectionIndexText, { color: accentColor }]}>
          {section.orderIndex}
        </Text>
      </View>

      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionMeta}>
          {section.unitCount} units • {section.nodeCount} lessons
        </Text>
        <View style={styles.sectionTrack}>
          {Array.from({ length: Math.min(section.unitCount, 8) }).map((_, index) => (
            <View
              key={`${section.id}-${index}`}
              style={[styles.sectionTrackSegment, { backgroundColor: accentColor }]}
            />
          ))}
        </View>
      </View>
    </View>
  );
});

function CourseCatalogSheetContent({
  activeCourseId,
  enrolledCourses,
  isPresented,
  onClose,
  onCourseSelect,
}: CourseCatalogSheetProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const { data: catalogCourses = [], isFetching: isCatalogLoading } =
    useGetCourseCatalogQuery(undefined, {
      skip: !isPresented,
      refetchOnMountOrArgChange: true,
    });

  const enrolledCourseIds = useMemo(
    () => new Set((enrolledCourses ?? []).map((course) => course.id)),
    [enrolledCourses],
  );

  useEffect(() => {
    if (!isPresented || catalogCourses.length === 0) {
      return;
    }

    const selectedCourseStillExists = catalogCourses.some(
      (course) => course.id === selectedCourseId,
    );
    if (selectedCourseStillExists) {
      return;
    }

    setSelectedCourseId(
      resolveInitialCourseId(catalogCourses, enrolledCourseIds, activeCourseId),
    );
  }, [
    activeCourseId,
    catalogCourses,
    enrolledCourseIds,
    isPresented,
    selectedCourseId,
  ]);

  const selectedCourse =
    catalogCourses.find((course) => course.id === selectedCourseId) ?? null;

  const {
    data: selectedCourseTree,
    isFetching: isPreviewLoading,
    isError: isPreviewError,
  } = useGetCourseTreeQuery(selectedCourseId ?? "", {
    skip: !isPresented || !selectedCourseId,
  });

  const [startCourse, { isLoading: isStartingCourse }] = useStartCourseMutation();

  const preview =
    selectedCourseTree ? buildCourseJourneyPreview(selectedCourseTree) : null;

  const isSelectedCourseEnrolled = selectedCourse
    ? enrolledCourseIds.has(selectedCourse.id)
    : false;
  const courseAccentColor = resolveCourseAccentColor(selectedCourse?.colorHex);
  const interactionColor = PALETTE.sage500;

  const handleCoursePress = useCallback((courseId: string) => {
    setSelectedCourseId(courseId);
  }, []);

  const handlePrimaryActionPress = async () => {
    if (!selectedCourse) {
      return;
    }

    try {
      if (!isSelectedCourseEnrolled) {
        await startCourse(selectedCourse.id).unwrap();
      }

      onCourseSelect?.(selectedCourse.id);
      onClose();
    } catch (error) {
      Alert.alert("Unable to open course", getErrorMessage(error));
    }
  };

  const primaryButtonLabel = isSelectedCourseEnrolled
    ? "Open Journey"
    : isStartingCourse
      ? "Enrolling..."
      : "Enroll in Course";

  return (
    <View style={styles.modalScreen}>
      <View
        style={[
          styles.headerBar,
          { paddingTop: Math.max(insets.top, 16), paddingHorizontal: 20 },
        ]}
      >
        <View style={styles.headerBarSpacer} />
        <Pressable
          onPress={onClose}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Close journey explorer"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} color={PALETTE.sage600} />
        </Pressable>
      </View>

      <View
        style={[styles.sheetRoot, { paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>Find Your Next Path</Text>
            <Text style={styles.sheetTitle}>Explore Journeys</Text>
            <Text style={styles.sheetSubtitle}>
              Browse every published course, preview the path, and enroll when
              you are ready.
            </Text>
          </View>

          <FlatList
            horizontal
            data={catalogCourses}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.courseListContent}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <CourseCard
                course={item}
                isSelected={item.id === selectedCourseId}
                isEnrolled={enrolledCourseIds.has(item.id)}
                onPress={handleCoursePress}
              />
            )}
            ListEmptyComponent={
              isCatalogLoading ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator color={interactionColor} />
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    No published courses are available yet.
                  </Text>
                </View>
              )
            }
          />

          {selectedCourse ? (
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <View
                  style={[
                    styles.previewAvatar,
                    {
                      borderColor: PALETTE.sage500,
                      backgroundColor: "#EEF2E8",
                    },
                  ]}
                >
                  {selectedCourse.iconUrl ? (
                    <Image
                      source={selectedCourse.iconUrl}
                      style={styles.previewAvatarImage}
                      cachePolicy="memory-disk"
                      contentFit="contain"
                      transition={150}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.previewAvatarInitial,
                        { color: courseAccentColor },
                      ]}
                    >
                      {getCourseMonogram(selectedCourse.title)}
                    </Text>
                  )}
                </View>

                <View style={styles.previewHeaderCopy}>
                  <Text style={styles.previewTitle}>{selectedCourse.title}</Text>
                  <Text style={styles.previewDescription}>
                    {selectedCourse.description ||
                      "A guided journey you can start today."}
                  </Text>
                </View>
              </View>

              <View style={styles.metricRow}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>
                    {preview?.sectionCount ?? "—"}
                  </Text>
                  <Text style={styles.metricLabel}>Sections</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{preview?.unitCount ?? "—"}</Text>
                  <Text style={styles.metricLabel}>Units</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{preview?.nodeCount ?? "—"}</Text>
                  <Text style={styles.metricLabel}>Lessons</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>
                    {preview
                      ? formatEstimatedDuration(preview.estimatedMinutes)
                      : "—"}
                  </Text>
                  <Text style={styles.metricLabel}>Time</Text>
                </View>
              </View>

              <View style={styles.previewSectionsHeader}>
                <Text style={styles.previewSectionsTitle}>Journey Preview</Text>
                <Text
                  style={styles.previewSectionsCaption}
                >
                  {isSelectedCourseEnrolled ? "Already enrolled" : "Ready to enroll"}
                </Text>
              </View>

              {isPreviewLoading ? (
                <View style={styles.previewLoading}>
                  <ActivityIndicator color={interactionColor} />
                  <Text style={styles.previewLoadingText}>
                    Loading journey preview...
                  </Text>
                </View>
              ) : isPreviewError ? (
                <View style={styles.previewLoading}>
                  <Text style={styles.emptyStateText}>
                    Unable to load this course preview right now.
                  </Text>
                </View>
              ) : (
                <View style={styles.sectionsList}>
                  {preview?.sections.map((section) => (
                    <CoursePreviewSectionRow
                      key={section.id}
                      accentColor={interactionColor}
                      section={section}
                    />
                  ))}
                </View>
              )}
            </View>
          ) : null}
        </ScrollView>

        <Pressable
          disabled={!selectedCourse || isStartingCourse}
          onPress={handlePrimaryActionPress}
          style={[
            styles.primaryButton,
            {
              backgroundColor: selectedCourse
                ? PALETTE.sage500
                : PALETTE.sage200,
              borderBottomColor: selectedCourse
                ? PALETTE.sage700
                : PALETTE.sage300,
              opacity: selectedCourse ? 1 : 0.7,
            },
          ]}
        >
          <Text style={styles.primaryButtonText}>{primaryButtonLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function CourseCatalogSheet(
  props: CourseCatalogSheetProps,
): React.JSX.Element | null {
  const { height: windowHeight } = useWindowDimensions();
  const [isMounted, setIsMounted] = useState(props.isPresented);
  const translateY = useSharedValue(windowHeight);

  useEffect(() => {
    if (props.isPresented) {
      setIsMounted(true);
      translateY.value = windowHeight;
      translateY.value = withTiming(0, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    translateY.value = withTiming(
      windowHeight,
      {
        duration: 260,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(setIsMounted)(false);
        }
      },
    );
  }, [props.isPresented, translateY, windowHeight]);

  const handleClose = useCallback(() => {
    translateY.value = withTiming(
      windowHeight,
      {
        duration: 260,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(props.onClose)();
        }
      },
    );
  }, [props.onClose, translateY, windowHeight]);

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isMounted) {
    return null;
  }

  return (
    <FullWindowOverlay>
      <View style={styles.windowOverlayRoot}>
        <Animated.View style={[styles.windowOverlayRoot, animatedSheetStyle]}>
          <CourseCatalogSheetContent {...props} onClose={handleClose} />
        </Animated.View>
      </View>
    </FullWindowOverlay>
  );
}

const styles = StyleSheet.create({
  courseAvatar: {
    width: 92,
    height: 78,
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PALETTE.warmWhite,
  },
  courseAvatarImage: {
    width: 46,
    height: 46,
    borderRadius: 14,
  },
  courseAvatarInitial: {
    fontFamily: FONTS.heading,
    fontSize: 30,
  },
  courseCard: {
    width: 116,
    alignItems: "center",
    gap: 8,
  },
  courseCardTitle: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 15,
    textAlign: "center",
  },
  courseListContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  emptyState: {
    minHeight: 92,
    minWidth: 240,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyStateText: {
    color: PALETTE.inkMuted,
    fontFamily: FONTS.body,
    fontSize: 15,
    textAlign: "center",
  },
  eyebrow: {
    color: PALETTE.sage500,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: PALETTE.cream,
  },
  headerBarSpacer: {
    width: 44,
    height: 44,
  },
  headerBlock: {
    gap: 10,
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PALETTE.warmWhite,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: PALETTE.sage100,
    borderBottomColor: PALETTE.sage200,
  },
  metricCard: {
    flex: 1,
    minHeight: 82,
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: PALETTE.sage100,
    borderBottomColor: PALETTE.sage100,
    backgroundColor: PALETTE.warmWhite,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    gap: 4,
  },
  metricLabel: {
    color: PALETTE.inkMuted,
    fontFamily: FONTS.body,
    fontSize: 13,
  },
  metricRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricValue: {
    color: PALETTE.ink,
    fontFamily: FONTS.bodyBold,
    fontSize: 18,
    textAlign: "center",
  },
  modalScreen: {
    flex: 1,
    backgroundColor: PALETTE.cream,
  },
  previewAvatar: {
    width: 84,
    height: 84,
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  previewAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  previewAvatarInitial: {
    fontFamily: FONTS.heading,
    fontSize: 34,
  },
  previewCard: {
    gap: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: PALETTE.sage100,
    borderBottomColor: PALETTE.sage100,
    backgroundColor: PALETTE.warmWhite,
    padding: 20,
    marginHorizontal: 20,
  },
  previewDescription: {
    color: PALETTE.inkSoft,
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 22,
  },
  previewHeader: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  previewHeaderCopy: {
    flex: 1,
    gap: 6,
  },
  previewLoading: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  previewLoadingText: {
    color: PALETTE.inkMuted,
    fontFamily: FONTS.body,
    fontSize: 14,
  },
  previewSectionsCaption: {
    color: PALETTE.sage500,
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
  },
  previewSectionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  previewSectionsTitle: {
    color: PALETTE.ink,
    fontFamily: FONTS.heading,
    fontSize: 20,
  },
  previewTitle: {
    color: PALETTE.ink,
    fontFamily: FONTS.heading,
    fontSize: 30,
    lineHeight: 34,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 16,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 16,
  },
  primaryButtonText: {
    color: PALETTE.warmWhite,
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  scrollContent: {
    gap: 22,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionContent: {
    flex: 1,
    gap: 8,
  },
  sectionIndex: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  sectionIndexText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
  },
  sectionMeta: {
    color: PALETTE.inkSoft,
    fontFamily: FONTS.body,
    fontSize: 14,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    borderRadius: 16,
    backgroundColor: PALETTE.warmWhite,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: PALETTE.sage100,
    borderBottomColor: PALETTE.sage100,
    padding: 14,
  },
  sectionTitle: {
    color: PALETTE.ink,
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
  },
  sectionsList: {
    gap: 12,
  },
  sectionTrack: {
    flexDirection: "row",
    gap: 6,
  },
  sectionTrackSegment: {
    height: 8,
    flex: 1,
    borderRadius: 999,
    opacity: 0.22,
  },
  sheetRoot: {
    flex: 1,
    backgroundColor: PALETTE.cream,
  },
  sheetSubtitle: {
    color: PALETTE.inkSoft,
    fontFamily: FONTS.body,
    fontSize: 16,
    lineHeight: 23,
  },
  sheetTitle: {
    color: PALETTE.ink,
    fontFamily: FONTS.heading,
    fontSize: 34,
    lineHeight: 38,
  },
  statusBadge: {
    backgroundColor: PALETTE.sage100,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusBadgeText: {
    color: PALETTE.sage600,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  windowOverlayRoot: {
    ...StyleSheet.absoluteFillObject,
  },
});
