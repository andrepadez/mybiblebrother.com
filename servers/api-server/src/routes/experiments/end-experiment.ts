import type { Handler } from 'hono';
import { db, eq, Experiments, ActivityLogs } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const endExperimentHandler: Handler = async (ctx) => {
  const { experimentId } = ctx.req.param();
  const { user } = ctx.var;

  const [experiment] = await db
    .update(Experiments)
    .set({ endsAt: new Date().valueOf(), status: 'Ended' })
    .where(eq(Experiments.id, +experimentId))
    .returning();

  if (!experiment) throw customErrors.NOT_FOUND();


  const log = {
    experimentId,
    userId: user.id,
    createdAt: new Date().valueOf(),
    message: `Ended experiment`,
  };

  await db.insert(ActivityLogs).values(log);

  return ctx.json(experiment);
};
