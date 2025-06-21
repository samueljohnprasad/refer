import { SwaggerDefinition, Options } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ReferNet API',
    version: '1.0.0',
    description: 'API documentation for ReferNet backend',
    contact: {
      name: 'API Support',
      email: 'support@refernet.com',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Development server',
    },
    {
      url: 'https://api.refernet.com',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication and user management',
    },
    {
      name: 'Jobs',
      description: 'Job postings and management',
    },
  ],
  components: {
    parameters: {
      pageParam: {
        in: 'query',
        name: 'page',
        schema: {
          type: 'integer',
          minimum: 1,
          default: 1,
        },
        description: 'Page number for pagination',
      },
      limitParam: {
        in: 'query',
        name: 'limit',
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 10,
        },
        description: 'Number of items per page',
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
    },
    schemas: {
      // Common Schemas
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Error message' },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation successful' },
        },
      },
      
      // Auth Schemas
      RegisterRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', format: 'password', minLength: 8, example: 'securePassword123' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          phone: { type: 'string', example: '+1234567890' },
        },
        required: ['email', 'password', 'firstName', 'lastName'],
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', format: 'password', example: 'securePassword123' },
        },
        required: ['email', 'password'],
      },
      OTPRequest: {
        type: 'object',
        properties: {
          phone: { type: 'string', example: '+1234567890' },
        },
        required: ['phone'],
      },
      OTPVerifyRequest: {
        type: 'object',
        properties: {
          phone: { type: 'string', example: '+1234567890' },
          otp: { type: 'string', example: '123456' },
        },
        required: ['phone', 'otp'],
      },
      ForgotPasswordRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
        },
        required: ['email'],
      },
      ResetPasswordRequest: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          password: { type: 'string', format: 'password', minLength: 8 },
        },
        required: ['token', 'password'],
      },
      UpdateRoleRequest: {
        type: 'object',
        properties: {
          role: { 
            type: 'string', 
            enum: ['candidate', 'referrer', 'recruiter'],
            example: 'candidate'
          },
        },
        required: ['role'],
      },
      PrivacySettingsRequest: {
        type: 'object',
        properties: {
          showEmail: { type: 'boolean', example: true },
          showPhone: { type: 'boolean', example: false },
          showProfile: { type: 'boolean', example: true },
        },
      },
      
      // Job Schemas
      JobPost: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'Senior Software Engineer' },
          description: { type: 'string', example: 'Job description here...' },
          company: { type: 'string', example: 'Tech Corp' },
          location: { type: 'string', example: 'Remote' },
          salary: { type: 'string', example: '$100,000 - $150,000' },
          requirements: {
            type: 'array',
            items: { type: 'string' },
            example: ['5+ years of experience', 'Proficiency in TypeScript']
          },
          isActive: { type: 'boolean', example: true },
          postedBy: { type: 'string', format: 'uuid' },
          companyId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateJobRequest: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Senior Software Engineer' },
          description: { type: 'string', example: 'Job description here...' },
          company: { type: 'string', example: 'Tech Corp' },
          location: { type: 'string', example: 'Remote' },
          salary: { type: 'string', example: '$100,000 - $150,000' },
          requirements: {
            type: 'array',
            items: { type: 'string' },
            example: ['5+ years of experience', 'Proficiency in TypeScript']
          },
          companyId: { type: 'string', format: 'uuid' },
        },
        required: ['title', 'description', 'company', 'location', 'companyId'],
      },
      UpdateJobRequest: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Senior Software Engineer' },
          description: { type: 'string', example: 'Updated job description...' },
          location: { type: 'string', example: 'Remote' },
          salary: { type: 'string', example: '$100,000 - $150,000' },
          isActive: { type: 'boolean', example: true },
        },
      },
      JobQueryParams: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1, example: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10, example: 10 },
          companyId: { type: 'string', format: 'uuid' },
          search: { type: 'string', example: 'software engineer' },
          location: { type: 'string', example: 'remote' },
        },
      },
      PaginatedJobResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/JobPost' },
          },
          total: { type: 'integer', example: 42 },
          page: { type: 'integer', example: 1 },
          pages: { type: 'integer', example: 5 },
        },
      },
      
      // User Schemas
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' },
          role: { type: 'string', enum: ['candidate', 'referrer', 'recruiter', 'admin'] },
          isEmailVerified: { type: 'boolean' },
          isCompanyEmailVerified: { type: 'boolean' },
          privacySettings: {
            type: 'object',
            properties: {
              showEmail: { type: 'boolean' },
              showPhone: { type: 'boolean' },
              showProfile: { type: 'boolean' },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  // Global tags are already defined at the root level
};

const swaggerOptions: Options = {
  swaggerDefinition,
  // Path to the API docs (adjust as needed)
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/models/*.ts',
  ],
};

export default swaggerOptions;
