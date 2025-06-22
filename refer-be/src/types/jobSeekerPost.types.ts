import { Document, Types } from 'mongoose';

export interface IJobSeekerPost extends Document {
  user: Types.ObjectId;
  title: string;
  interestStatement: string;
  skills: string[];
  experience: string;
  education: string;
  resumeFile?: string;
  privacyOption: 'Public' | 'Private' | 'Anonymous';
  expiresAt: Date;
  status: 'active' | 'expired' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobSeekerPostDto {
  title: string;
  interestStatement: string;
  skills: string[];
  experience: string;
  education: string;
  resumeFile?: string;
  privacyOption: 'Public' | 'Private' | 'Anonymous';
  expiryDays: number;
}

export interface UpdateJobSeekerPostDto {
  title?: string;
  interestStatement?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  resumeFile?: string;
  privacyOption?: 'Public' | 'Private' | 'Anonymous';
  status?: 'active' | 'expired' | 'draft';
}

export interface JobSeekerPostQueryParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'expired' | 'draft';
  privacyOption?: 'Public' | 'Private' | 'Anonymous';
  skills?: string[];
  userId?: string;
} 