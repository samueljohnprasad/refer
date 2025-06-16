import nodemailer, { Transporter } from 'nodemailer';
import { logger } from './logger';

// Configuration for nodemailer
let transporter: Transporter;

// Initialize email transporter
const initializeEmailService = () => {
  try {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    logger.info('Email service initialized');
  } catch (error) {
    logger.error('Failed to initialize email service', error);
  }
};

// Send email
export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    if (!transporter) {
      initializeEmailService();
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    return true;
  } catch (error) {
    logger.error('Failed to send email', error);
    return false;
  }
};

// Send verification email
export const sendVerificationEmail = async (email: string, token: string): Promise<boolean> => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  
  const html = `
    <h1>Welcome to ReferNet!</h1>
    <p>Please verify your email address by clicking on the link below:</p>
    <a href="${verificationLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>If you didn't create this account, please ignore this email.</p>
    <p>Thank you,</p>
    <p>The ReferNet Team</p>
  `;

  return await sendEmail(email, 'Verify Your Email - ReferNet', html);
};

// Send company verification email
export const sendCompanyVerificationEmail = async (email: string, token: string): Promise<boolean> => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-company?token=${token}`;
  
  const html = `
    <h1>Verify Your Company Email</h1>
    <p>Please verify your company email address by clicking on the link below:</p>
    <a href="${verificationLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Company Email</a>
    <p>This will add a verified badge to your profile, indicating that you are a verified employee of your company.</p>
    <p>If you didn't request this verification, please ignore this email.</p>
    <p>Thank you,</p>
    <p>The ReferNet Team</p>
  `;

  return await sendEmail(email, 'Verify Your Company Email - ReferNet', html);
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, token: string): Promise<boolean> => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  
  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset. Please click on the link below to set a new password:</p>
    <a href="${resetLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>If you didn't request a password reset, please ignore this email or contact support.</p>
    <p>Thank you,</p>
    <p>The ReferNet Team</p>
  `;

  return await sendEmail(email, 'Password Reset - ReferNet', html);
};
