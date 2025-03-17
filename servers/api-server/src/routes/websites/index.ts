import type { Experiment } from 'types';
import { HonoRouter } from 'hono-server';
import { db, eq, isNull, and, desc } from 'pertentodb';
import { Websites, Experiments } from 'pertentodb';

export const websitesRouter = HonoRouter();

websitesRouter.get('/:companyId', async (ctx) => {
  const { companyId } = ctx.req.param();
  const body = ctx.get('body');

  const websites = await db.query.Websites.findMany({
    where: and(eq(Websites.companyId, +companyId!), eq(Websites.deleted, false)),
    with: { ganProperty: true, ganPropertyTags: true },
  });

  return ctx.json(websites);
});

websitesRouter.post('/', async (ctx) => {
  const body = ctx.get('body');
  const [website] = await db.insert(Websites).values(body).returning();
  return ctx.json(website);
});

websitesRouter.get('/:websiteId/experiments', async (ctx) => {
  const { websiteId } = ctx.req.param();

  const experiments = await db.query.Experiments.findMany({
    where: and(eq(Experiments.websiteId, +websiteId!), isNull(Experiments.deleted)),
    orderBy: desc(Experiments.createdAt),
    with: { visitorCounts: true, variants: true },
  });

  for (let experiment of experiments as Experiment[]) {
    experiment.sessions = experiment.visitorCounts.reduce((acc, vc) => acc + vc.count!, 0);
  }

  return ctx.json(experiments);
});

websitesRouter.put('/:websiteId', async (ctx) => {
  const { websiteId } = ctx.req.param();
  const body = ctx.get('body');
  const [website] = await db.update(Websites).set(body).where(eq(Websites.id, +websiteId!)).returning();
  return ctx.json(website);
});

websitesRouter.delete('/:websiteId', async (ctx) => {
  const { websiteId } = ctx.req.param();
  const [website] = await db.update(Websites).set({ deleted: true }).where(eq(Websites.id, +websiteId!)).returning();
  return ctx.json(website);
});
