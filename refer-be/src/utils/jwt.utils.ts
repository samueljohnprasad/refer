/**
 * JWT Utilities for authentication
 */
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { IUserDocument } from '../models/user.model';
import { logger } from './logger';

/**
 * Interface for custom token payload
 */
interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generates a JWT token for a user
 * @param user The user document
 * @returns A signed JWT token
 */
export const generateToken = (user: IUserDocument): string => {
  try {
    // Create payload with user information
    const userId = typeof user._id === 'string' ? user._id : user._id?.toString() || '';
    
    const payload = {
      id: userId,
      email: user.email,
      role: user.role
    };

    // Get JWT secret from environment variables
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development';
    
    // Manually handle the type compatibility issues with jsonwebtoken
    // This approach avoids TypeScript errors while still using the API correctly
    return jwt.sign(payload, secret);
  } catch (error) {
    logger.error('JWT token generation failed:', error);
    throw new Error('Failed to generate authentication token');
  }
};

/**
 * Verifies a JWT token and returns the decoded payload
 * @param token The JWT token to verify
 * @returns The decoded payload or null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development';
    const decoded = jwt.verify(token, secret);
    
    if (decoded && typeof decoded === 'object' && 'id' in decoded) {
      return decoded as TokenPayload;
    }
    return null;
  } catch (error) {
    logger.error('JWT token verification failed:', error);
    return null;
  }
};

/**
 * Extracts JWT token from authorization header
 * @param authHeader The authorization header
 * @returns The extracted token or null if not found
 */
export const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};
