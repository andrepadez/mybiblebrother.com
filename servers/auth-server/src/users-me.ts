import type { Handler } from 'hono';
import type { User } from 'types';
import * as errors from 'hono-server/custom-errors';
import { db, eq, Users, Passkeys, Websites, not } from 'pertentodb';

export const usersMe: Handler = async (ctx) => {
  const user = ctx.get('user') as User;
  const origin = ctx.get('origin') as string;
  const dbUser = await db.query.Users.findFirst({
    where: eq(Users.id, user.id),
    columns: { password: false, invitedBy: false },
    with: {
      company: { with: { websites: { where: not(Websites.deleted), with: { ganProperty: true } } } },
      passkeys: { where: eq(Passkeys.origin, origin) },
    },
  });

  if (!dbUser) return errors.NOT_FOUND();

  const returnUser = { ...dbUser, passkeyCount: dbUser.passkeys.length } as any;
  delete returnUser.passkeys;

  return ctx.json(returnUser);
};
