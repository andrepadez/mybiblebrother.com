import type { Handler } from 'hono'
import { db, eq, UrlTargetings, ActivityLogs } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const deleteUrlTargetingHandler: Handler = async (ctx) => {
  const { urlTargetingId } = ctx.req.param();
  const { body, user } = ctx.var;

  const now = new Date().valueOf();

  const where = eq(UrlTargetings.id, +urlTargetingId);
  const [dbUrlTargeting] = await db.delete(UrlTargetings).where(where).returning();
  if (!dbUrlTargeting) throw customErrors.NOT_FOUND();

  const { url, condition, experimentId } = dbUrlTargeting;

  const log = {
    experimentId,
    userId: user.id,
    createdAt: now,
    message: `Removed Url Targeting: ${condition} ${url}`,
  };

  await db.insert(ActivityLogs).values(log);

  return ctx.json({ ok: true });
};
