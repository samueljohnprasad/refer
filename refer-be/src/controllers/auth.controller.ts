import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import User from '../models/user.model';
import { AppError } from '../middlewares/error.middleware';
import { generateToken } from '../utils/jwt.utils';
import { 
  sendVerificationEmail, 
  sendCompanyVerificationEmail, 
  sendPasswordResetEmail 
} from '../utils/email.utils';
import { BadgeType, UserRole } from '../types/user.types';
import { logger } from '../utils/logger';

// Helper function to generate random token
const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Register a new user with email and password
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone, company, companyEmail, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next(new AppError('User already exists with this email', 400));
      return;
    }

    // Generate verification token
    const verificationToken = generateRandomToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      company,
      companyEmail,
      role: role || UserRole.JOB_SEEKER,
      badges: [],
      verificationToken,
      verificationTokenExpiry,
      privacySettings: {
        profileVisibility: 'public',
        resumeVisibility: 'connections',
        contactInfoVisibility: 'private',
      },
      notificationSettings: {
        email: true,
        sms: false,
        whatsapp: false,
        referralUpdates: true,
        chatMessages: true,
        jobMatches: true,
        platformUpdates: true,
      },
    });
    console.log('User created:', user);

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // If company email is provided, send company verification email
    if (companyEmail) {
      const companyVerificationToken = generateRandomToken();
      user.verificationToken = companyVerificationToken;
      await user.save();
      await sendCompanyVerificationEmail(companyEmail, companyVerificationToken);
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user without sensitive fields
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

// Login with email and password
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new AppError('Invalid email or password', 401));
      return;
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      next(new AppError('Invalid email or password', 401));
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      next(new AppError('Your account has been deactivated', 401));
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          badges: user.badges,
        },
        token,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

// Verify email with token
export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.params;

    // Find user with verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Invalid or expired verification token', 400));
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    logger.error('Email verification error:', error);
    next(error);
  }
};

// Verify company email with token
export const verifyCompanyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.params;

    // Find user with verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Invalid or expired verification token', 400));
    }

    // Update user company verification status
    user.isCompanyEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    
    // Add VERIFIED_EMPLOYEE badge if it doesn't exist
    if (!user.badges.includes(BadgeType.VERIFIED_EMPLOYEE)) {
      user.badges.push(BadgeType.VERIFIED_EMPLOYEE);
    }
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Company email verified successfully. Verified Employee badge added.',
    });
  } catch (error) {
    logger.error('Company email verification error:', error);
    next(error);
  }
};

// Request OTP for login/signup
export const requestOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { phone } = req.body;

    // For now, simulate OTP generation (in real app, integrate with SMS service)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Check if user exists with this phone number
    const existingUser = await User.findOne({ phone });
    
    // Store OTP in the database or cache (for demo, we'll use a simple expiration)
    // In a real app, you would use Redis or similar for this
    
    logger.info(`OTP for ${phone}: ${otp}`); // For development only

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        isNewUser: !existingUser,
      },
    });
  } catch (error) {
    logger.error('OTP request error:', error);
    next(error);
  }
};

// Verify OTP and login/signup
export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { phone, otp, firstName, lastName, isNewUser } = req.body;

    // In a real app, validate the OTP against stored value
    // For demo, accept any 6-digit OTP
    if (!/^\d{6}$/.test(otp)) {
      next(new AppError('Invalid OTP', 400));
      return;
    }

    let user;
    
    // Find user or create new one
    if (isNewUser) {
      // Validate required fields for new user
      if (!firstName || !lastName) {
        next(new AppError('First name and last name are required for new users', 400));
        return;
      }
      
      user = await User.create({
        phone,
        firstName,
        lastName,
        role: UserRole.JOB_SEEKER,
        isVerified: true, // Phone numbers are inherently verified via OTP
        badges: [],
        privacySettings: {
          profileVisibility: 'public',
          resumeVisibility: 'connections',
          contactInfoVisibility: 'private',
        },
        notificationSettings: {
          email: false,
          sms: true,
          whatsapp: false,
          referralUpdates: true,
          chatMessages: true,
          jobMatches: true,
          platformUpdates: true,
        },
      });
    } else {
      user = await User.findOne({ phone });
      
      if (!user) {
        next(new AppError('User not found', 404));
        return;
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: isNewUser ? 'Registration successful' : 'Login successful',
      data: {
        user: {
          id: user._id,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          badges: user.badges,
        },
        token,
      },
    });
  } catch (error) {
    logger.error('OTP verification error:', error);
    next(error);
  }
};

// Request password reset
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal user existence for security
      res.status(200).json({
        success: true,
        message: 'If a user with this email exists, a password reset link has been sent.',
      });
      return;
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiry = undefined;
      await user.save();
      next(new AppError('Failed to send password reset email', 500));
      return;
    }

    res.status(200).json({
      success: true,
      message: 'If a user with this email exists, a password reset link has been sent.',
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    next(error);
  }
};

// Reset password with token
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password } = req.body;

    // Find user with reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      next(new AppError('Invalid or expired reset token', 400));
      return;
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. Please login with your new password.',
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Use req.user, which is populated by authenticate middleware from JWT token
    const user = req.user;
    console.log('user getCurrentUser', user);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          companyEmail: user.companyEmail,
          isCompanyEmailVerified: user.isCompanyEmailVerified,
          role: user.role,
          badges: user.badges,
          privacySettings: user.privacySettings,
          notificationSettings: user.notificationSettings,
          profilePicture: user.profilePicture,
          bio: user.bio,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    next(error);
  }
};

// Update user role
export const updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role } = req.body;

    // Check if role is valid
    if (!Object.values(UserRole).includes(role as UserRole)) {
      next(new AppError('Invalid role', 400));
      return;
    }

    // Update user role
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      next(new AppError('User not found', 404));
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        role: updatedUser.role,
      },
    });
  } catch (error) {
    logger.error('Update role error:', error);
    next(error);
  }
};

// Update privacy settings
export const updatePrivacySettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { profileVisibility, resumeVisibility, contactInfoVisibility } = req.body;

    // Update only provided fields
    const updateData: any = {};
    
    if (profileVisibility) {
      updateData['privacySettings.profileVisibility'] = profileVisibility;
    }
    
    if (resumeVisibility) {
      updateData['privacySettings.resumeVisibility'] = resumeVisibility;
    }
    
    if (contactInfoVisibility) {
      updateData['privacySettings.contactInfoVisibility'] = contactInfoVisibility;
    }

    // Update user privacy settings
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      next(new AppError('User not found', 404));
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Privacy settings updated successfully',
      data: {
        privacySettings: updatedUser.privacySettings,
      },
    });
  } catch (error) {
    logger.error('Update privacy settings error:', error);
    next(error);
  }
};
