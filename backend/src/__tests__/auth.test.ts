import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('test@test.com');
  });

  it('should reject duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@test.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@test.com', password: 'password123' });

    expect(res.status).toBe(409);
  });

  it('should reject short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: '123' });

    expect(res.status).toBe(400);
  });

  it('should reject invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'password123' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login@test.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('login@test.com');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@test.com', password: 'wrong' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('should return null user when not authenticated', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(200);
    expect(res.body.user).toBeNull();
  });
});
