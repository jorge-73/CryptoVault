import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

async function registerAndGetCookies() {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: 'fav@test.com', password: 'password123' });

  const raw = res.headers['set-cookie'];
  const cookies = (Array.isArray(raw) ? raw : [raw])
    .map((c: string) => c.split(';')[0])
    .join('; ');
  return cookies || 'access_token=invalid';
}

describe('GET /api/favorites', () => {
  it('should return 401 without auth', async () => {
    const res = await request(app).get('/api/favorites');
    expect(res.status).toBe(401);
  });

  it('should return empty array when no favorites', async () => {
    const cookies = await registerAndGetCookies();

    const res = await request(app)
      .get('/api/favorites')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/favorites', () => {
  it('should add a favorite', async () => {
    const cookies = await registerAndGetCookies();

    const res = await request(app)
      .post('/api/favorites')
      .set('Cookie', cookies)
      .send({ cryptoId: 'bitcoin' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Added to favorites');
  });

  it('should reject missing cryptoId', async () => {
    const cookies = await registerAndGetCookies();

    const res = await request(app)
      .post('/api/favorites')
      .set('Cookie', cookies)
      .send({});

    expect(res.status).toBe(400);
  });
});
