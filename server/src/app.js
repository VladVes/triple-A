import Koa from 'koa';
import Router from 'koa-router';
import 'dotenv/config';

import usersModule from './modules/users/userModule';

export function createApp() {
  const app = new Koa();
  const router = new Router();
  router.get('/', (ctx) => {
    ctx.body = 'ok';
  });

  router.use('/users', usersModule.routes());

  app.use(router.allowedMethods());
  app.use(router.routes());

  return app;
}
