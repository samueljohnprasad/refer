// ponytail: central configurable policy for course enrollment capacity
export interface EnrollmentPolicy {
  readonly MAX_IN_PROGRESS_COURSES: number;
}

export const ENROLLMENT_POLICY: EnrollmentPolicy = {
  MAX_IN_PROGRESS_COURSES: 3,
} as const;
