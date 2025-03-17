import type { Handler } from 'hono'
import { db, eq, Experiments } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const archiveExperimentHandler: Handler = async (ctx) => {
  const { experimentId } = ctx.req.param();
  const now = new Date().valueOf();
  const where = eq(Experiments.id, +experimentId);
  const [experiment] = await db.update(Experiments).set({ archived: now }).where(where).returning();
  if (!experiment) throw customErrors.NOT_FOUND();
  return ctx.json(experiment);
};
