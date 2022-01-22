import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { compareSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwtMiddleware from 'koa-jwt';
import { v4 as uuid } from 'uuid';
import * as userService from '../../services/userService';
import * as refreshTokenService from '../../services/refreshTokenService';
import config from '../../config';

const router = new Router();

async function issueTokenPair(userId) {
  const refreshToken = uuid();
  await refreshTokenService.add({
    token: refreshToken,
    userId,
  });
  return {
    refreshToken,
    token: jwt.sign({ id: userId }, config.secret),
  };
}

router.post('/login', bodyParser(), async (ctx) => {
  const { login, password } = ctx.request.body;
  const user = await userService.find({ login });
  if (!user || !compareSync(password, user.password)) {
    const error = new Error();
    error.status = 403;
    throw error;
  }
  ctx.body = await issueTokenPair(user.id);
});

router.post('/refresh', bodyParser(), async (ctx) => {
  const { refreshToken } = ctx.request.body;
  const dbToken = await refreshTokenService.find({ token: refreshToken });
  if (!dbToken) {
    return; // koa returns 404
  }
  await refreshTokenService.remove({ token: refreshToken });
  ctx.body = await issueTokenPair(dbToken.userId);
});

router.post(
  '/logout',
  jwtMiddleware({ secret: config.secret }),
  async (ctx) => {
    const { id } = ctx.state.user;
    await refreshTokenService.remove({ userId: id });
    ctx.body = { success: true };
  },
);

export default router;
