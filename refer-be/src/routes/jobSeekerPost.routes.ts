import { Router } from 'express';
import { JobSeekerPostController } from '../controllers/jobSeekerPost.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', JobSeekerPostController.getJobSeekerPosts);
router.get('/:id', JobSeekerPostController.getJobSeekerPostById);

// Protected routes
router.use(protect);

router.post('/', JobSeekerPostController.createJobSeekerPost);
router.post('/draft', JobSeekerPostController.createDraftJobSeekerPost);
router.put('/:id', JobSeekerPostController.updateJobSeekerPost);
router.delete('/:id', JobSeekerPostController.deleteJobSeekerPost);
router.get('/user/my-posts', JobSeekerPostController.getUserJobSeekerPosts);

export default router; 