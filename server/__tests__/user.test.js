import agent from 'supertest-koa-agent';

import { createApp } from '../src/app';
import issueToken from './helpers/issueToken';

const app = agent(createApp());
const authLine = `Bearer ${issueToken({ id: 1 })}`;

describe('Users', () => {
  test('get list', async () => {
    const res = await app.get('/users/').set('Authorization', authLine);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test('get user by id', async () => {
    const res = await app.get('/users/1').set('Authorization', authLine);
    expect(res.status).toBe(200);
    expect(res.body.login).toBe('user1');
  });
  test('get user by invalid id should be 404', async () => {
    const res = await app.get('/users/5').set('Authorization', authLine);
    expect(res.status).toBe(404);
  });
});
