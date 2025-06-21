/**
 * Authentication related types for the application
 */

export type UserRole = 'job_seeker' | 'referrer' | 'both' | 'mentor' | 'mentee';

export interface AuthFormValues {
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
  otp?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  profilePrivacy: {
    isPublic: boolean;
    showContact: boolean;
    showResume: boolean;
  };
}
