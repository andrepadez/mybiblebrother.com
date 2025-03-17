import type { MiddlewareHandler } from 'hono';
import { db, eq, Users } from 'pertentodb';
import * as errors from 'hono-server/custom-errors';

export const canActOnUser: MiddlewareHandler = async (ctx, next) => {
  const { user } = ctx.var;
  if (user.role === 'Super Admin') return next();

  const userId = ctx.req.param('userId');
  if (!userId) throw errors.NOT_FOUND();

  const dbUser = await db.query.Users.findFirst({
    where: eq(Users.id, +userId),
    with: { company: true },
  });

  if (!dbUser) throw errors.NOT_FOUND();

  if (user.companyId !== dbUser.companyId) {
    throw errors.FORBIDDEN();
  }
  if (!['Admin', 'Owner'].includes(user.role)) {
    throw errors.FORBIDDEN();
  }
  return next();
};
