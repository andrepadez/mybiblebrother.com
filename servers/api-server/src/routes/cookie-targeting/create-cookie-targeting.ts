import type { Handler } from 'hono'
import { db, eq, CookieTargetings, ActivityLogs } from 'pertentodb';

export const createCookieTargetingHandler: Handler = async (ctx) => {
  const { body, user } = ctx.var;
  const { id, cookieName, cookieValues: cookieValuesStr, experimentId } = body;

  const cookieValues = (cookieValuesStr as string)
    .split('\n')
    .filter(Boolean)
    .map((v) => v.trim());

  const now = new Date().valueOf();
  const newTargeting = { experimentId, cookieName, cookieValues, createdBy: user.id, createdAt: now };
  let targeting = null;
  if (id) {
    [targeting] = await db.update(CookieTargetings).set(newTargeting).where(eq(CookieTargetings.id, +id)).returning();
  } else {
    [targeting] = await db.insert(CookieTargetings).values(newTargeting).returning();
  }

  const message = id ? `Updated cookie targeting (${cookieName})` : `Added cookie targeting (${cookieName})`;

  const log = {
    experimentId,
    userId: user.id,
    createdAt: now,
    message: message,
  };
  await db.insert(ActivityLogs).values(log);


  return ctx.json(targeting);
};
