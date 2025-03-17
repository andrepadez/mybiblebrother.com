import type { Handler } from 'hono';
import type { User } from 'types';
import { db, eq, Users } from 'pertentodb';
import { sign } from 'hono-server/jwt';
import { sendMail } from 'emailer';
import * as errors from 'hono-server';

const { VITE_DASHBOARD_URL } = process.env;

export const inviteUserHandler: Handler = async (ctx) => {
  const body = ctx.get('body');
  const { id: invitedBy } = ctx.get('user');
  const now = Date.now().valueOf();
  const values = { ...body, status: 'Invited', invitedBy, createdAt: now, updatedAt: now };

  return db.transaction(async (tx) => {
    const existingUser = await db.query.Users.findFirst({
      where: eq(Users.email, body.email),
    });

    if (existingUser) {
      throw errors.USER_ALREADY_EXISTS();
    } else {
      const newUser = { ...body, status: 'Invited', invitedBy, createdAt: now, updatedAt: now };
      await db.insert(Users).values(values);
      const dbUser = await db.query.Users.findFirst({
        where: eq(Users.email, body.email),
        with: { company: true, inviter: true },
      }) as User;
      const verificationCode = await sendInvite(dbUser);
      return ctx.json({ ok: true, verificationCode });
    }
  });
};

export const resendInvitationHandler: Handler = async (ctx) => {
  const body = ctx.get('body');
  const { email } = body;
  const dbUser = await db.query.Users.findFirst({
    where: eq(Users.email, body.email),
    with: { company: true, inviter: true },
  }) as User;
  if (!dbUser) throw errors.NOT_FOUND();
  const verificationCode = await sendInvite(dbUser);
  return ctx.json({ ok: true, verificationCode });
};

const sendInvite = async (dbUser: User) => {
  const { id, email, invitedBy, company, inviter } = dbUser;
  const verificationCode = await sign({ id, email }, '3d');
  const url = `${VITE_DASHBOARD_URL}/auth/accept-invitation?verificationCode=${verificationCode}`;
  const { firstName, lastName } = inviter;

  sendMail({
    to: email,
    subject: 'Invitation to Pertento.ai',
    template: 'UserInvite',
    data: { companyName: company.name, url, invitedBy: `${firstName} ${lastName}` },
  });


  return verificationCode;
};
