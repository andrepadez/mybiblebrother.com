import type { Handler } from "hono";
import { db, eq, Users } from 'pertentodb';
import argon2 from 'argon2';
import * as errors from 'hono-server/custom-errors';

export const changePasswordHandler: Handler = async (ctx) => {
  const now = Date.now().valueOf();
  const { password, newPassword } = ctx.get('body');
  const reqUser = ctx.get('user');

  const dbUser = await db.query.Users.findFirst({
    where: eq(Users.id, reqUser.id),
    columns: { password: true },
  });

  if (!dbUser) throw errors.UNAUTHORIZED();

  const isCorrectOldPassword = await argon2.verify(dbUser.password!, password);
  if (!isCorrectOldPassword) {
    throw errors.createError(403, 'Incorrect old password');
  }

  const newPasswordHash = await argon2.hash(newPassword);
  const values = { password: newPasswordHash, updatedAt: now };
  await db.update(Users).set(values).where(eq(Users.id, reqUser.id));

  return ctx.json({ ok: true });
};
