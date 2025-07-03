import { Router } from 'express';
import { ReferralController } from '../controllers/referral.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// @route   POST /api/v1/referrals
// @desc    Create a new referral
// @access  Private
router.post(
    '/',
    protect,
    ReferralController.createReferral
);

// @route   POST /api/v1/referrals/test-notification
// @desc    Test notification sending (for debugging)
// @access  Private
router.post(
    '/test-notification',
    protect,
    ReferralController.testNotification
);

export default router; 