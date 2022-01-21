import agent from 'supertest-koa-agent';

import { createApp } from '../src/app';

const app = agent(createApp());

describe('app', () => {
  test('works', async () => {
    const res = await app.get('/');
    expect(res.status).toBe(200);
  });
});
