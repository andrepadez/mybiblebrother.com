import type { Handler } from 'hono'
import { db, eq, Experiments, Variants, VisitorCounts, Changes, ActivityLogs } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const deployExperimentHandler: Handler = async (ctx) => {
  const { experimentId, variantId } = ctx.req.param();
  const { user } = ctx.var;
  const now = new Date().valueOf();

  return db.transaction(async (tx) => {
    const [experiment] = await tx
      .update(Experiments)
      .set({ status: 'Deployed' })
      .where(eq(Experiments.id, +experimentId))
      .returning();

    const variant = await tx.query.Variants.findFirst({
      where: eq(Variants.id, +variantId),
      columns: { id: false },
      with: {
        changes: {
          columns: { id: false },
        },
      },
    });

    if (!experiment || !variant) throw customErrors.NOT_FOUND();


    const [deployedVariant] = await tx
      .insert(Variants)
      .values({ ...variant, deployed: now, weight: 10000, name: `${variant.name} (DEPLOYED)` })
      .returning();

    const values = { experimentId: +experimentId, variantId: deployedVariant.id, count: 0 }
    await tx.insert(VisitorCounts).values(values);

    if (variant.changes.length > 0) {
      await tx.insert(Changes).values(variant.changes.map((change) => ({ ...change, variantId: deployedVariant.id })));
    }

    const log = {
      experimentId,
      userId: user.id,
      createdAt: now,
      message: `Deployed variant ${variant.name} (${variantId})`,
    };

    await tx.insert(ActivityLogs).values(log);

    return ctx.json({ ok: true });
  });
};
