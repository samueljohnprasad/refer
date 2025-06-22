import api from './api';

export interface JobSeekerPost {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  title: string;
  interestStatement: string;
  skills: string[];
  experience: string;
  education: string;
  resumeFile?: string;
  privacyOption: 'Public' | 'Private' | 'Anonymous';
  expiresAt: string;
  status: 'active' | 'expired' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobSeekerPostData {
  title: string;
  interestStatement: string;
  skills: string[];
  experience: string;
  education: string;
  resumeFile?: string;
  privacyOption: 'Public' | 'Private' | 'Anonymous';
  expiryDays: number;
}

export interface UpdateJobSeekerPostData {
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
}

class JobSeekerPostService {
  private baseUrl = '/job-seeker-posts';

  /**
   * Create a new job seeker post
   */
  async createJobSeekerPost(data: CreateJobSeekerPostData): Promise<JobSeekerPost> {
    const response = await api.post<{ data: JobSeekerPost }>(`${this.baseUrl}`, data);
    return response.data;
  }

  /**
   * Create a draft job seeker post
   */
  async createDraftJobSeekerPost(data: Partial<CreateJobSeekerPostData>): Promise<JobSeekerPost> {
    const response = await api.post<{ data: JobSeekerPost }>(`${this.baseUrl}/draft`, data);
    return response.data;
  }

  /**
   * Get job seeker posts with pagination and filters
   */
  async getJobSeekerPosts(params?: JobSeekerPostQueryParams): Promise<{
    posts: JobSeekerPost[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.privacyOption) queryParams.append('privacyOption', params.privacyOption);
    if (params?.skills) {
      params.skills.forEach(skill => queryParams.append('skills', skill));
    }

    const response = await api.get(`${this.baseUrl}?${queryParams.toString()}`);
    return response as any;
  }

  /**
   * Get a single job seeker post by ID
   */
  async getJobSeekerPostById(id: string): Promise<JobSeekerPost> {
    const response = await api.get<{ data: JobSeekerPost }>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update a job seeker post
   */
  async updateJobSeekerPost(id: string, data: UpdateJobSeekerPostData): Promise<JobSeekerPost> {
    const response = await api.put<{ data: JobSeekerPost }>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a job seeker post
   */
  async deleteJobSeekerPost(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Get current user's job seeker posts
   */
  async getUserJobSeekerPosts(status?: string): Promise<JobSeekerPost[]> {
    const queryParams = status ? `?status=${status}` : '';
    const response = await api.get<{ data: JobSeekerPost[] }>(`${this.baseUrl}/user/my-posts${queryParams}`);
    return response.data;
  }
}

export const jobSeekerPostService = new JobSeekerPostService(); 