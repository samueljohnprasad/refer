import express from 'express';
import { 
  register, 
  login, 
  verifyEmail, 
  verifyCompanyEmail,
  requestOtp,
  verifyOtp,
  forgotPassword, 
  resetPassword, 
  getCurrentUser,
  updateRole,
  updatePrivacySettings
} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { 
  registerSchema, 
  loginSchema, 
  otpSchema, 
  verifyOtpSchema,
  forgotPasswordSchema, 
  resetPasswordSchema, 
  updateRoleSchema,
  privacySettingsSchema 
} from '../utils/validation.schemas';

const router = express.Router();

// Public routes

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', validate(registerSchema), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), login);
router.post('/otp/request', validate(otpSchema), requestOtp);
router.post('/otp/verify', validate(verifyOtpSchema), verifyOtp);
router.get('/verify-email/:token', verifyEmail);
router.get('/verify-company/:token', verifyCompanyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

// Protected routes - require authentication
router.use(protect); // Apply authentication middleware to all routes below
router.get('/me', getCurrentUser);
router.put('/role', validate(updateRoleSchema), updateRole);
router.put('/privacy', validate(privacySettingsSchema), updatePrivacySettings);

export default router;
