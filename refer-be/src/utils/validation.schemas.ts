import Joi from 'joi';
import { UserRole } from '../types/user.types';

// Register validation schema
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required',
  }),
  phone: Joi.string().allow('', null),
  company: Joi.string().allow('', null),
  companyEmail: Joi.string().email().allow('', null).messages({
    'string.email': 'Please provide a valid company email address',
  }),
  role: Joi.string().valid(...Object.values(UserRole)).default(UserRole.JOB_SEEKER),
});

// Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// OTP login/signup schema
export const otpSchema = Joi.object({
  phone: Joi.string().required().messages({
    'any.required': 'Phone number is required',
  }),
});

// Verify OTP schema
export const verifyOtpSchema = Joi.object({
  phone: Joi.string().required().messages({
    'any.required': 'Phone number is required',
  }),
  otp: Joi.string().length(6).required().messages({
    'string.length': 'OTP must be 6 characters long',
    'any.required': 'OTP is required',
  }),
  firstName: Joi.string().when('isNewUser', { 
    is: true, 
    then: Joi.required(),
    otherwise: Joi.allow('', null) 
  }),
  lastName: Joi.string().when('isNewUser', { 
    is: true, 
    then: Joi.required(),
    otherwise: Joi.allow('', null) 
  }),
  isNewUser: Joi.boolean().required(),
});

// Reset password validation schema
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

// Reset password validation schema
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Token is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
});

// Role update schema
export const updateRoleSchema = Joi.object({
  role: Joi.string().valid(...Object.values(UserRole)).required().messages({
    'any.only': 'Role must be one of: JOB_SEEKER, REFERRER, BOTH, ADMIN',
    'any.required': 'Role is required',
  }),
});

// Privacy settings update schema
export const privacySettingsSchema = Joi.object({
  profileVisibility: Joi.string().valid('public', 'private', 'connections'),
  resumeVisibility: Joi.string().valid('public', 'private', 'connections'),
  contactInfoVisibility: Joi.string().valid('public', 'private', 'connections'),
});
