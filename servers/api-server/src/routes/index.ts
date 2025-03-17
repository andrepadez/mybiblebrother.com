import { HonoRouter, userMiddleware } from 'hono-server';
import { usersRouter } from './users';
import { changesRouter } from './changes';
import { editorDataRouter } from './editor-data';
import { companiesRouter } from './companies';
import { deviceTargetingRouter } from './device-targeting';
import { urlTargetingRouter } from './url-targeting';
import { cookieTargetingRouter } from './cookie-targeting';
import { variantsRouter } from './variants';
import { websitesRouter } from './websites';
import { experimentsRouter } from './experiments';

export const apiRouter = HonoRouter();
apiRouter.use(userMiddleware);
apiRouter.route('/users', usersRouter);
apiRouter.route('/changes', changesRouter);
apiRouter.route('/editor-data', editorDataRouter);
apiRouter.route('/companies', companiesRouter);
apiRouter.route('/device-targeting', deviceTargetingRouter);
apiRouter.route('/url-targeting', urlTargetingRouter);
apiRouter.route('/cookie-targeting', cookieTargetingRouter);
apiRouter.route('/variants', variantsRouter);
apiRouter.route('/websites', websitesRouter);
apiRouter.route('/experiments', experimentsRouter);
