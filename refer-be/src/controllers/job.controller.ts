import { Request, Response } from 'express';
import { JobService } from '../services/job.service';
import { validate } from '../middlewares/validate';
import { createJobPostSchema, jobQuerySchema, updateJobPostSchema } from '../validations/job.validation';
import { JobQueryParams } from '../types/job.types';

export class JobController {
  /**
   * @route   POST /jobs
   * @desc    Create a new job post
   * @access  Private
   */
  static createJobPost = [
    validate(createJobPostSchema),
    async (req: Request, res: Response) => {
      const userId = req.user.id; // Assuming user is attached by auth middleware
      const jobPost = await JobService.createJobPost(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: jobPost,
      });
    },
  ];

  /**
   * @route   GET /jobs/public
   * @desc    Get public job posts
   * @access  Public
   */
  static getPublicJobPosts = [
    validate(jobQuerySchema, 'query'),
    async (req: Request, res: Response) => {
      const query = req.query as unknown as JobQueryParams;
      const result = await JobService.getPublicJobPosts(query);
      
      res.json({
        success: true,
        ...result,
      });
    },
  ];

  /**
   * @route   PUT /jobs/:id
   * @desc    Update a job post
   * @access  Private
   */
  static updateJobPost = [
    validate(updateJobPostSchema),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const userId = req.user.id; // Assuming user is attached by auth middleware
      
      const updatedJob = await JobService.updateJobPost(id, userId, req.body);
      
      res.json({
        success: true,
        data: updatedJob,
      });
    },
  ];

  /**
   * @route   GET /jobs/company/:companyId
   * @desc    Get jobs by company
   * @access  Public
   */
  static getJobsByCompany = [
    validate(jobQuerySchema, 'query'),
    async (req: Request, res: Response) => {
      const { companyId } = req.params;
      const query = { ...req.query, companyId } as unknown as JobQueryParams;
      
      const result = await JobService.getPublicJobPosts(query);
      
      res.json({
        success: true,
        ...result,
      });
    },
  ];

  /**
   * @route   GET /jobs/:id
   * @desc    Get job post by ID
   * @access  Public
   */
  static getJobPostById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const job = await JobService.getJobPostById(id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job post not found',
      });
    }
    
    res.json({
      success: true,
      data: job,
    });
  };
}
