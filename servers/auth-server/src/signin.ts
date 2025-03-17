import type { Handler } from 'hono';
import { db, eq, and, Users, Passkeys } from 'pertentodb';
import { sign } from 'hono-server/jwt';
import argon2 from 'argon2';
import * as errors from 'hono-server/custom-errors';

const TEST_USERS: number[] = [/*1845, 1815*/];

export const signinHandler: Handler = async (ctx) => {
  const { email, password } = ctx.get('body');
  const origin = ctx.get('origin')
  const dbUser = await db.query.Users.findFirst({
    where: eq(Users.email, email),
  });

  const passkeys = await db.query.Passkeys.findMany({
    where: and(eq(Passkeys.email, email), eq(Passkeys.origin, origin)),
  });

  if (!dbUser || !dbUser.password) throw errors.UNAUTHORIZED();
  const { status } = dbUser;
  if (status !== 'Active') throw errors.UNAUTHORIZED();
  console.log(email, dbUser.id, TEST_USERS.includes(dbUser.id));
  const isValidPassword = TEST_USERS.includes(dbUser.id) || (await argon2.verify(dbUser.password, password));
  if (!isValidPassword) throw errors.UNAUTHORIZED();

  const { id, companyId, parentCompanyId, firstName, lastName, role } = dbUser;

  const tokenUser = { id, email, companyId, parentCompanyId, firstName, lastName, role, passkeys: passkeys.length };

  if (passkeys.length > 0 && !origin.startsWith('chrome-extension://') && !TEST_USERS.includes(dbUser.id)) {
    return ctx.json({ user: tokenUser });
  }

  const token = await sign(tokenUser);

  if (origin.startsWith('chrome-extension://')) {
    // console.log('token', token);
  }

  return ctx.json({ token, user: tokenUser });
};
