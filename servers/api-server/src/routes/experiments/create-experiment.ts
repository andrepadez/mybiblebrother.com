import type { Handler } from 'hono'
import { db, eq, Experiments, Variants, ActivityLogs } from 'pertentodb';

export const createExperimentHandler: Handler = async (ctx) => {
  return db.transaction(async (tx) => {
    const { body, user } = ctx.var;
    const newExperiment = { ...body };
    newExperiment.createdBy = user.id;
    newExperiment.createdAt = newExperiment.updatedAt = new Date().valueOf();

    const [experiment] = await tx.insert(Experiments).values(newExperiment).returning();

    const { id: experimentId, websiteId, companyId, parentCompanyId } = experiment;
    const newVariant = {
      experimentId,
      websiteId,
      companyId,
      parentCompanyId,
      createdBy: user.id,
    };

    const ots = new Date().valueOf();
    const originalValues = { name: 'Original', ...newVariant, createdAt: ots, updatedAt: ots };
    await tx.insert(Variants).values(originalValues).returning();

    for (let variant of newExperiment.variants) {
      const vts = new Date().valueOf();
      const { name, redirectUrl } = variant;
      const variantValues = { name, redirectUrl, ...newVariant, createdAt: vts, updatedAt: vts };
      await tx.insert(Variants).values(variantValues).returning();
    }

    const log = {
      experimentId: experiment.id,
      userId: user.id,
      createdAt: new Date().valueOf(),
      message: `Created experiment`,
    };

    await tx.insert(ActivityLogs).values(log);

    return ctx.json(experiment);
  });
};
