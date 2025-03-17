import { HonoRouter, canWebsite, canExperiment } from 'hono-server';
import { experimentByIdHandler } from './experiment-by-id';
import { createExperimentHandler } from './create-experiment';
import { updateExperimentHandler } from './update-experiment';
import { deleteExperimentHandler } from './delete-experiment';
import { archiveExperimentHandler } from './archive-experiment';
import { duplicateExperimentHandler } from './duplicate-experiment';
import { startExperimentHandler } from './start-experiment';
import { endExperimentHandler } from './end-experiment';
import { deployExperimentHandler } from './deploy-experiment';
import { getVariantsHandler } from './get-variants';

export const experimentsRouter = HonoRouter();
experimentsRouter.use('/:experimentId', canExperiment);

experimentsRouter.post('/', canWebsite, createExperimentHandler);
experimentsRouter.post('/:experimentId/start', startExperimentHandler);
experimentsRouter.post('/:experimentId/end', endExperimentHandler);
experimentsRouter.post('/:experimentId/deploy/:variantId', deployExperimentHandler);
experimentsRouter.post('/:experimentId/duplicate', duplicateExperimentHandler);
experimentsRouter.post('/:experimentId/archive', archiveExperimentHandler);

experimentsRouter.put('/:experimentId', updateExperimentHandler);

experimentsRouter.delete('/:experimentId', deleteExperimentHandler);

experimentsRouter.get('/:experimentId', experimentByIdHandler);
experimentsRouter.get('/:experimentId/variants', getVariantsHandler);
