import type { Handler } from 'hono'
import { db, eq, Experiments, Variants, Changes } from 'pertentodb';
import { UrlTargetings, DeviceTargetings, ActivityLogs } from 'pertentodb';

export const duplicateExperimentHandler: Handler = async (ctx) => {
  const { experimentId } = ctx.req.param();
  const { body, user } = ctx.var;
  const { name } = body;
  const { id: createdBy } = user;
  const now = new Date().valueOf();
  const where = eq(Experiments.id, +experimentId);
  return db.transaction(async (tx) => {
    const [dbExp] = await tx.select().from(Experiments).where(where);
    let values = { ...dbExp } as any
    delete values.id;
    delete values.startsAt;
    delete values.endsAt;
    delete values.finalVisitorCount;
    delete values.deleted;
    delete values.archived;
    values = { ...values, name, createdBy, status: 'Draft', createdAt: now, updatedAt: now };

    const [newExp] = await tx.insert(Experiments).values(values).returning();
    const dbVariants = await tx.select().from(Variants).where(eq(Variants.experimentId, +experimentId));

    for (let dbVariant of dbVariants) {
      const dbChanges = await tx.select().from(Changes).where(eq(Changes.variantId, dbVariant.id));
      const theVariant = { ...dbVariant } as any;
      delete theVariant.id;
      theVariant.experimentId = newExp.id;
      if (theVariant.weight === 0) theVariant.weight = null;
      const [newVariant] = await tx.insert(Variants).values(theVariant).returning();
      if (dbChanges.length === 0) continue;
      theVariant.experimentId = newExp.id;
      theVariant.createdAt = now;
      theVariant.updatedAt = now;
      await tx.insert(Changes).values(
        dbChanges.map((dbChange) => {
          const theChange = { ...dbChange } as any;
          delete theChange.id;
          return {
            ...theChange,
            variantId: newVariant.id,
            createdAt: now,
            updatedAt: now,
          };
        }),
      );
    }

    const dbUrlTargets = await db.select().from(UrlTargetings).where(eq(UrlTargetings.experimentId, +experimentId));

    if (dbUrlTargets.length > 0) {
      await tx.insert(UrlTargetings).values(
        dbUrlTargets.map((dbUrlTarget) => {
          const theUrlTarget = { ...dbUrlTarget } as any;
          delete theUrlTarget.id;
          return {
            ...theUrlTarget,
            experimentId: newExp.id,
          };
        }),
      );
    }

    const dbDeviceTargets = await db
      .select()
      .from(DeviceTargetings)
      .where(eq(DeviceTargetings.experimentId, +experimentId));

    if (dbDeviceTargets.length > 0) {
      await tx.insert(DeviceTargetings).values(
        dbDeviceTargets.map((dbDeviceTarget) => {
          const theDeviceTarget = { ...dbDeviceTarget } as any;
          delete theDeviceTarget.id;
          return {
            ...theDeviceTarget,
            experimentId: newExp.id,
          };
        }),
      );
    }

    const log = {
      userId: user.id,
      experimentId: newExp.id,
      createdAt: now,
      message: 'duplicated experiment',
    };

    await tx.insert(ActivityLogs).values(log);

    return ctx.json(newExp);
  });
};
