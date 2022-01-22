import agent from 'supertest-koa-agent';

import { createApp } from '../src/app';
import issueToken from './helpers/issueToken';

const app = agent(createApp());

describe('Auth', () => {
  test('user can successfully login', async () => {
    const res = await app.post('/auth/login').send({
      login: 'user1',
      password: 'user1',
    });
    expect(res.status === 200).toBeTruthy();
    expect(typeof res.body.token === 'string').toBeTruthy();
    expect(typeof res.body.refreshToken === 'string').toBeTruthy();

    const refreshTokenRes = await app.post('/auth/refresh').send({
      refreshToken: res.body.refreshToken,
    });
    expect(refreshTokenRes.status === 200).toBeTruthy();
    expect(typeof refreshTokenRes.body.token === 'string').toBeTruthy();
    expect(typeof refreshTokenRes.body.refreshToken === 'string').toBeTruthy();
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
    const res = await app.post('/auth/refresh').send({
      refreshToken: 'REFRESH_TOKEN_1',
    });
    expect(res.status === 200).toBeTruthy();
    expect(typeof res.body.token === 'string').toBeTruthy();
    expect(typeof res.body.refreshToken === 'string').toBeTruthy();
  });
  test('User get 404 on invalid refresh token', async () => {
    const res = await app.post('/auth/refresh').send({
      refreshToken: 'INVALID_TOKEN',
    });
    expect(res.status === 404).toBeTruthy();
  });
  test('User can use refresh token only once', async () => {
    const res1 = await app.post('/auth/refresh').send({
      refreshToken: 'REFRESH_TOKEN_ONCE',
    });
    expect(res1.status === 200).toBeTruthy();
    expect(typeof res1.body.token === 'string').toBeTruthy();
    expect(typeof res1.body.refreshToken === 'string').toBeTruthy();

    const res2 = await app.post('/auth/refresh').send({
      refreshToken: 'REFRESH_TOKEN_ONCE',
    });
    expect(res2.status === 404).toBeTruthy();
  });
  test('Refresh tokens become invalid on logout', async () => {
    const accessToken = issueToken({ id: 2 });
    const logoutRes = await app
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(logoutRes.status === 200).toBeTruthy();

    const res = await app.post('/auth/refresh').send({
      refreshToken: 'REFRESH_TOKEN_TO_DELETE_ON_LOGOUT',
    });
    expect(res.status === 404).toBeTruthy();
  });
  test('Multiple refresh tokens are valid', async () => {
    const loginResponse1 = await app.post('/auth/login').send({
      login: 'user2',
      password: 'user2',
    });
    const loginResponse2 = await app.post('/auth/login').send({
      login: 'user2',
      password: 'user2',
    });
    expect(loginResponse1.status === 200).toBeTruthy();
    expect(loginResponse2.status === 200).toBeTruthy();

    const refreshRes1 = await app.post('/auth/refresh').send({
      refreshToken: loginResponse1.body.refreshToken,
    });
    const refreshRes2 = await app.post('/auth/refresh').send({
      refreshToken: loginResponse2.body.refreshToken,
    });
    expect(refreshRes1.status === 200).toBeTruthy();
    expect(refreshRes2.status === 200).toBeTruthy();
  });
});
