import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Profile, { IProfile } from '../models/profile.model';
import User from '../models/user.model';

/**
 * Get profile information for the current logged-in user
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('user getUserProfile', req.user);
    const profile = await Profile.findOne({ user: req.user?._id });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get profile by username (for public view)
 */
export const getProfileByUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    
    const profile = await Profile.findOne({ username: username.toLowerCase() });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
      return;
    }



    // Filter private information based on privacy settings
    const publicProfile = {
      headline: profile.headline,
      summary: profile.summary,
      skills: profile.skills,
      experience: profile.experience,
      location: profile.privacySettings?.showLocation ? profile.location : undefined,
      socialLinks: profile.privacySettings?.showSocialLinks ? profile.socialLinks : undefined,
    };

    res.status(200).json({
      success: true,
      data: publicProfile,
    });
  } catch (error) {
    console.error('Error getting profile by username:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Create or update user profile (Edit mode)
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const {
      username,
      headline,
      summary,
      experience,
      skills,
      location,
      socialLinks,
      privacySettings,
    } = req.body;

    // If username is being updated, check if it's already taken
    if (username) {
      const existingProfile = await User.findOne({
        username: username.toLowerCase(),
        user: { $ne: userId },
      });

      if (existingProfile) {
        res.status(400).json({
          success: false,
          message: 'Username is already taken',
        });
        return;
      }
    }

    // Update or create profile using findOneAndUpdate with upsert
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          headline,
          summary,
          experience,
          skills,
          location,
          socialLinks,
          privacySettings,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Check if a username is available
 */
export const checkUsernameAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const userId = req.user?._id;
    
    // Check if username exists, excluding the current user's profile
    const existingProfile = await Profile.findOne({
      username: username.toLowerCase(),
      user: { $ne: userId },
    });

    res.status(200).json({
      success: true,
      available: !existingProfile,
    });
  } catch (error) {
    console.error('Error checking username availability:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Add a push notification token to the user's profile
 */
export const addPushToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ success: false, message: 'Token is required' });
      return;
    }

    // Add the token to the user's pushTokens array if it doesn't already exist
    await User.findByIdAndUpdate(userId, {
      $addToSet: { pushTokens: token },
    });

    res.status(200).json({
      success: true,
      message: 'Push token saved successfully',
    });
  } catch (error) {
    console.error('Error adding push token:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
