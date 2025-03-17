import type { Change } from 'types';
import { HonoRouter, canVariant, canExperiment, canWebsite } from 'hono-server';
import { db, eq, and, asc, desc, Experiments, Variants, Changes } from 'pertentodb';
import * as errors from 'hono-server/custom-errors';

export const editorDataRouter = HonoRouter();

editorDataRouter.get('/variant/:variantId', canVariant, async (ctx) => {
  const variant = ctx.get('variant');
  return ctx.json(variant);
});

editorDataRouter.get('/variant/:variantId/changes', canVariant, async (ctx) => {
  const { variantId } = ctx.req.param();
  const variant = ctx.get('variant');
  if (!variant) throw errors.NOT_FOUND();
  const { globalJavascript, globalCSS } = variant;

  const changes = await db.query.Changes.findMany({
    where: eq(Changes.variantId, +variantId),
    orderBy: asc(Changes.id),
    with: {
      user: {
        columns: { id: true, firstName: true, lastName: true },
      },
    },
  }) as Change[];

  return ctx.json([
    { globalJavascript, globalCSS },
    ...changes
      .toSorted((a, b) => (a.property === 'html' ? 1 : b.property === 'html' ? -1 : 0))
      .map((change) => {
        const theChange = { ...change } as any;
        const user = theChange.user;
        const { firstName, lastName } = user;
        delete theChange.user;
        return { ...change, changedBy: `${firstName} ${lastName}` };
      }),
  ]);
});

editorDataRouter.get('/experiment/:experimentId', canExperiment, async (ctx) => {
  const { experimentId } = ctx.req.param();
  const experiment = await db.query.Experiments.findFirst({
    where: eq(Experiments.id, +experimentId),
  });

  return ctx.json(experiment);
});

editorDataRouter.get('/variants/:experimentId', canExperiment, async (ctx) => {
  const { experimentId } = ctx.req.param();
  const where = eq(Variants.experimentId, +experimentId);
  const variants = await db.query.Variants.findMany({
    where: eq(Variants.experimentId, +experimentId),
  });
  return ctx.json(variants);
});

editorDataRouter.get('/websites/:websiteId/experiments', canWebsite, async (ctx) => {
  const { websiteId } = ctx.req.param();
  const experiments = await db.query.Experiments.findMany({
    where: and(eq(Experiments.websiteId, +websiteId)),
    with: { variants: { with: { changes: true } } },
    orderBy: desc(Experiments.id),
  });
  return ctx.json(experiments);
});
