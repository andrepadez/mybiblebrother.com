import { HonoRouter } from 'hono-server';
import { addUrlTargetingHandler } from './add-url-targeting';
import { editUrlTargetingHandler } from './edit-url-targeting';
import { deleteUrlTargetingHandler } from './delete-url-targeting';

export const urlTargetingRouter = HonoRouter();

urlTargetingRouter.post('/', addUrlTargetingHandler);
urlTargetingRouter.put('/:urlTargetingId', editUrlTargetingHandler);
urlTargetingRouter.delete('/:urlTargetingId', deleteUrlTargetingHandler);
