import type { MiddlewareHandler } from 'hono';
import { verify } from 'hono-server';
import * as errors from 'hono-server';
const { JWT_SECRET } = process.env;

export const userMiddleware: MiddlewareHandler = async (ctx, next) => {
  const { authorization } = ctx.req.header();

  if (!authorization) throw errors.UNAUTHORIZED();
  const [, token] = authorization.split(' ');
  if (!token) throw errors.UNAUTHORIZED();

  try {
    const user = await verify(token);
    if (!user) throw errors.UNAUTHORIZED();
    if (user.role === 'Member' && ctx.req.method !== 'GET') throw errors.UNAUTHORIZED();
    ctx.set('user', user);
    return next();
  } catch (ex) {
    throw errors.UNAUTHORIZED();
  }
};
