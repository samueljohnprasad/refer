import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// @route   GET /api/notifications
// @desc    Get all notifications for the current user
// @access  Private
router.get('/', protect, NotificationController.getNotifications);

// @route   POST /api/notifications/mark-read
// @desc    Mark all notifications as read
// @access  Private
router.post('/mark-read', protect, NotificationController.markAllAsRead);

export default router; 