import type { Handler } from 'hono'
import { db, eq, DeviceTargetings, ActivityLogs } from 'pertentodb';
import * as customErrors from 'hono-server/custom-errors';

export const deleteDeviceTargetingHandler: Handler = async (ctx) => {
  const { deviceTargetingId } = ctx.req.param();
  const { user } = ctx.var;

  const [dbDeviceTargeting] = await db.delete(DeviceTargetings).where(eq(DeviceTargetings.id, +deviceTargetingId)).returning();
  if (!dbDeviceTargeting) throw customErrors.NOT_FOUND();

  const log = {
    experimentId: dbDeviceTargeting.experimentId,
    userId: user.id,
    createdAt: new Date().valueOf(),
    message: `Deleted targeting for ${dbDeviceTargeting.device} Device`,
  };

  await db.insert(ActivityLogs).values(log);

  return ctx.json({ ok: true });
};
