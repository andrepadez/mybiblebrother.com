import type { Handler } from 'hono'
import type { Change } from 'types'
import { db, eq, Changes } from 'pertentodb';

export const createChangeHandler: Handler = async (ctx) => {
  const { user, body } = ctx.var;
  const changes = (body as Change[]).map((change) => {
    change.userId = change.userId || user.id;
    return change;
  });;

  if (changes.length === 0) {
    return ctx.json([]);
  }

  const newChanges = await db.insert(Changes).values(changes).returning();
  return ctx.json(newChanges);
};
