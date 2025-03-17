import type { Experiment } from 'types';
import type { MiddlewareHandler } from 'hono-server';
import { db, eq, desc, Experiments, ActivityLogs } from 'pertentodb';
import * as errors from 'hono-server';

export const canExperiment: MiddlewareHandler = async (ctx, next) => {
  const { body, user } = ctx.var;
  let experimentId = ctx.req.param('experimentId') || body?.experimentId;
  if (!experimentId || isNaN(experimentId)) return next();

  const experiment = await db.query.Experiments.findFirst({
    where: eq(Experiments.id, experimentId),
    with: {
      website: {
        with: {
          company: true,
        },
      },
      variants: { with: { changes: true, screenshots: true, visitorCount: { columns: { count: true } }, experiment: {} } },
      activityLog: { with: { user: true }, orderBy: desc(ActivityLogs.createdAt) },
      deviceTargeting: true,
      cookieTargeting: true,
      urlTargeting: true,
    },
  }) as Experiment;

  if (!experiment) throw errors.NOT_FOUND();

  const { id: companyId, parentCompanyId } = experiment.website.company;
  if (![companyId, parentCompanyId].includes(user.companyId)) {
    if (user.role !== 'Super Admin') {
      throw errors.FORBIDDEN();
    }
  }

  ctx.set('experiment', experiment);

  return next();
};
