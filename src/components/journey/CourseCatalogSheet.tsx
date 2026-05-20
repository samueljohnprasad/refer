import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheet,
  Group,
  Host,
  RNHostView,
} from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";

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
  const accentColor = resolveCourseAccentColor(course.colorHex);

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
            borderColor: isSelected ? accentColor : "#D4D4D8",
            borderWidth: isSelected ? 3 : 2,
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
          <Text style={[styles.courseAvatarInitial, { color: accentColor }]}>
            {getCourseMonogram(course.title)}
          </Text>
        )}
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.courseCardTitle,
          { color: isSelected ? "#374151" : "#9CA3AF" },
        ]}
      >
        {course.title}
      </Text>

      {isEnrolled ? (
        <View style={[styles.statusBadge, { backgroundColor: `${accentColor}20` }]}>
          <Text style={[styles.statusBadgeText, { color: accentColor }]}>
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
  const accentColor = resolveCourseAccentColor(selectedCourse?.colorHex);

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
    <View style={[styles.sheetRoot, { paddingBottom: Math.max(insets.bottom, 20) }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerBlock}>
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
                <ActivityIndicator color="#1CB0F6" />
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
                  { borderColor: accentColor, backgroundColor: `${accentColor}14` },
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
                  <Text style={[styles.previewAvatarInitial, { color: accentColor }]}>
                    {getCourseMonogram(selectedCourse.title)}
                  </Text>
                )}
              </View>

              <View style={styles.previewHeaderCopy}>
                <Text style={styles.previewTitle}>{selectedCourse.title}</Text>
                <Text style={styles.previewDescription}>
                  {selectedCourse.description || "A guided journey you can start today."}
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
                  {preview ? formatEstimatedDuration(preview.estimatedMinutes) : "—"}
                </Text>
                <Text style={styles.metricLabel}>Time</Text>
              </View>
            </View>

            <View style={styles.previewSectionsHeader}>
              <Text style={styles.previewSectionsTitle}>Journey Preview</Text>
              <Text style={[styles.previewSectionsCaption, { color: accentColor }]}>
                {isSelectedCourseEnrolled ? "Already enrolled" : "Ready to enroll"}
              </Text>
            </View>

            {isPreviewLoading ? (
              <View style={styles.previewLoading}>
                <ActivityIndicator color={accentColor} />
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
                    accentColor={accentColor}
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
            backgroundColor: selectedCourse ? accentColor : "#D1D5DB",
            opacity: selectedCourse ? 1 : 0.7,
          },
        ]}
      >
        <Text style={styles.primaryButtonText}>{primaryButtonLabel}</Text>
      </Pressable>
    </View>
  );
}

export default function CourseCatalogSheet(
  props: CourseCatalogSheetProps,
): React.JSX.Element | null {
  if (!props.isPresented) {
    return null;
  }

  if (Platform.OS !== "ios") {
    return (
      <Modal
        transparent
        animationType="slide"
        visible={props.isPresented}
        onRequestClose={props.onClose}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={props.onClose} />
          <View style={styles.modalCard}>
            <CourseCatalogSheetContent {...props} />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Host style={StyleSheet.absoluteFill}>
      <BottomSheet
        isPresented={props.isPresented}
        onIsPresentedChange={(isPresented) => {
          if (!isPresented) {
            props.onClose();
          }
        }}
      >
        <Group
          modifiers={[
            presentationDetents(["large"]),
            presentationDragIndicator("visible"),
          ]}
        >
          <RNHostView>
            <CourseCatalogSheetContent {...props} />
          </RNHostView>
        </Group>
      </BottomSheet>
    </Host>
  );
}

const styles = StyleSheet.create({
  courseAvatar: {
    width: 92,
    height: 76,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  courseAvatarImage: {
    width: 46,
    height: 46,
    borderRadius: 14,
  },
  courseAvatarInitial: {
    fontFamily: "DINNextRoundedBold",
    fontSize: 30,
  },
  courseCard: {
    width: 108,
    alignItems: "center",
    gap: 6,
  },
  courseCardTitle: {
    fontFamily: "DINNextRoundedBold",
    fontSize: 16,
    textAlign: "center",
  },
  courseListContent: {
    paddingHorizontal: 20,
    gap: 14,
  },
  emptyState: {
    minHeight: 92,
    minWidth: 240,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyStateText: {
    color: "#94A3B8",
    fontFamily: "DINNextRoundedRegular",
    fontSize: 15,
    textAlign: "center",
  },
  headerBlock: {
    gap: 8,
    paddingHorizontal: 20,
  },
  metricCard: {
    flex: 1,
    minHeight: 82,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    gap: 4,
  },
  metricLabel: {
    color: "#94A3B8",
    fontFamily: "DINNextRoundedRegular",
    fontSize: 13,
  },
  metricRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricValue: {
    color: "#111827",
    fontFamily: "DINNextRoundedBold",
    fontSize: 18,
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  modalCard: {
    maxHeight: "90%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  previewAvatar: {
    width: 84,
    height: 84,
    borderRadius: 24,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  previewAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  previewAvatarInitial: {
    fontFamily: "DINNextRoundedBold",
    fontSize: 34,
  },
  previewCard: {
    gap: 20,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8FAFC",
    padding: 20,
    marginHorizontal: 20,
  },
  previewDescription: {
    color: "#64748B",
    fontFamily: "DINNextRoundedRegular",
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
    color: "#94A3B8",
    fontFamily: "DINNextRoundedRegular",
    fontSize: 14,
  },
  previewSectionsCaption: {
    fontFamily: "DINNextRoundedBold",
    fontSize: 14,
  },
  previewSectionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  previewSectionsTitle: {
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
    fontSize: 20,
  },
  previewTitle: {
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
    fontSize: 24,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
    fontSize: 18,
  },
  scrollContent: {
    gap: 22,
    paddingTop: 20,
    paddingBottom: 8,
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
    fontFamily: "DINNextRoundedBold",
    fontSize: 15,
  },
  sectionMeta: {
    color: "#64748B",
    fontFamily: "DINNextRoundedRegular",
    fontSize: 14,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    padding: 14,
  },
  sectionTitle: {
    color: "#111827",
    fontFamily: "DINNextRoundedBold",
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
    backgroundColor: "#FFFFFF",
  },
  sheetSubtitle: {
    color: "#64748B",
    fontFamily: "DINNextRoundedRegular",
    fontSize: 16,
    lineHeight: 23,
  },
  sheetTitle: {
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
    fontSize: 28,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontFamily: "DINNextRoundedBold",
    fontSize: 12,
  },
});
