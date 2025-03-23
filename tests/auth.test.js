const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/userModel');

// Test user data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
};

// Connect to test database before all tests
beforeAll(async () => {
  // Use in-memory MongoDB for testing
  const url = 'mongodb://localhost:27017/sytsas_test';
  await mongoose.connect(url);
});

// Clean up database between tests
beforeEach(async () => {
  await User.deleteMany({});
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body.status).toBe('success');
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.username).toBe(testUser.username);
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('should not register a user with an existing email', async () => {
      // Create a user first
      await User.create(testUser);

      // Try to create another user with the same email
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(res.body.status).toBe('fail');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user with valid credentials', async () => {
      // Create a user first
      await User.create(testUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.token).toBeDefined();
    });

    it('should not login a user with invalid credentials', async () => {
      // Create a user first
      await User.create(testUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(res.body.status).toBe('fail');
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get the current user profile when authenticated', async () => {
      // Create a user first
      const user = await User.create(testUser);
      const token = user.getSignedJwtToken();

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data._id).toBeDefined();
      expect(res.body.data.username).toBe(testUser.username);
    });

    it('should not access the route without authentication', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(res.body.status).toBe('fail');
      expect(res.body.message).toBe('Not authorized to access this route');
    });
  });
}); 