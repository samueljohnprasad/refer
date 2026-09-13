import type { Course } from '@/src/types/journeyV5';

export interface NextCourseRecommendation {
  isCompleted: boolean;
  nextCourse: Course | null;
  isAllCoursesCompleted: boolean;
}

export interface NextJourneyBridgeDockProps {
  /** The recommended next Course, or null if all courses completed */
  nextCourse: Course | null;
  /** Flag indicating all published courses have been completed */
  isAllCoursesCompleted: boolean;
  /** Whether the start action is in-flight */
  isLoading?: boolean;
  /** Triggered when the user taps "Start [Next Course]" */
  onStartNextCourse: (courseId: string) => void;
  /** Triggered when user taps "Browse all courses" */
  onBrowseCatalog: () => void;
  /** Title of the course just completed */
  currentCourseTitle?: string;
  /** Message acknowledging course completion */
  completionMessage?: string;
}
