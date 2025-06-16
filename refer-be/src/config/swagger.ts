import { SwaggerDefinition, Options } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ReferNet API',
    version: '1.0.0',
    description: 'API documentation for ReferNet backend',
  },
  servers: [
    {
      url: '/api',
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      RegisterRequest: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
        },
        required: ['email', 'password', 'firstName', 'lastName'],
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['email', 'password'],
      },
    },
  },
};

const swaggerOptions: Options = {
  swaggerDefinition,
  // Path to the API docs (adjust as needed)
  apis: [
    './src/routes/*.ts',
    './src/routes/*.js',
    './src/server.ts',
  ],
};

export default swaggerOptions;
