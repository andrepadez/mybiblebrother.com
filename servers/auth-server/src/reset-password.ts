import type { User } from 'types';
import type { Handler } from 'hono';
import { db, eq, Users } from 'pertentodb';
import { verify } from 'hono-server/jwt';
import argon2 from 'argon2';
import * as errors from 'hono-server';

export const resetPasswordHandler: Handler = async (ctx) => {
  const { password, verificationCode, status } = ctx.get('body');
  const userInfo = await verify(verificationCode) as User;
  if (!userInfo) throw errors.UNAUTHORIZED();
  const passwordHash = await argon2.hash(password);
  await db
    .update(Users)
    .set({ password: passwordHash, status: status || 'Active' })
    .where(eq(Users.id, userInfo.id));

  return ctx.json({ ok: true });
};
