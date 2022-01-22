import agent from 'supertest-koa-agent';

import { createApp } from '../src/app';
import issueToken from './helpers/issueToken';

const app = agent(createApp());

describe('Auth', () => {
  test('user can success login', async () => {
    const res = await app.post('/auth/login').send({
      login: 'user1',
      password: 'user1',
    });
    expect(res.status === 200).toBeTruthy();
    expect(typeof res.body.token === 'string').toBeTruthy();
    expect(typeof res.body.refreshToken === 'string').toBeTruthy();
  });
  test('User gets 403 on invalid login', async () => {
    const res = await app.post('/auth/login').send({
      login: 'INVALID_LOGIN',
      password: 'user1',
    });
    expect(res.status === 403).toBeTruthy();
  });
  test('User receives 401 on expired token', async () => {
    const expiredToken = issueToken({ id: 1 }, { expiresIn: '1ms' });
    const res = await app
      .get('/users')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status === 401).toBeTruthy();
  });
  test('User can get new access token using refresh token', async () => {
    const res = await app.post('auth/refresh').send({
      refreshToken: 'REFRESH_TOKEN_1',
    });
    expect(res.status === 200).toBeTruthy();
    expect(typeof res.body.token === 'string').toBeTruthy();
    expect(typeof res.body.refreshToken === 'string').toBeTruthy();
  });
  test.todo('User can use refresh token only once');
  test.todo('Refresh tokens become invalid on logout');
  test.todo('Multiple refresh tokens are valid');
});
