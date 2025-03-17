import type { Handler } from 'hono';
import { db, eq, Changes } from 'pertentodb';

export const deleteChangeHandler: Handler = async (ctx) => {
  const { changeId } = ctx.req.param();
  const where = eq(Changes.id, +changeId);
  await db.delete(Changes).where(where);
  return ctx.json({ ok: true });
};

export const deleteAllChangesHandler: Handler = async (ctx) => {
  const { variantId } = ctx.req.param();
  const where = eq(Changes.variantId, +variantId);
  await db.delete(Changes).where(where);

  return ctx.json({ ok: true });
};
