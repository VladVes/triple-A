import Koa from 'koa';
import Router from 'koa-router';
import jwtMiddleware from 'koa-jwt';
import 'dotenv/config';

import authModule from './modules/auth/authModule';
import usersModule from './modules/users/userModule';

import config from './config';

export function createApp() {
  const app = new Koa();
  const router = new Router();
  router.get('/', (ctx) => {
    ctx.body = 'ok';
  });

  router.use('/auth', authModule.routes());
  router.use(jwtMiddleware({ secret: config.secret }));
  router.use('/users', usersModule.routes());

  app.use(router.allowedMethods());
  app.use(router.routes());

  return app;
}
