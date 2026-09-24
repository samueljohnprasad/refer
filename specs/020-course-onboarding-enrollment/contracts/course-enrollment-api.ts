/**
 * Contract: Course Enrollment & Lifecycle API
 * Defines client/server boundary for starting, querying, and unenrolling from courses.
 */

export interface StartCourseArgs {
  courseId: string;
}

export interface StartCourseResponse {
  courseProgressId: string;
  firstNodeId: string;
  alreadyStarted: boolean;
}

export interface UnenrollCourseArgs {
  courseId: string;
}

export interface UnenrollCourseResponse {
  success: boolean;
  courseId: string;
  previousStatus: "in_progress";
}

export interface CourseCapacityErrorResponse {
  error: string;
  code: "MAX_ACTIVE_COURSES_REACHED";
  currentActiveCount: number;
  maxAllowed: number;
}

export interface UnenrollForbiddenErrorResponse {
  error: string;
  code: "UNENROLL_NOT_ALLOWED";
  reason: "COURSE_COMPLETED" | "NOT_ENROLLED";
}

/**
 * Backend RPC / Endpoint Contract
 */
export interface CourseEnrollmentService {
  /**
   * Starts or enrolls in a course. Rejects with 400 if user has >= MAX_IN_PROGRESS_COURSES.
   */
  startCourse(args: StartCourseArgs): Promise<StartCourseResponse>;

  /**
   * Drops an in-progress course. Rejects if course is completed or not enrolled.
   */
  unenrollCourse(args: UnenrollCourseArgs): Promise<UnenrollCourseResponse>;
}
