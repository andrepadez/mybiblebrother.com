import type { Handler } from 'hono';
import { db, eq, Users } from 'pertentodb';
import { sign } from 'hono-server/jwt';
import { sendMail } from 'emailer';
const { VITE_DASHBOARD_URL } = process.env;

export const forgotPasswordHandler: Handler = async (ctx) => {
  const { email } = ctx.get('body');

  const dbUser = await db.query.Users.findFirst({ where: eq(Users.email, email) });

  if (!dbUser) return ctx.json({ ok: true });
  const verificationCode = await sign({ id: dbUser.id, email }, '6h');
  const url = `${VITE_DASHBOARD_URL}/auth/reset-password?verificationCode=${verificationCode}`;

  sendMail({
    to: email,
    subject: 'Password Reset Request',
    template: 'ForgotPassword',
    data: { email, url },
  });

  return ctx.json({ verificationCode });
};
