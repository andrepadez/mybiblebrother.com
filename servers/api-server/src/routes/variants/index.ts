import { HonoRouter } from 'hono-server';
import { createVariantHandler } from './create-variant';
import { updateVariantHandler } from './update-variant';
import { deleteVariantHandler } from './delete-variant';
import { changeNameHandler } from './change-name';
import { changeWeightHandler } from './change-weight';
import { setMaxWeightHandler } from './set-max-weight';
import { resetWeightHandler } from './reset-weight';
import { screenshotsRouter } from '../variants/screenshots';

export const variantsRouter = HonoRouter();

variantsRouter.post('/', createVariantHandler);
variantsRouter.put('/:variantId', updateVariantHandler);
variantsRouter.delete('/:variantId', deleteVariantHandler);
variantsRouter.put('/:variantId/change-name', changeNameHandler);
variantsRouter.put('/:variantId/change-weight', changeWeightHandler);
variantsRouter.put('/:variantId/reset-weight', resetWeightHandler);
variantsRouter.put('/:variantId/set-max-weight', setMaxWeightHandler);
variantsRouter.route('/screenshots', screenshotsRouter);

