// src/tests/auth.test.js

jest.mock('../middleware/auth', () => ({
  authUser: (req, res, next) => {
    req.user = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com'
    };
    next();
  }
}));

const request = require('supertest');
const app = require('../app');

describe('GET /profile', () => {
  it('should return authenticated user info', async () => {
    const res = await request(app).get('/profile');

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      id: '123',
      name: 'Test User',
      email: 'test@example.com'
    });
  });
});
