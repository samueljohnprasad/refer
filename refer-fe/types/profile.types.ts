export interface Profile {
  _id?: string;
  user: string;
  username: string;
  fullName?: string;
  headline?: string;
  summary?: string;
  experience?: string;
  skills?: string[];
  contactEmail?: string;
  location?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  privacySettings?: {
    showEmail: boolean;
    showLocation: boolean;
    showSocialLinks: boolean;
    isPublicProfile: boolean;
  };
  updatedAt?: Date;
  createdAt?: Date;
}

export interface ProfileFormData {
  username: string;
  fullName: string;
  headline: string;
  summary: string;
  experience: string;
  skills: string[];
  contactEmail: string;
  location: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    github: string;
    website: string;
  };
  privacySettings: {
    showEmail: boolean;
    showLocation: boolean;
    showSocialLinks: boolean;
    isPublicProfile: boolean;
  };
}

export enum ProfileViewMode {
  EDIT = 'edit',
  PUBLIC = 'public',
}
