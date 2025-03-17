import type { Handler } from 'hono';
import { EXPERIMENT_STATUSES } from 'definitions';
import { db, eq, Variants, Experiments, ActivityLogs, VisitorCounts } from 'pertentodb';

export const startExperimentHandler: Handler = async (ctx) => {
  const { experimentId } = ctx.req.param();
  const { body, user } = ctx.var;
  const { variantWeights, startsAt = new Date().valueOf() } = body;

  return db.transaction(async (tx) => {
    const variantIds = (variantWeights as any[]).map((v) => v.id);
    await db.query.Experiments.findFirst({
      where: eq(Experiments.id, +experimentId),
    });

    for (let variantId of variantIds) {
      const values = { experimentId: +experimentId, variantId, count: 0 };
      await tx.insert(VisitorCounts).values(values);
    }

    for (let variant of variantWeights) {
      const where = eq(Variants.id, variant.id);
      await tx
        .update(Variants)
        .set({ weight: variant.weight || 0 })
        .where(where);
    }

    const where = eq(Experiments.id, +experimentId);
    const values = { startsAt, status: 'Running' as typeof EXPERIMENT_STATUSES[number] };
    const [updatedExperiment] = await tx.update(Experiments).set(values).where(where).returning();

    const activity = {
      userId: user.id,
      experimentId,
      createdAt: startsAt,
      message: 'started the experiment',
    };

    await tx.insert(ActivityLogs).values(activity);

    return ctx.json(updatedExperiment);
  });
};
