import type { Handler } from 'hono'
import { db, eq, Experiments } from 'pertentodb';

export const deleteExperimentHandler: Handler = async (ctx) => {
  const { experimentId } = ctx.req.param();
  const now = new Date().valueOf();
  const where = eq(Experiments.id, +experimentId);
  const [experiment] = await db.update(Experiments).set({ deleted: now }).where(where).returning();
  return ctx.json(experiment);
};
