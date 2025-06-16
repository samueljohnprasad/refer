import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server';
import User from '../models/user.model';
import { UserRole, BadgeType } from '../types/user.types';

// Setup in-memory MongoDB for testing
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.JOB_SEEKER,
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
    });

    it('should not register a user with existing email', async () => {
      // Create a user first
      await User.create({
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe',
        role: UserRole.JOB_SEEKER,
      });

      // Try to register with the same email
      const userData = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Smith',
        role: UserRole.JOB_SEEKER,
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toMatch(/User already exists/i);
    });

    it('should validate input data', async () => {
      const userData = {
        email: 'invalid-email',
        password: '123', // Too short
        firstName: '',
        lastName: 'Doe',
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user with valid credentials', async () => {
      // Create a test user
      const user = new User({
        email: 'login@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.JOB_SEEKER,
      });
      await user.save();

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
      // Create a test user
      const user = new User({
        email: 'login@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.JOB_SEEKER,
      });
      await user.save();

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });
  
  describe('Protected Routes', () => {
    let token: string;
    let userId: string;
    
    beforeEach(async () => {
      // Create a test user and get token
      const user = new User({
        email: 'protected@example.com',
        password: 'Password123!',
        firstName: 'Protected',
        lastName: 'User',
        role: UserRole.JOB_SEEKER,
        isVerified: true,
      });
      await user.save();
      userId = user._id.toString();
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'protected@example.com',
          password: 'Password123!',
        });
      
      token = res.body.data.token;
    });
    
    it('should get current user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.user).toHaveProperty('email', 'protected@example.com');
      expect(res.body.data.user).toHaveProperty('firstName', 'Protected');
    });
    
    it('should update user role', async () => {
      const res = await request(app)
        .put('/api/auth/role')
        .set('Authorization', `Bearer ${token}`)
        .send({
          role: UserRole.REFERRER,
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('role', UserRole.REFERRER);
      
      // Verify in database
      const user = await User.findById(userId);
      expect(user).toHaveProperty('role', UserRole.REFERRER);
    });
    
    it('should update privacy settings', async () => {
      const res = await request(app)
        .put('/api/auth/privacy')
        .set('Authorization', `Bearer ${token}`)
        .send({
          profileVisibility: 'private',
          resumeVisibility: 'private',
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.privacySettings).toHaveProperty('profileVisibility', 'private');
      expect(res.body.data.privacySettings).toHaveProperty('resumeVisibility', 'private');
      
      // Verify in database
      const user = await User.findById(userId);
      expect(user?.privacySettings).toHaveProperty('profileVisibility', 'private');
    });
    
    it('should reject requests with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});
