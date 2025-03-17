import type { Handler } from 'hono'
import { db, eq, Changes } from 'pertentodb';

export const updateChangeHandler: Handler = async (ctx) => {
  const { changeId } = ctx.req.param();
  const { body } = ctx.var;
  const values = body;
  const where = eq(Changes.id, +changeId);
  const [dbChange] = await db.update(Changes).set(values).where(where).returning();
  return ctx.json(dbChange);
};
