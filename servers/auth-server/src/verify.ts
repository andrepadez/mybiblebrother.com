import type { Handler } from "hono";
import type { User } from 'types';
import { db, eq, Users } from 'pertentodb';
import { verify } from 'hono-server/jwt';
import * as errors from 'hono-server/custom-errors';

export const verifyHandler: Handler = (async (ctx) => {
  const { verificationCode } = ctx.get('body');

  console.log('verificationCode', verificationCode);

  const userInfo = await verify(verificationCode) as User;
  console.log('userInfo', userInfo);
  if (!userInfo) throw errors.BAD_REQUEST();

  await db.update(Users).set({ status: 'Prospect' }).where(eq(Users.id, userInfo.id));

  return ctx.json({ ok: true });
});
