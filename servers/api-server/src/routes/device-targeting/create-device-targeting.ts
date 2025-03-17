import type { Handler } from 'hono'
import { db, eq, DeviceTargetings, ActivityLogs } from 'pertentodb';

export const createDeviceTargetingHandler: Handler = async (ctx) => {
  const now = new Date().valueOf();
  const { user, body } = ctx.var;
  const { device, experimentId } = body;
  const newTargeting = { device, experimentId, createdBy: user.id, createdAt: now };
  const [targeting] = await db.insert(DeviceTargetings).values(newTargeting).returning();

  const log = {
    experimentId,
    userId: user.id,
    createdAt: now,
    message: `Added ${device} Device targeting`,
  };
  await db.insert(ActivityLogs).values(log);


  return ctx.json(targeting);
};
