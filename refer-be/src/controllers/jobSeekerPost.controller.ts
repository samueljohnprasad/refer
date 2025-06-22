import { Request, Response } from 'express';
import { JobSeekerPostService } from '../services/jobSeekerPost.service';
import { validate } from '../middlewares/validate';
import { 
  createJobSeekerPostSchema, 
  updateJobSeekerPostSchema, 
  jobSeekerPostQuerySchema 
} from '../validations/jobSeekerPost.validation';
import { JobSeekerPostQueryParams } from '../types/jobSeekerPost.types';

export class JobSeekerPostController {
  /**
   * @route   POST /job-seeker-posts
   * @desc    Create a new job seeker post
   * @access  Private
   */
  static createJobSeekerPost = [
    validate(createJobSeekerPostSchema),
    async (req: Request, res: Response) => {
      const userId = req.user.id;
      const post = await JobSeekerPostService.createJobSeekerPost(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: post,
      });
    },
  ];

  /**
   * @route   POST /job-seeker-posts/draft
   * @desc    Create a draft job seeker post
   * @access  Private
   */
  static createDraftJobSeekerPost = [
    validate(createJobSeekerPostSchema.fork(Object.keys(createJobSeekerPostSchema.describe().keys), (schema) => schema.optional())),
    async (req: Request, res: Response) => {
      const userId = req.user.id;
      const post = await JobSeekerPostService.createDraftJobSeekerPost(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: post,
      });
    },
  ];

  /**
   * @route   GET /job-seeker-posts
   * @desc    Get job seeker posts with pagination and filters
   * @access  Public/Private
   */
  static getJobSeekerPosts = [
    validate(jobSeekerPostQuerySchema, 'query'),
    async (req: Request, res: Response) => {
      const query = req.query as unknown as JobSeekerPostQueryParams;
      const userId = req.user?.id; // Optional, for getting user's own posts
      
      if (userId) {
        query.userId = userId;
      }
      
      const result = await JobSeekerPostService.getJobSeekerPosts(query);
      
      res.json({
        success: true,
        ...result,
      });
    },
  ];

  /**
   * @route   GET /job-seeker-posts/:id
   * @desc    Get a single job seeker post by ID
   * @access  Public/Private
   */
  static getJobSeekerPostById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id; // Optional
    
    const post = await JobSeekerPostService.getJobSeekerPostById(id, userId);
    
    res.json({
      success: true,
      data: post,
    });
  };

  /**
   * @route   PUT /job-seeker-posts/:id
   * @desc    Update a job seeker post
   * @access  Private
   */
  static updateJobSeekerPost = [
    validate(updateJobSeekerPostSchema),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const userId = req.user.id;
      
      const updatedPost = await JobSeekerPostService.updateJobSeekerPost(id, userId, req.body);
      
      res.json({
        success: true,
        data: updatedPost,
      });
    },
  ];

  /**
   * @route   DELETE /job-seeker-posts/:id
   * @desc    Delete a job seeker post
   * @access  Private
   */
  static deleteJobSeekerPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    await JobSeekerPostService.deleteJobSeekerPost(id, userId);
    
    res.json({
      success: true,
      message: 'Job seeker post deleted successfully',
    });
  };

  /**
   * @route   GET /job-seeker-posts/user/my-posts
   * @desc    Get current user's job seeker posts
   * @access  Private
   */
  static getUserJobSeekerPosts = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { status } = req.query;
    
    const posts = await JobSeekerPostService.getUserJobSeekerPosts(userId, status as string);
    
    res.json({
      success: true,
      data: posts,
    });
  };
} 