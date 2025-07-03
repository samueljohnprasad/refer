import { Request, Response } from 'express';
import Notification from '../models/notification.model';

export class NotificationController {
  
  /**
   * Get all notifications for the logged-in user
   */
  static getNotifications = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      
      const notifications = await Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(50); // Limit to the 50 most recent notifications
      
      const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

      res.status(200).json({
        success: true,
        data: {
          notifications,
          unreadCount,
        },
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  /**
   * Mark all notifications as read for the logged-in user
   */
  static markAllAsRead = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      
      await Notification.updateMany(
        { user: userId, isRead: false },
        { $set: { isRead: true } }
      );

      res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
} 