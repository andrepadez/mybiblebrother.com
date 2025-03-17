import type { Handler } from 'hono'
import { db, eq, CookieTargetings, ActivityLogs } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const deleteCookieTargetingHandler: Handler = async (ctx) => {
  const { cookieTargetingId } = ctx.req.param();
  const { user } = ctx.var;

  const [dbCookieTargeting] = await db.delete(CookieTargetings).where(eq(CookieTargetings.id, +cookieTargetingId)).returning();
  if (!dbCookieTargeting) throw customErrors.NOT_FOUND();

  const log = {
    experimentId: dbCookieTargeting.experimentId,
    userId: user.id,
    createdAt: new Date().valueOf(),
    message: `Deleted Cookie targeting for ${dbCookieTargeting.cookieName}`,
  };

  await db.insert(ActivityLogs).values(log);


  return ctx.json({ ok: true });
};
