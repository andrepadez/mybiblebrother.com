import type { Handler } from 'hono'
import { db, eq, Variants, ActivityLogs } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const setMaxWeightHandler: Handler = async (ctx) => {
  const { variantId } = ctx.req.param();
  const user = ctx.get('user');
  const where = eq(Variants.id, +variantId!);
  const dbVariant = await db.query.Variants.findFirst({ where });
  if (!dbVariant) throw customErrors.NOT_FOUND();

  const { experimentId } = dbVariant;
  const experimentWhere = eq(Variants.experimentId, +experimentId!);
  await db.update(Variants).set({ weight: null }).where(experimentWhere);
  const [updatedVariant] = await db.update(Variants).set({ weight: 10000 }).where(where).returning();

  const message = `set 100% weight for variant ${dbVariant.name}`;
  await db.insert(ActivityLogs).values({
    experimentId: dbVariant.experimentId,
    userId: user.id,
    createdAt: new Date().valueOf(),
    message,
  });
  return ctx.json(updatedVariant);
};
