const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/userModel');

// Test user data for authentication
const adminUser = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

// Test member data
const testMember = {
  nom: 'Doe',
  prenom: 'John',
  email: 'john.doe@example.com',
  telephone: '1234567890',
  adresse: {
    rue: '123 Test St',
    ville: 'Test City',
    codePostal: '12345'
  },
  num_membre: 'MEM001',
  poids: 80,
  taille: 180,
  objectif: 'Remise en forme'
};

let token;

// Connect to test database before all tests
beforeAll(async () => {
  // Use test MongoDB for testing
  const url = 'mongodb://localhost:27017/sytsas_test';
  await mongoose.connect(url);
  
  // Create admin user and get token
  const user = await User.create(adminUser);
  token = user.getSignedJwtToken();
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Member API', () => {
  describe('POST /api/adherents', () => {
    it('should create a new member when authenticated', async () => {
      const res = await request(app)
        .post('/api/adherents')
        .set('Authorization', `Bearer ${token}`)
        .send(testMember)
        .expect(201);

      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.nom).toBe(testMember.nom);
      expect(res.body.data.prenom).toBe(testMember.prenom);
      expect(res.body.data.num_membre).toBe(testMember.num_membre);
    });

    it('should not create a member without authentication', async () => {
      const res = await request(app)
        .post('/api/adherents')
        .send(testMember)
        .expect(401);

      expect(res.body.status).toBe('fail');
    });
  });

  describe('GET /api/adherents', () => {
    it('should get all members when authenticated', async () => {
      const res = await request(app)
        .get('/api/adherents')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // Add more tests for GET one, UPDATE, DELETE, etc.
}); 