import Joi from 'joi';

export const profileSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .messages({
      'string.pattern.base': 'Username can only contain letters, numbers, underscores and hyphens'
    }),
  fullName: Joi.string().max(100),
  headline: Joi.string().max(120),
  summary: Joi.string(),
  experience: Joi.string(),
  skills: Joi.array().items(Joi.string()),
  contactEmail: Joi.string().email(),
  location: Joi.string(),
  socialLinks: Joi.object({
    linkedin: Joi.string().uri().allow(''),
    twitter: Joi.string().uri().allow(''),
    github: Joi.string().uri().allow(''),
    website: Joi.string().uri().allow('')
  }),
  privacySettings: Joi.object({
    showEmail: Joi.boolean(),
    showLocation: Joi.boolean(),
    showSocialLinks: Joi.boolean(),
    isPublicProfile: Joi.boolean()
  })
});
