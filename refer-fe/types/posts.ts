import { User } from './User';

// This represents a post from a job seeker looking for a referral
export interface JobSeekerPost {
    _id?: string;
    user?: User;
    title?: string;
    interestStatement?: string;
    skills?: string[];
    workExperience?: {
        company?: string;
        role?: string;
        startDate?: Date;
        endDate?: Date;
    }[];
    education?: {
        institution?: string;
        degree?: string;
        fieldOfStudy?: string;
    }[];
    resumeUrl?: string;
    privacy?: 'public' | 'anonymous' | 'private';
    draft?: boolean;
    expiresAt?: string; // Changed to string to match backend
    createdAt?: string; // Changed to string to match backend
}

// This represents a post from someone offering a referral
export interface ReferrerPost {
    id: string; // Assuming a similar structure for now
    type: string;
    user: string; // Assuming simple string for now
    company: string;
    role: string;
    description: string;
    status: string;
    skills: string[];
    expiresAt: string; // Changed to string
    createdAt: string; // Changed to string
}

// A union type for any kind of post in the feed
export type Post = JobSeekerPost | ReferrerPost; 