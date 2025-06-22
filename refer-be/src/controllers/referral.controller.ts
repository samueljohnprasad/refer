import { Request, Response } from 'express';

export class ReferralController {
  static createReferral = async (req: Request, res: Response) => {
    try {
      const { postId, message } = req.body;
      const referrerId = req.user.id;

      // TODO: Add validation for postId and message
      // TODO: Check if the post exists using JobService
      // TODO: Create referral in the database using a ReferralService

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
      res.status(500).json({
        success: false,
        error: 'Failed to create referral',
      });
    }
  };
} 