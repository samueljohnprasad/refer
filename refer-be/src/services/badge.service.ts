import User, { IUserDocument } from '../models/user.model';
import { BadgeType } from '../types/user.types';
import { logger } from '../utils/logger';

/**
 * Service for managing user badges
 */
export class BadgeService {
  /**
   * Assign a badge to a user if they don't already have it
   * @param userId The user ID
   * @param badgeType The badge type to assign
   * @returns The updated user document or null if user not found
   */
  static async assignBadge(userId: string, badgeType: BadgeType): Promise<IUserDocument | null> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return null;
      }
      
      // Check if user already has this badge
      if (!user.badges.includes(badgeType)) {
        user.badges.push(badgeType);
        await user.save();
        logger.info(`Badge ${badgeType} assigned to user ${userId}`);
      }
      
      return user;
    } catch (error) {
      logger.error(`Error assigning badge ${badgeType} to user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a badge from a user
   * @param userId The user ID
   * @param badgeType The badge type to remove
   * @returns The updated user document or null if user not found
   */
  static async removeBadge(userId: string, badgeType: BadgeType): Promise<IUserDocument | null> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return null;
      }
      
      // Remove the badge if user has it
      const badgeIndex = user.badges.indexOf(badgeType);
      if (badgeIndex !== -1) {
        user.badges.splice(badgeIndex, 1);
        await user.save();
        logger.info(`Badge ${badgeType} removed from user ${userId}`);
      }
      
      return user;
    } catch (error) {
      logger.error(`Error removing badge ${badgeType} from user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Verify if a user has a specific badge
   * @param userId The user ID
   * @param badgeType The badge type to check
   * @returns Boolean indicating if user has the badge, or null if user not found
   */
  static async hasBadge(userId: string, badgeType: BadgeType): Promise<boolean | null> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return null;
      }
      
      return user.badges.includes(badgeType);
    } catch (error) {
      logger.error(`Error checking if user ${userId} has badge ${badgeType}:`, error);
      throw error;
    }
  }

  /**
   * Automatically assign Verified Employee badge based on company email verification
   * @param userId The user ID
   * @returns True if badge was assigned, false otherwise
   */
  static async assignVerifiedEmployeeBadge(userId: string): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      
      if (!user || !user.isCompanyEmailVerified) {
        return false;
      }
      
      await this.assignBadge(userId, BadgeType.VERIFIED_EMPLOYEE);
      return true;
    } catch (error) {
      logger.error(`Error assigning Verified Employee badge to user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Assign Super Referrer badge based on successful referrals count
   * This is a placeholder implementation - in a real app, you would need to
   * track actual successful referrals and set appropriate thresholds
   * @param userId The user ID
   * @param successfulReferralsCount Number of successful referrals
   * @returns True if badge was assigned, false otherwise
   */
  static async checkAndAssignSuperReferrerBadge(
    userId: string, 
    successfulReferralsCount: number
  ): Promise<boolean> {
    try {
      // Threshold for Super Referrer badge (e.g., 5 successful referrals)
      const SUPER_REFERRER_THRESHOLD = 5;
      
      if (successfulReferralsCount >= SUPER_REFERRER_THRESHOLD) {
        await this.assignBadge(userId, BadgeType.SUPER_REFERRER);
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error(`Error checking/assigning Super Referrer badge to user ${userId}:`, error);
      return false;
    }
  }
}
