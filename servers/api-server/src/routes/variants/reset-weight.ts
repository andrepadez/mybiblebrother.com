import type { Handler } from 'hono'
import { db, eq, Variants, ActivityLogs } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const resetWeightHandler: Handler = async (ctx) => {
  const { variantId } = ctx.req.param();
  const { user } = ctx.var;
  const where = eq(Variants.id, +variantId!);
  const dbVariant = await db.query.Variants.findFirst({ where });
  if (!dbVariant) throw customErrors.NOT_FOUND();

  const [newVariant] = await db.update(Variants).set({ weight: null }).where(where).returning();

  const message = `resetted weight for variant ${dbVariant.name}`;
  await db.insert(ActivityLogs).values({
    experimentId: dbVariant.experimentId,
    userId: user.id,
    createdAt: new Date().valueOf(),
    message,
  });

  return ctx.json(newVariant);
};
