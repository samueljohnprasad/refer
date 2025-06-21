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
  updatePrivacySettings,
  sendOTP,
  verifyOTP
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

/**
 * @openapi
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP to email or phone
 *     description: Sends a one-time password (OTP) to the provided email or phone number
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               phone:
 *                 type: string
 *                 description: User's phone number (for WhatsApp)
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification code sent successfully
 */
router.post('/send-otp', sendOTP);

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     description: Verifies the OTP sent to the user's email or phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               phone:
 *                 type: string
 *                 description: User's phone number (for WhatsApp)
 *               otp:
 *                 type: string
 *                 description: The OTP code to verify
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification successful
 *       400:
 *         description: Invalid OTP or request
 *       401:
 *         description: Invalid or expired OTP
 */
router.post('/verify-otp', verifyOTP);

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication and user management
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 */
router.post('/register', validate(registerSchema), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get JWT token
 *     description: Logs in a user with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', validate(loginSchema), login);

/**
 * @openapi
 * /auth/otp/request:
 *   post:
 *     summary: Request OTP for phone verification
 *     description: Sends an OTP to the provided phone number for verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OTPRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid phone number
 *       429:
 *         description: Too many OTP requests. Please try again later.
 *       500:
 *         description: Failed to send OTP
 */
router.post('/otp/request', validate(otpSchema), requestOtp);

/**
 * @openapi
 * /auth/otp/verify:
 *   post:
 *     summary: Verify OTP for phone verification
 *     description: Verifies the OTP sent to the user's phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OTPVerifyRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid OTP or request
 *       401:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Server error
 */
router.post('/otp/verify', validate(verifyOtpSchema), verifyOtp);

/**
 * @openapi
 * /auth/verify-email/{token}:
 *   get:
 *     summary: Verify user's email
 *     description: Verifies a user's email using the verification token sent to their email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: <h1>Email verified successfully</h1>
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
router.get('/verify-email/:token', verifyEmail);

/**
 * @openapi
 * /auth/verify-company/{token}:
 *   get:
 *     summary: Verify company email
 *     description: Verifies a user's company email using the verification token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Company email verification token
 *     responses:
 *       200:
 *         description: Company email verified successfully
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: <h1>Company email verified successfully</h1>
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
router.get('/verify-company/:token', verifyCompanyEmail);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid email
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to send reset email
 */
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password using the reset token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

// Protected routes - require authentication
router.use(protect);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get('/me', getCurrentUser);

/**
 * @openapi
 * /auth/role:
 *   put:
 *     summary: Update user role
 *     description: Updates the authenticated user's role
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleRequest'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid role or validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.put('/role', validate(updateRoleSchema), updateRole);

/**
 * @openapi
 * /auth/privacy:
 *   put:
 *     summary: Update privacy settings
 *     description: Updates the authenticated user's privacy settings
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrivacySettingsRequest'
 *     responses:
 *       200:
 *         description: Privacy settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.put('/privacy', validate(privacySettingsSchema), updatePrivacySettings);

export default router;
