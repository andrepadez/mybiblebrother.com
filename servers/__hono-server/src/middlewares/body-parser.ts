// @ts-nocheck
import type { MiddlewareHandler, Handler } from "hono";

export const bodyParser: () => MiddlewareHandler = () => async (ctx, next) => {
  const contentType = ctx.req.header('Content-Type');
  if (!['POST', 'PUT', 'PATCH'].includes(ctx.req.method)) {
    ctx.req.body = {};
    return next();
  }
  try {
    if (contentType === 'application/json') {
      const body = await ctx.req.json();
      ctx.set('body', body)
    }
    if (contentType === 'application/x-www-form-urlencoded') {
      const body = await ctx.req.parseBody();
      ctx.set('body', body)
    }
    if (contentType === 'multipart/form-data') {
      const body = await ctx.req.parseBody();
      ctx.set('body', body)
    }
  } catch (ex) {
  } finally {
    ctx.req.body = ctx.req.body || {};
    return next();
  }
};
