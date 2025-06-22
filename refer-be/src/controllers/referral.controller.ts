import { Request, Response } from 'express';
import { JobService } from '../services/job.service';
import { sendPushNotification } from '../services/notification.service';
import User from '../models/user.model';

export class ReferralController {
  static createReferral = async (req: Request, res: Response) => {
    try {
      const { postId, message } = req.body;
      const referrerId = req.user.id;

      // 1. Fetch the job post to get the owner's ID
      const post = await JobService.getJobPostById(postId);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }
      const postOwnerId = post.user.toString();

      // 2. Fetch the referrer's user object to get their name
      const referrer = await User.findById(referrerId).select('username');
      if (!referrer) {
        return res.status(404).json({ success: false, message: 'Referrer not found' });
      }

      // TODO: Save the referral to the database

      // 3. Send a push notification to the post owner
      if (postOwnerId !== referrerId) { // Don't notify if referring own post
        const notificationTitle = 'You have a new referral!';
        const notificationBody = `${referrer.username} referred someone for your post: "${post.title}"`;
        await sendPushNotification(postOwnerId, notificationTitle, notificationBody, { postId });
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
} 