import type { MiddlewareHandler } from 'hono';

export const originMiddleware: MiddlewareHandler = (ctx, next) => {
  const headerOrigin = ctx.req.header('origin');
  ctx.set('origin', headerOrigin);
  return next();
};
