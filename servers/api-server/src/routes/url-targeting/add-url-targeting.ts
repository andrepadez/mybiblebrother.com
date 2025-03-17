import type { Handler } from 'hono'
import { db, eq, UrlTargetings, ActivityLogs } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const addUrlTargetingHandler: Handler = async (ctx) => {
  const { body, user } = ctx.var;
  const { condition, url, experimentId } = body;

  const now = new Date().valueOf();
  const newTargeting = { ...body, createdBy: user.id, createdAt: now, updatedAt: now };
  const [dbUrlTargeting] = await db.insert(UrlTargetings).values(newTargeting).returning();


  const log = {
    experimentId,
    userId: user.id,
    createdAt: now,
    message: `Added Url Targeting: ${condition} ${url}`,
  };

  await db.insert(ActivityLogs).values(log);

  return ctx.json(dbUrlTargeting);
};
