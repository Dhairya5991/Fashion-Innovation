const request = require('supertest');
const app = require('../server'); // Import your Express app
const { sequelize, User } = require('../models');
const { hashPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

// Ensure database is ready and clear before tests
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Clear and re-create tables for testing
});

// Clean up after each test
afterEach(async () => {
  await User.destroy({ truncate: true, cascade: true }); // Clear users table
});

// Close database connection after all tests
afterAll(async () => {
  await sequelize.close();
});

describe('Auth Routes', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body).toHaveProperty('token');

      const userInDb = await User.findOne({ where: { email: testUser.email } });
      expect(userInDb).not.toBeNull();
      expect(userInDb.email).toEqual(testUser.email);
      expect(userInDb.password_hash).not.toEqual(testUser.password); // Should be hashed
    });

    it('should return 409 if user with email already exists', async () => {
      await User.create({ email: testUser.email, password_hash: await hashPassword(testUser.password) });

      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('message', 'User with this email already exists.');
    });

    it('should return 400 if email or password is missing', async () => {
      const res1 = await request(app)
        .post('/api/auth/register')
        .send({ email: testUser.email });
      expect(res1.statusCode).toEqual(400);
      expect(res1.body).toHaveProperty('message', 'Email and password are required.');

      const res2 = await request(app)
        .post('/api/auth/register')
        .send({ password: testUser.password });
      expect(res2.statusCode).toEqual(400);
      expect(res2.body).toHaveProperty('message', 'Email and password are required.');
    });
  });

  describe('POST /api/auth/login', () => {
    let hashedPassword;
    let registeredUser;

    beforeEach(async () => {
      hashedPassword = await hashPassword(testUser.password);
      registeredUser = await User.create({ email: testUser.email, password_hash: hashedPassword });
    });

    it('should log in a user successfully and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(testUser);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Logged in successfully');
      expect(res.body.user).toHaveProperty('id', registeredUser.id);
      expect(res.body.user).toHaveProperty('email', registeredUser.email);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials.');
    });

    it('should return 401 for unregistered email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: testUser.password });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials.');
    });

    it('should return 400 if email or password is missing', async () => {
      const res1 = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email });
      expect(res1.statusCode).toEqual(400);
      expect(res1.body).toHaveProperty('message', 'Email and password are required.');

      const res2 = await request(app)
        .post('/api/auth/login')
        .send({ password: testUser.password });
      expect(res2.statusCode).toEqual(400);
      expect(res2.body).toHaveProperty('message', 'Email and password are required.');
    });
  });
});
