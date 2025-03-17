import type { Handler } from 'hono';
import { db, Variants, ActivityLogs } from 'pertentodb';

export const createVariantHandler: Handler = async (ctx) => {
  const { body, user } = ctx.var;

  const variant = {
    ...body,
    createdBy: user.id,
  };

  const vts = new Date().valueOf();
  const variantValues = { ...variant, createdAt: vts, updatedAt: vts };
  const [newVariant] = await db.insert(Variants).values(variantValues).returning();

  const log = {
    experimentId: variant.experimentId,
    userId: user.id,
    createdAt: vts,
    message: `created Variant ${variant.name}`,
  };

  await db.insert(ActivityLogs).values(log);

  return ctx.json(newVariant);
};
