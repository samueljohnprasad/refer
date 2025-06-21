import { Router } from "express";
import {
    getUserProfile,
    getProfileByUsername,
    updateProfile,
    checkUsernameAvailability,
} from "../controllers/profile.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { profileSchema } from "../validations/profile.validation";

const router = Router();

// Protected routes (require authentication)
router.get("/me", protect, getUserProfile);
router.put("/", protect, validate(profileSchema), updateProfile);
router.get("/username/:username/check", protect, checkUsernameAvailability);

// Public routes (no authentication required)
router.get("/username/:username", getProfileByUsername);

export default router;
