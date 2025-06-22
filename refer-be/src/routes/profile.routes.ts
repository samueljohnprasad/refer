import { Router } from "express";
import {
    getUserProfile,
    getProfileByUsername,
    updateProfile,
    checkUsernameAvailability,
    addPushToken,
} from "../controllers/profile.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { profileSchema } from "../validations/profile.validation";

const router = Router();

// Public routes (no authentication required)
router.get("/username/:username", getProfileByUsername);

// Protected routes (require authentication)
router.get("/me", protect, getUserProfile);
router.put("/", protect, validate(profileSchema), updateProfile);
router.get("/username/:username/check", protect, checkUsernameAvailability);

// @route   POST /api/profiles/push-token
// @desc    Add a push notification token for the user
// @access  Private
router.post('/push-token', protect, addPushToken);

export default router;
