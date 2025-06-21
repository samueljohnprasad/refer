import twilio from 'twilio';
import { logger } from '../utils/logger';
import { generateOTP, storeOTP, generateOTPKey, verifyOTP } from './otp.service';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const WHATSAPP_FROM = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

/**
 * Send OTP via WhatsApp
 */
export const sendWhatsAppOTP = async (phone: string): Promise<{ success: boolean; message: string }> => {
  try {
    const otp = generateOTP();
    const otpKey = generateOTPKey('phone', phone);
    
    // Store OTP for verification
    storeOTP(otpKey, otp);
    
    // Format phone number to E.164 format
    const to = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone.replace(/^\+?1?/, '')}`;
    
    await twilioClient.messages.create({
      body: `Your ReferNet verification code is: ${otp}. This code will expire in 10 minutes.`,
      from: WHATSAPP_FROM,
      to,
    });
    
    logger.info(`OTP sent to ${phone} via WhatsApp`);
    
    return {
      success: true,
      message: 'Verification code sent to your WhatsApp',
    };
  } catch (error) {
    logger.error('Error sending WhatsApp OTP:', error);
    return {
      success: false,
      message: 'Failed to send verification code to WhatsApp',
    };
  }
};

/**
 * Verify WhatsApp OTP
 */
export const verifyWhatsAppOTP = (phone: string, otp: string): boolean => {
  const otpKey = generateOTPKey('phone', phone);
  return verifyOTP(otpKey, otp);
};
