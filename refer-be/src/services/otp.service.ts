import crypto from 'crypto';
import { logger } from '../utils/logger';

// In-memory store for OTPs (replace with Redis in production)
const otpStore = new Map<string, { otp: string; expiresAt: Date }>();

// OTP configuration
const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10, // OTP expires in 10 minutes
  ALLOWED_CHARS: '0123456789',
};

/**
 * Generate a random OTP
 */
export const generateOTP = (): string => {
  let otp = '';
  const { LENGTH, ALLOWED_CHARS } = OTP_CONFIG;
  
  for (let i = 0; i < LENGTH; i++) {
    const randomIndex = crypto.randomInt(0, ALLOWED_CHARS.length);
    otp += ALLOWED_CHARS[randomIndex];
  }
  
  return otp;
};

/**
 * Store OTP for verification
 */
export const storeOTP = (key: string, otp: string): void => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_CONFIG.EXPIRY_MINUTES);
  
  otpStore.set(key, {
    otp,
    expiresAt,
  });
  
  // Log for debugging (remove in production)
  logger.info(`OTP ${otp} stored for ${key}`);
};

/**
 * Verify OTP
 */
export const verifyOTP = (key: string, otp: string): boolean => {
  const stored = otpStore.get(key);
  
  if (!stored) {
    return false;
  }
  
  // Check if OTP matches and is not expired
  const isValid = stored.otp === otp && new Date() < stored.expiresAt;
  
  // Remove OTP after verification (one-time use)
  if (isValid) {
    otpStore.delete(key);
  }
  
  return isValid;
};

// Alias for backward compatibility
export const verifyStoredOTP = verifyOTP;

/**
 * Generate a unique key for OTP storage
 */
export const generateOTPKey = (type: 'email' | 'phone', value: string): string => {
  return `${type}:${value}`.toLowerCase();
};

// Cleanup expired OTPs periodically
setInterval(() => {
  const now = new Date();
  let cleaned = 0;
  
  otpStore.forEach((value, key) => {
    if (now > value.expiresAt) {
      otpStore.delete(key);
      cleaned++;
    }
  });
  
  if (cleaned > 0) {
    logger.info(`Cleaned up ${cleaned} expired OTPs`);
  }
}, 60 * 60 * 1000); // Run cleanup every hour
