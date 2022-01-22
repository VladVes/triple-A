import agent from 'supertest-koa-agent';

import { createApp } from '../src/app';

const app = agent(createApp());

describe('Auth', () => {
  test('user can success login', async () => {
    const { body } = await app.post('/auth/login').send({
      login: 'user1',
      password: 'user1',
    });
    expect(typeof body.token === 'string').toBe(true);
    expect(typeof body.refreshToken === 'string').toBe(true);
  });
  test.todo('User gets 403 on invalid login');
  test.todo('User receives 401 on expired token');
  test.todo('User can refresh access token using refresh token');
  test.todo('User can use refresh token only once');
  test.todo('Refresh tokens become invalid on logout');
  test.todo('Multiple refresh tokens are valid');
});
