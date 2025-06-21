import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/public', ...JobController.getPublicJobPosts);
router.get('/:id', ...(Array.isArray(JobController.getJobPostById) ? JobController.getJobPostById : [JobController.getJobPostById]));
router.get('/company/:companyId', ...JobController.getJobsByCompany);

// Protected routes (require authentication)
router.use(authenticate);
router.post('/', ...JobController.createJobPost);
router.put('/:id', ...JobController.updateJobPost);

export default router;
