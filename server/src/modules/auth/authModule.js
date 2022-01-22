import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { compareSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { find } from '../../services/userService';
import config from '../../config';

const router = new Router();

router.post('/login', bodyParser(), async (ctx) => {
  const { login, password } = ctx.request.body;
  const user = await find({ login });
  if (!user || !compareSync(password, user.password)) {
    const error = new Error();
    error.status = 403;
    throw error;
  }
  const refreshToken = uuid();
  ctx.body = {
    token: jwt.sign({ id: user.id }, config.secret),
    refreshToken,
  };
});

export default router;
