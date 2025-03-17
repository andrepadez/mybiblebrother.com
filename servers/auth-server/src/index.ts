import { HonoServer, originMiddleware } from 'hono-server';
import { userMiddleware } from 'hono-server';
import { signinHandler } from './signin';
import { signupHandler } from './signup';
import { verifyHandler } from './verify';
import { changePasswordHandler } from './change-password';
import { forgotPasswordHandler } from './forgot-password';
import { resetPasswordHandler } from './reset-password';
import { inviteUserHandler, resendInvitationHandler } from './invite-user';
import { usersMe } from './users-me';
import { passkeyRouter } from './passkey-router';

const { AUTH_PORT: PORT } = process.env;

const app = HonoServer(PORT!, 'Authentication Server');

app.use(originMiddleware);

app.use('/', async (c) => c.json({ pertentoAuthenticationServer: 'v0.1.0' }));

app.get('/me', userMiddleware, usersMe);
app.post('/signin', signinHandler);//check
app.post('/signup', signupHandler);//check
app.post('/verify', verifyHandler);//check
app.post('/change-password', userMiddleware, changePasswordHandler); //check
app.post('/forgot-password', forgotPasswordHandler);//check
app.post('/reset-password', resetPasswordHandler);//check
app.post('/invite', userMiddleware, inviteUserHandler);
app.post('/resend-invite', userMiddleware, resendInvitationHandler);
app.route('/passkeys', passkeyRouter);//check
