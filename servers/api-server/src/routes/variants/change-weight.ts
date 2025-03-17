import type { Handler } from 'hono'
import { db, eq, Variants, ActivityLogs } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const changeWeightHandler: Handler = async (ctx) => {
  const { variantId } = ctx.req.param();
  const { body, user } = ctx.var;
  const { weight } = body;
  const where = eq(Variants.id, +variantId!);
  const dbVariant = await db.query.Variants.findFirst({ where });
  if (!dbVariant) throw customErrors.NOT_FOUND();

  const [newVariant] = await db.update(Variants).set({ weight }).where(where).returning();

  const message =
    dbVariant.weight !== null
      ? `changed ${dbVariant.name} Variant weight from  ${dbVariant.weight / 100}% to ${weight / 100}%`
      : `set  ${dbVariant.name} Variant weight to ${weight / 100}%`;

  await db.insert(ActivityLogs).values({
    experimentId: dbVariant.experimentId,
    userId: user.id,
    createdAt: new Date().valueOf(),
    message,
  });
  return ctx.json(newVariant);
};
