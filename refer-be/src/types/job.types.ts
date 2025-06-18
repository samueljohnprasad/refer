import { Document, Types } from 'mongoose';

export interface IJobPost extends Document {
  user: Types.ObjectId;
  company: Types.ObjectId;
  title: string;
  description: string;
  isPublic: boolean;
  expiresAt?: Date;
  status: 'active' | 'expired' | 'closed';
}

export interface CreateJobPostDto {
  title: string;
  description: string;
  companyId: string;
  isPublic?: boolean;
  expiresInDays?: number;
}

export interface UpdateJobPostDto {
  title?: string;
  description?: string;
  isPublic?: boolean;
  status?: 'active' | 'expired' | 'closed';
}

export interface JobQueryParams {
  page?: number;
  limit?: number;
  companyId?: string;
  status?: 'active' | 'expired' | 'closed';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
