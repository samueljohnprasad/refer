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

;

// Public routes (no authentication required)
router.get("/username/:username", getProfileByUsername);


// Protected routes (require authentication)
router.get("/me", protect, getUserProfile);
router.put("/", protect, validate(profileSchema), updateProfile);
router.get("/username/:username/check", protect, checkUsernameAvailability)

export default router;
