
import Koa from 'koa';
import Router from 'koa-router';

import config from './config';
import usersModule from './modules/users/userModule'

export function createApp() {
  const app = new Koa();
  const router = new Router();
  router.get('/', ctx => {
    ctx.body = 'ok';
  });

  router.use('/users', usersModule.routes());

  app.use(router.allowedMethods());
  app.use(router.routes());

  console.log('Application has started.');

  return app;
}

if (!module.parent) {
  createApp().listen(config.port);
}
