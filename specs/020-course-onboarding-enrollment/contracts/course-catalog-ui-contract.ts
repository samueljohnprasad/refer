/**
 * UI Contract: Course Catalog & Overview Screen
 * Defines props, state, and interaction callbacks for course overview and unenroll flows.
 */

import type { CourseCatalogListItem } from "@/src/types/journeyV5";
import type { CourseOverview } from "@/src/domains/journey/model/courseOverview";

export interface CourseOverviewScreenProps {
  insets: { top: number; bottom: number };
  course: CourseCatalogListItem;
  overview: CourseOverview | null;
  isLoading: boolean;
  hasError: boolean;
  isEnrolled: boolean;
  isCompleted?: boolean;
  isStartingCourse: boolean;
  isUnenrolling?: boolean;
  enrollmentError: string | null;
  /** Whether the user has reached the max concurrent in-progress course limit */
  isAtCapacityLimit: boolean;
  /** Maximum allowed concurrent in-progress courses */
  maxCapacityLimit: number;
  /** Current number of active in-progress courses */
  currentInProgressCount: number;
  onBack: () => void;
  onClose: () => void;
  onRetry: () => void;
  onPrimaryActionPress: (courseId: string) => void;
  /** Triggered when user confirms unenrollment for an in-progress course */
  onUnenrollPress?: (courseId: string) => void;
}

export interface UnenrollConfirmationState {
  isOpen: boolean;
  courseId: string | null;
  courseTitle: string | null;
}
