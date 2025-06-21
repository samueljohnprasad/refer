import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Jobs
 *     description: Job postings and management
 */

/**
 * @openapi
 * /jobs/public:
 *   get:
 *     summary: Get public job listings
 *     description: Retrieves a paginated list of active job posts that are visible to the public
 *     tags: [Jobs]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter jobs by title or description
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter jobs by location
 *     responses:
 *       200:
 *         description: List of public job posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedJobResponse'
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Server error
 */
router.get('/public', ...JobController.getPublicJobPosts);

/**
 * @openapi
 * /jobs/{id}:
 *   get:
 *     summary: Get job post by ID
 *     description: Retrieves a single job post by its ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Job post ID
 *     responses:
 *       200:
 *         description: Job post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/JobPost'
 *       404:
 *         description: Job post not found
 *       500:
 *         description: Server error
 */
router.get('/:id', ...(Array.isArray(JobController.getJobPostById) ? JobController.getJobPostById : [JobController.getJobPostById]));

/**
 * @openapi
 * /jobs/company/{companyId}:
 *   get:
 *     summary: Get jobs by company
 *     description: Retrieves a list of job posts for a specific company
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Company jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedJobResponse'
 *       400:
 *         description: Invalid company ID or query parameters
 *       500:
 *         description: Server error
 */
router.get('/company/:companyId', ...JobController.getJobsByCompany);

// Protected routes (require authentication)
router.use(authenticate);

/**
 * @openapi
 * /jobs:
 *   post:
 *     summary: Create a new job post
 *     description: Creates a new job posting (requires authentication)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobRequest'
 *     responses:
 *       201:
 *         description: Job post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/JobPost'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Server error
 */
router.post('/', ...JobController.createJobPost);

/**
 * @openapi
 * /jobs/{id}:
 *   put:
 *     summary: Update a job post
 *     description: Updates an existing job post (must be the owner or admin)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Job post ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateJobRequest'
 *     responses:
 *       200:
 *         description: Job post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/JobPost'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Not the owner of the job post
 *       404:
 *         description: Job post not found
 *       500:
 *         description: Server error
 */
router.put('/:id', ...JobController.updateJobPost);

export default router;
