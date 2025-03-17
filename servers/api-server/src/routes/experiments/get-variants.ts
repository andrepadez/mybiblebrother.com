import type { Handler } from 'hono';
import { db, eq, asc, Variants } from 'pertentodb';

export const getVariantsHandler: Handler = async (ctx) => {
  const { experimentId } = ctx.req.param();
  const where = eq(Variants.experimentId, +experimentId);

  const variants = await db.query.Variants.findMany({
    where: eq(Variants.experimentId, +experimentId),
    orderBy: asc(Variants.createdAt),
    with: { changes: { columns: { id: true } } },
  });

  return ctx.json(variants);
};
