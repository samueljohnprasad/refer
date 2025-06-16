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
router.post('/register', validate(registerSchema), register);
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
