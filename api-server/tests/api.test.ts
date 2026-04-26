import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import type { Server } from 'http';

let server: Server;

beforeAll(() => {
  server = app.listen(0);
});
afterAll(() => {
  server.close();
});

describe('GET /api/home', () => {
  it('returns 200 with sliders, mainCategories, stats', async () => {
    const res = await request(server).get('/api/home');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('sliders');
    expect(res.body).toHaveProperty('mainCategories');
    expect(res.body).toHaveProperty('stats');
  });
});

describe('GET /api/categories', () => {
  it('returns groups object', async () => {
    const res = await request(server).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('groups');
  });
  it('filters by search', async () => {
    const res = await request(server).get('/api/categories?search=zzz_no_match');
    expect(res.status).toBe(200);
    expect(Object.keys(res.body.groups).length).toBe(0);
  });
});

describe('GET /api/businesses', () => {
  it('returns catName and businesses array', async () => {
    const res = await request(server).get('/api/businesses');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('businesses');
    expect(Array.isArray(res.body.businesses)).toBe(true);
  });
});

describe('GET /api/businesses/search', () => {
  it('returns array', async () => {
    const res = await request(server).get('/api/businesses/search?q=test');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/businesses/:id', () => {
  it('returns 404 for non-existent id', async () => {
    const res = await request(server).get('/api/businesses/999999');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/classifieds', () => {
  it('returns categories and sections', async () => {
    const res = await request(server).get('/api/classifieds');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('categories');
    expect(res.body).toHaveProperty('sections');
  });
});

describe('GET /api/classifieds/list', () => {
  it('returns paginated list', async () => {
    const res = await request(server).get('/api/classifieds/list');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
  });
});

describe('GET /api/classifieds/:id', () => {
  it('returns 404 for non-existent id', async () => {
    const res = await request(server).get('/api/classifieds/999999');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/jobs', () => {
  it('returns jobs array', async () => {
    const res = await request(server).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('jobs');
    expect(Array.isArray(res.body.jobs)).toBe(true);
  });
  it('filters by search', async () => {
    const res = await request(server).get('/api/jobs?search=developer');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.jobs)).toBe(true);
  });
});

describe('GET /api/jobs/:id', () => {
  it('returns 404 for invalid id', async () => {
    const res = await request(server).get('/api/jobs/999999');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/offers', () => {
  it('returns offers for Dubai', async () => {
    const res = await request(server).get('/api/offers?loc=Dubai');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('offers');
    expect(res.body).toHaveProperty('emirates');
    expect(res.body.selectedLoc).toBe('Dubai');
  });
});

describe('GET /api/offers/:id', () => {
  it('returns 404 for invalid id', async () => {
    const res = await request(server).get('/api/offers/999999');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/pages/:slug', () => {
  it('returns 404 for unknown slug', async () => {
    const res = await request(server).get('/api/pages/no-such-page');
    expect(res.status).toBe(404);
  });
});

describe('Admin auth', () => {
  it('POST /api/admin/login rejects bad credentials with 401', async () => {
    const res = await request(server).post('/api/admin/login').send({ username: 'baduser', password: 'badpass' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
  it('GET /api/admin/me returns 401 when unauthenticated', async () => {
    const res = await request(server).get('/api/admin/me');
    expect(res.status).toBe(401);
  });
});
