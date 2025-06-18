import { Types } from 'mongoose';
import JobPost, { IJobPost } from '../models/jobPost.model';
import Company from '../models/company.model';
import { CreateJobPostDto, JobQueryParams, UpdateJobPostDto } from '../types/job.types';
import { NotFoundError, ForbiddenError } from '../utils/error';

type JobPostDocument = IJobPost & {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  company: Types.ObjectId;
  save(): Promise<JobPostDocument>;
};

export class JobService {
  /**
   * Create a new job post
   */
  static async createJobPost(userId: string, data: CreateJobPostDto): Promise<IJobPost> {
    // Verify company exists and user has access
    const company = await Company.findById(data.companyId);
    if (!company) {
      throw new NotFoundError('Company not found');
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (data.expiresInDays || 180));

    const jobPost = new JobPost({
      user: new Types.ObjectId(userId),
      company: company._id,
      title: data.title,
      description: data.description,
      isPublic: data.isPublic !== false, // default to true if not provided
      expiresAt,
      status: 'active',
    });

    await jobPost.save();
    return jobPost;
  }

  /**
   * Get public job posts with pagination and filtering
   */
  static async getPublicJobPosts(query: JobQueryParams) {
    const {
      page = 1,
      limit = 10,
      status = 'active',
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const filter: any = { isPublic: true };
    
    // Add status filter
    if (status === 'active') {
      filter.$or = [
        { status: 'active', expiresAt: { $gt: new Date() } },
        { status: 'active', expiresAt: { $exists: false } },
      ];
    } else {
      filter.status = status;
    }

    // Add search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      JobPost.find(filter)
        .populate('company', 'name logoUrl')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      JobPost.countDocuments(filter),
    ]);

    return {
      data: jobs,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  /**
   * Update a job post
   */
  static async updateJobPost(
    jobId: string,
    userId: string,
    data: UpdateJobPostDto
  ): Promise<JobPostDocument> {
    const job = await JobPost.findById(jobId);
    
    if (!job) {
      throw new NotFoundError('Job post not found');
    }

    // Check if user is the owner of the job post
    if (job.user.toString() !== userId) {
      throw new ForbiddenError('Not authorized to update this job post');
    }

    // Update fields
    if (data.title) job.title = data.title;
    if (data.description) job.description = data.description;
    if (typeof data.isPublic !== 'undefined') job.isPublic = data.isPublic;
    if (data.status) (job as any).status = data.status;

    // If status is being set to active and expiresAt is in the past, update it
    if (data.status === 'active' && job.expiresAt && job.expiresAt < new Date()) {
      const newExpiry = new Date();
      newExpiry.setMonth(newExpiry.getMonth() + 6); // Add 6 months
      job.expiresAt = newExpiry;
    }

    const updatedJob = await job.save();
    return updatedJob as unknown as JobPostDocument;
  }

  /**
   * Get job post by ID
   */
  static async getJobPostById(id: string): Promise<JobPostDocument> {
    const job = await JobPost.findById(id).populate<{ company: { name: string; logoUrl?: string } }>('company', 'name logoUrl');
    
    if (!job) {
      throw new NotFoundError('Job post not found');
    }
    
    return job as unknown as JobPostDocument;
  }

  /**
   * Close expired job posts
   */
  static async closeExpiredJobPosts(): Promise<number> {
    const result = await JobPost.updateMany(
      {
        status: 'active',
        expiresAt: { $lt: new Date() },
      },
      { $set: { status: 'expired' } }
    );
    
    return result.modifiedCount;
  }
}
