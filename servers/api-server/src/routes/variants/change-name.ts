import type { Handler } from 'hono'
import { db, eq, Variants, ActivityLogs } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const changeNameHandler: Handler = async (ctx) => {
  const { variantId } = ctx.req.param();
  const { body, user } = ctx.var;
  const { name, redirectUrl } = body;
  const variant = await db.query.Variants.findFirst({ where: eq(Variants.id, +variantId!) });
  if (!variant) throw customErrors.NOT_FOUND();

  const [dbVariant] = await db
    .update(Variants)
    .set({ name, redirectUrl })
    .where(eq(Variants.id, +variantId!))
    .returning();

  await db.insert(ActivityLogs).values({
    experimentId: dbVariant.experimentId,
    userId: user.id,
    createdAt: new Date().valueOf(),
    message: `changed Variant ${variant.name} to ${name}`,
  });

  return ctx.json(dbVariant);
};
