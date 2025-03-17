import { HonoRouter, canActOnUser } from 'hono-server';
import { db, eq, Users } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const usersRouter = HonoRouter();

usersRouter.get('/me', async (ctx) => {
  const { user, body } = ctx.var;
  const dbUser = await db.query.Users.findFirst({
    where: eq(Users.id, user.id),
    columns: { password: false, invitedBy: false },
    with: { company: true, passkeys: true },
  });

  if (!dbUser) throw customErrors.NOT_FOUND();

  return ctx.json({ ...dbUser, passkeys: dbUser.passkeys.length });
});

usersRouter.put('/', async (ctx) => {
  const { user, body } = ctx.var;
  await db.update(Users).set(body).where(eq(Users.id, user.id)).returning();
  return ctx.json({ ok: true });
});

usersRouter.put('/block/:userId', canActOnUser, async (ctx) => {
  const { userId } = ctx.req.param();
  const { user } = ctx.var;
  await db.update(Users).set({ status: 'Blocked', statusBy: user.id }).where(eq(Users.id, +userId));
  return ctx.json({ ok: true });
});

usersRouter.put('/unblock/:userId', canActOnUser, async (ctx) => {
  const { userId } = ctx.req.param();
  const { user } = ctx.var;
  await db.update(Users).set({ status: 'Active', statusBy: user.id }).where(eq(Users.id, +userId));
  return ctx.json({ ok: true });
});

usersRouter.put('/ban/:userId', canActOnUser, async (ctx) => {
  const { userId } = ctx.req.param();
  const { user } = ctx.var;
  await db.update(Users).set({ status: 'Banned', statusBy: user.id }).where(eq(Users.id, +userId));
  return ctx.json({ ok: true });
});

usersRouter.delete('/:userId', canActOnUser, async (ctx) => {
  const { userId } = ctx.req.param();
  await db.delete(Users).where(eq(Users.id, +userId));
  return ctx.json({ ok: true });
});

usersRouter.get('/team/:companyId', async (ctx) => {
  const { companyId } = ctx.req.param();
  const teamMembers = await db.query.Users.findMany({
    where: eq(Users.companyId, +companyId),
    columns: { password: false, invitedBy: false },
  });

  return ctx.json(teamMembers);
});
