import { Types } from 'mongoose';
import JobSeekerPost, { IJobSeekerPost } from '../models/jobSeekerPost.model';
import { CreateJobSeekerPostDto, UpdateJobSeekerPostDto, JobSeekerPostQueryParams } from '../types/jobSeekerPost.types';
import { NotFoundError, ForbiddenError } from '../utils/error';

type JobSeekerPostDocument = IJobSeekerPost & {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  save(): Promise<JobSeekerPostDocument>;
};

export class JobSeekerPostService {
  /**
   * Create a new job seeker post
   */
  static async createJobSeekerPost(userId: string, data: CreateJobSeekerPostDto): Promise<IJobSeekerPost> {
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + data.expiryDays);

    const jobSeekerPost = new JobSeekerPost({
      user: new Types.ObjectId(userId),
      title: data.title,
      interestStatement: data.interestStatement,
      skills: data.skills,
      experience: data.experience || '',
      education: data.education || '',
      resumeFile: data.resumeFile || '',
      privacyOption: data.privacyOption,
      expiresAt,
      status: 'active',
    });

    await jobSeekerPost.save();
    return jobSeekerPost;
  }

  /**
   * Create a draft job seeker post
   */
  static async createDraftJobSeekerPost(userId: string, data: Partial<CreateJobSeekerPostDto>): Promise<IJobSeekerPost> {
    const jobSeekerPost = new JobSeekerPost({
      user: new Types.ObjectId(userId),
      title: data.title || '',
      interestStatement: data.interestStatement || '',
      skills: data.skills || [],
      experience: data.experience || '',
      education: data.education || '',
      resumeFile: data.resumeFile || '',
      privacyOption: data.privacyOption || 'Public',
      expiresAt: new Date(Date.now() + (data.expiryDays || 30) * 24 * 60 * 60 * 1000),
      status: 'draft',
    });

    await jobSeekerPost.save();
    return jobSeekerPost;
  }

  /**
   * Get job seeker posts with pagination and filters
   */
  static async getJobSeekerPosts(query: JobSeekerPostQueryParams) {
    try {
      console.log('getJobSeekerPosts called with query:', JSON.stringify(query, null, 2));
      
      const { page = 1, limit = 10, status, privacyOption, skills, userId } = query;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter: any = {};
      
      // Temporarily simplified filter for debugging
      // if (status) filter.status = status;
      // if (privacyOption) filter.privacyOption = privacyOption;
      // if (userId) filter.user = new Types.ObjectId(userId);
      
      // Only show public posts unless user is requesting their own posts
      // if (!userId) {
      //   filter.privacyOption = 'Public';
      //   filter.status = 'active';
      //   filter.expiresAt = { $gt: new Date() };
      // }

      // if (skills && skills.length > 0) {
      //   filter.skills = { $in: skills };
      // }

      console.log('Filter:', JSON.stringify(filter, null, 2));

      // First, let's check if there are any posts at all
      const totalPosts = await JobSeekerPost.countDocuments({});
      console.log('Total posts in database:', totalPosts);

      const posts = await JobSeekerPost.find(filter)
        // .populate('user', 'firstName lastName username') // Temporarily removed
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(); // Use lean() for better performance

      const total = await JobSeekerPost.countDocuments(filter);

      console.log(`Found ${posts.length} posts out of ${total} total`);

      return {
        posts,
        page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
      };
    } catch (error) {
      console.error('Error in getJobSeekerPosts:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  /**
   * Get a single job seeker post by ID
   */
  static async getJobSeekerPostById(postId: string, userId?: string): Promise<IJobSeekerPost> {
    const post = await JobSeekerPost.findById(postId).populate('user', 'firstName lastName username');
    
    if (!post) {
      throw new NotFoundError('Job seeker post not found');
    }

    // Check if user can view this post
    if (post.privacyOption === 'Private' && post.user._id.toString() !== userId) {
      throw new ForbiddenError('This post is private');
    }

    if (post.status === 'expired' && post.user._id.toString() !== userId) {
      throw new ForbiddenError('This post has expired');
    }

    return post;
  }

  /**
   * Update a job seeker post
   */
  static async updateJobSeekerPost(
    postId: string,
    userId: string,
    data: UpdateJobSeekerPostDto
  ): Promise<JobSeekerPostDocument> {
    const post = await JobSeekerPost.findById(postId);
    
    if (!post) {
      throw new NotFoundError('Job seeker post not found');
    }

    // Check if user is the owner of the post
    if (post.user.toString() !== userId) {
      throw new ForbiddenError('Not authorized to update this post');
    }

    // Update fields
    if (data.title !== undefined) post.title = data.title;
    if (data.interestStatement !== undefined) post.interestStatement = data.interestStatement;
    if (data.skills !== undefined) post.skills = data.skills;
    if (data.experience !== undefined) post.experience = data.experience;
    if (data.education !== undefined) post.education = data.education;
    if (data.resumeFile !== undefined) post.resumeFile = data.resumeFile;
    if (data.privacyOption !== undefined) post.privacyOption = data.privacyOption;
    if (data.status !== undefined) post.status = data.status;

    const updatedPost = await post.save();
    return updatedPost as unknown as JobSeekerPostDocument;
  }

  /**
   * Delete a job seeker post
   */
  static async deleteJobSeekerPost(postId: string, userId: string): Promise<void> {
    const post = await JobSeekerPost.findById(postId);
    
    if (!post) {
      throw new NotFoundError('Job seeker post not found');
    }

    // Check if user is the owner of the post
    if (post.user.toString() !== userId) {
      throw new ForbiddenError('Not authorized to delete this post');
    }

    await JobSeekerPost.findByIdAndDelete(postId);
  }

  /**
   * Get user's own job seeker posts
   */
  static async getUserJobSeekerPosts(userId: string, status?: string) {
    const filter: any = { user: new Types.ObjectId(userId) };
    if (status) filter.status = status;

    const posts = await JobSeekerPost.find(filter)
      .sort({ createdAt: -1 });

    return posts;
  }

  /**
   * Close expired job seeker posts
   */
  static async closeExpiredPosts(): Promise<number> {
    const result = await JobSeekerPost.updateMany(
      {
        status: 'active',
        expiresAt: { $lt: new Date() }
      },
      {
        status: 'expired'
      }
    );

    return result.modifiedCount;
  }
} 