import type { Handler } from 'hono'
import { db, eq, Variants } from 'pertentodb';

export const updateVariantHandler: Handler = async (ctx) => {
  const { variantId } = ctx.req.param();
  const body = ctx.get('body');
  const values = { ...body, updatedAt: Date.now() };
  const where = eq(Variants.id, +variantId!);
  const [variant] = await db.update(Variants).set(values).where(where).returning();
  return ctx.json(variant);
};
