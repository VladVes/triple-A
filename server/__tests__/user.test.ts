import agent from 'supertest-koa-agent';

import { createApp } from '../src/app';

const app = agent(createApp());

describe('Users', () => {
  test('get list', async () => {
    const res = await app.get('/users/');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
  test('get user by id', async () => {
    const res = await app.get('/users/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });
  test('get user by invalid id should be 404', async () => {
    const res = await app.get('/users/5');
    expect(res.status).toBe(404);
  });
});