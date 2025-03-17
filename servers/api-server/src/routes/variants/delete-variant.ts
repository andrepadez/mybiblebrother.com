import type { Handler } from 'hono'
import { db, eq, Variants, ActivityLogs } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const deleteVariantHandler: Handler = async (ctx) => {
  const { variantId } = ctx.req.param();
  const { user } = ctx.var;
  const where = eq(Variants.id, +variantId!);
  const [experiment] = await db.delete(Variants).where(where).returning();
  if (!experiment) throw customErrors.NOT_FOUND();
  const { experimentId, name } = experiment;

  const log = {
    experimentId,
    userId: user.id,
    createdAt: new Date().valueOf(),
    message: `deleted Variant ${name}`,
  };
  await db.insert(ActivityLogs).values(log);

  return ctx.json({ ok: true });
};
