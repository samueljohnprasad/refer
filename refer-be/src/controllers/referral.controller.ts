import { Request, Response } from 'express';
import { JobSeekerPostService } from '../services/jobSeekerPost.service';
import { sendPushNotification } from '../services/notification.service';
import User from '../models/user.model';

export class ReferralController {
  static createReferral = async (req: Request, res: Response): Promise<void> => {
    try {
      const { postId, message } = req.body;
      const referrerId = req.user.id;

      if (!postId || !message) {
        res.status(400).json({ 
          success: false, 
          message: 'postId and message are required' 
        });
        return;
      }

      // 1. Fetch the job seeker post to get the owner's ID
      const post = await JobSeekerPostService.getJobSeekerPostById(postId);
      if (!post) {
        res.status(404).json({ success: false, message: 'Job seeker post not found' });
        return;
      }
      const postOwnerId = post.user.toString();

      // 2. Fetch the referrer's user object to get their name
      const referrer = await User.findById(referrerId).select('firstName lastName');
      if (!referrer) {
        res.status(404).json({ success: false, message: 'Referrer not found' });
        return;
      }

      // TODO: Save the referral to the database

      // 3. Send a push notification to the post owner
      if (postOwnerId !== referrerId) { // Don't notify if referring own post
        const referrerName = `${referrer.firstName} ${referrer.lastName}`;
        const notificationTitle = 'You have a new referral!';
        const notificationBody = `${referrerName} referred someone for your post: "${post.title}"`;
        
        try {
          await sendPushNotification(postOwnerId, notificationTitle, notificationBody, { postId });
        } catch (notificationError) {
          console.error('Failed to send push notification:', notificationError);
          // Don't fail the entire request if notification fails
        }
      }

      res.status(201).json({
        success: true,
        data: {
          postId,
          referrerId,
          message,
          status: 'pending',
        },
      });
    } catch (error) {
      console.error('Failed to create referral:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create referral',
      });
    }
  };

  // Test endpoint for notification debugging
  static testNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, title, body } = req.body;
      
      if (!userId || !title || !body) {
        res.status(400).json({ 
          success: false, 
          message: 'userId, title, and body are required' 
        });
        return;
      }

      console.log('🧪 Testing notification for user:', userId);
      console.log('📢 Title:', title);
      console.log('📝 Body:', body);

      await sendPushNotification(userId, title, body, { test: true });

      res.status(200).json({
        success: true,
        message: 'Test notification sent (check backend logs)',
      });
    } catch (error) {
      console.error('Failed to send test notification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send test notification',
      });
    }
  };
} 