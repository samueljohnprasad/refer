import Joi from 'joi';

export const createJobPostSchema = Joi.object({
  title: Joi.string().required().min(5).max(100).messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 5 characters',
    'string.max': 'Title cannot be longer than 100 characters',
  }),
  description: Joi.string().required().min(20).messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 20 characters',
  }),
  companyId: Joi.string().required().messages({
    'string.empty': 'Company ID is required',
    'string.pattern.base': 'Invalid company ID format',
  }),
  isPublic: Joi.boolean().default(true),
  expiresInDays: Joi.number().integer().min(1).max(365).default(180), // Default 6 months
});

export const updateJobPostSchema = Joi.object({
  title: Joi.string().min(5).max(100).messages({
    'string.min': 'Title must be at least 5 characters',
    'string.max': 'Title cannot be longer than 100 characters',
  }),
  description: Joi.string().min(20).messages({
    'string.min': 'Description must be at least 20 characters',
  }),
  isPublic: Joi.boolean(),
  status: Joi.string().valid('active', 'expired', 'closed'),
}).min(1);

export const jobQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  companyId: Joi.string(),
  status: Joi.string().valid('active', 'expired', 'closed'),
  search: Joi.string(),
  sortBy: Joi.string().valid('createdAt', 'title', 'expiresAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});
