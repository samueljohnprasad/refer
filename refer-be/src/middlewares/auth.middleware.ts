import { Request, Response, NextFunction } from 'express';
import { extractToken, verifyToken } from '../utils/jwt.utils';
import User from '../models/user.model';
import { AppError } from './error.middleware';
import { UserRole } from '../types/user.types';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to protect routes - require authentication
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from authorization header
    const token = extractToken(req.headers.authorization);
    
    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return next(new AppError('Not authorized to access this route', 401));
    }
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    // Check if user is still active
    if (!user.isActive) {
      return next(new AppError('User account is deactivated', 401));
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Not authorized to access this route', 401));
  }
};

// Middleware to restrict routes based on user roles
export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authorized to access this route', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    
    next();
  };
};
