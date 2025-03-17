import type { Handler } from 'hono'
import { db, eq, Experiments } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const updateExperimentHandler: Handler = async (ctx) => {
  const { experimentId } = ctx.req.param();
  const { body } = ctx.var;
  const where = eq(Experiments.id, +experimentId);
  const [dbExperiment] = await db.update(Experiments).set(body).where(where).returning();
  if (!dbExperiment) throw customErrors.NOT_FOUND();

  return ctx.json({ ok: true });
};
