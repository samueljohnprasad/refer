import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';
import { generateOTP, storeOTP, generateOTPKey, verifyStoredOTP } from './otp.service';

// Validate email is a Gmail address
const isValidGmail = (email: string): boolean => {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return gmailRegex.test(email);
};

// Configure Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Only for development, remove in production with valid certificate
  }
});

// Test the transporter connection
transporter.verify((error) => {
  if (error) {
    logger.error('Error connecting to Gmail SMTP:', error);
  } else {
    logger.info('Connected to Gmail SMTP server');
  }
});

/**
 * Send OTP to Gmail
 */
export const sendOTPEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
  // Validate Gmail address
  if (!isValidGmail(email)) {
    logger.error(`Invalid Gmail address: ${email}`);
    return {
      success: false,
      message: 'Only Gmail addresses are supported for email verification',
    };
  }

  try {
    const otp = generateOTP();
    const otpKey = generateOTPKey('email', email);
    
    // Store OTP for verification
    storeOTP(otpKey, otp);
    
    const mailOptions = {
      from: `"ReferNet" <${process.env.EMAIL_FROM || 'noreply@refernet.com'}>`,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <div style="
            background: #f4f4f4;
            padding: 10px 20px;
            font-size: 24px;
            letter-spacing: 5px;
            display: inline-block;
            margin: 10px 0;
            border-radius: 4px;
          ">${otp}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    logger.info(`OTP sent to ${email}`, { messageId: info.messageId });
    
    return {
      success: true,
      message: 'Verification code sent to your Gmail',
    };
  } catch (error) {
    logger.error('Error sending OTP email:', error);
    return {
      success: false,
      message: 'Failed to send verification code',
    };
  }
};

/**
 * Verify email OTP
 */
export const verifyEmailOTP = (email: string, otp: string): boolean => {
  const otpKey = generateOTPKey('email', email);
  const isValid = verifyStoredOTP(otpKey, otp);
  return isValid;
};
