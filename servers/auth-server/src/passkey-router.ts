import type { Handler } from 'hono';
import type { User } from 'types';
import { Hono, userMiddleware } from 'hono-server';
import { sign } from 'hono-server/jwt';
import * as errors from 'hono-server/custom-errors';
import { createChallenge, hexToString } from 'helpers/passkeys';
import { db, eq, and, Passkeys, Users } from 'pertentodb';


export const passkeyRouter = new Hono();

let currentChallenges: any = {};

const passkeyRouterPostChallenge: Handler = async (ctx) => {
  const { email } = ctx.req.param();
  const challenge = createChallenge();
  currentChallenges = { ...currentChallenges, [email]: challenge };
  return ctx.json({ challenge });
}
passkeyRouter.post('/challenge/:email', passkeyRouterPostChallenge);

const passkeyRouterPost: Handler = async (ctx) => {
  const origin = ctx.get('origin') as string;
  const { email } = ctx.get('user') as User;
  const { challenge, credentialId, publicKey }: any = ctx.get('body');
  if (hexToString(challenge) !== hexToString(currentChallenges[email])) throw errors.BAD_CREDENTIALS();
  delete currentChallenges[email];
  const values = { email, credentialId, publicKey, origin };
  const [passkey] = await db.insert(Passkeys).values(values).returning();
  return ctx.json({ ok: true });
}
passkeyRouter.post('/credentials', userMiddleware, passkeyRouterPost);

const passkeyRouterGet: Handler = async (ctx) => {
  const { email } = ctx.req.param();
  const origin = ctx.get('origin') as string;
  const challenge = createChallenge();
  currentChallenges = { ...currentChallenges, [email]: challenge };
  const passkeys = await db.query.Passkeys.findMany({
    where: and(eq(Passkeys.email, email), eq(Passkeys.origin, origin)),
  });

  const credentialIds = passkeys.map((p) => p.credentialId);
  return ctx.json({ challenge, credentialIds });
}
passkeyRouter.get('/signin/:email', passkeyRouterGet);


const passkeyRouterPostVerify: Handler = async (ctx) => {
  const { email } = ctx.req.param();
  const { credentialId, challenge } = ctx.get('body');
  if (hexToString(challenge) !== hexToString(currentChallenges[email])) throw errors.BAD_CREDENTIALS();
  delete currentChallenges[email];
  const dbPasskeys = await db.query.Passkeys.findMany({
    where: eq(Passkeys.email, email),
  });
  if (!dbPasskeys.find((p) => p.credentialId === credentialId)) throw errors.BAD_CREDENTIALS();

  const dbUser = await db.query.Users.findFirst({
    where: eq(Users.email, email),
    with: { passkeys: true },
  });

  if (!dbUser) throw errors.UNAUTHORIZED();

  const { id, companyId, parentCompanyId, firstName, lastName, role } = dbUser;
  const passkeys = dbUser.passkeys.length;
  const token = await sign({ id, email, companyId, parentCompanyId, firstName, lastName, role, passkeys });
  return ctx.json({ token, user: { id, email, companyId, parentCompanyId, firstName, lastName, role, passkeys } });

}
passkeyRouter.post('/verify/:email', passkeyRouterPostVerify);
