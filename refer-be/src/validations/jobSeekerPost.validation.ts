import Joi from 'joi';

export const createJobSeekerPostSchema = Joi.object({
  title: Joi.string().required().min(5).max(100).messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 5 characters',
    'string.max': 'Title cannot be longer than 100 characters',
  }),
  interestStatement: Joi.string().required().min(20).max(500).messages({
    'string.empty': 'Interest statement is required',
    'string.min': 'Interest statement must be at least 20 characters',
    'string.max': 'Interest statement cannot be longer than 500 characters',
  }),
  skills: Joi.array().items(Joi.string().trim()).min(1).max(10).messages({
    'array.min': 'At least one skill is required',
    'array.max': 'Cannot select more than 10 skills',
  }),
  experience: Joi.string().allow('').max(500).messages({
    'string.max': 'Experience cannot be longer than 500 characters',
  }),
  education: Joi.string().allow('').max(100).messages({
    'string.max': 'Education cannot be longer than 100 characters',
  }),
  resumeFile: Joi.string().allow('').optional(),
  privacyOption: Joi.string().valid('Public', 'Private', 'Anonymous').default('Public'),
  expiryDays: Joi.number().integer().min(1).max(365).default(30).messages({
    'number.min': 'Expiry days must be at least 1',
    'number.max': 'Expiry days cannot be more than 365',
  }),
});

export const updateJobSeekerPostSchema = Joi.object({
  title: Joi.string().min(5).max(100).messages({
    'string.min': 'Title must be at least 5 characters',
    'string.max': 'Title cannot be longer than 100 characters',
  }),
  interestStatement: Joi.string().min(20).max(500).messages({
    'string.min': 'Interest statement must be at least 20 characters',
    'string.max': 'Interest statement cannot be longer than 500 characters',
  }),
  skills: Joi.array().items(Joi.string().trim()).max(10).messages({
    'array.max': 'Cannot select more than 10 skills',
  }),
  experience: Joi.string().allow('').max(500).messages({
    'string.max': 'Experience cannot be longer than 500 characters',
  }),
  education: Joi.string().allow('').max(100).messages({
    'string.max': 'Education cannot be longer than 100 characters',
  }),
  resumeFile: Joi.string().allow('').optional(),
  privacyOption: Joi.string().valid('Public', 'Private', 'Anonymous'),
  status: Joi.string().valid('active', 'expired', 'draft'),
}).min(1);

export const jobSeekerPostQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('active', 'expired', 'draft'),
  privacyOption: Joi.string().valid('Public', 'Private', 'Anonymous'),
  skills: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string().custom((value, helpers) => {
      if (typeof value === 'string') {
        return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
      }
      return value;
    })
  ).optional(),
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
}); 