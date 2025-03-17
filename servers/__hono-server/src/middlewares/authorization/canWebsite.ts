import type { Website } from 'types';
import type { MiddlewareHandler } from 'hono';
import { db, eq, Websites } from 'pertentodb';
import * as errors from 'hono-server/custom-errors';

export const canWebsite: MiddlewareHandler = async (ctx, next) => {
  const { user, body } = ctx.var;
  const websiteId = ctx.req.param('websiteId') || body?.websiteId;

  if (!websiteId || isNaN(websiteId)) return next();

  const website = await db.query.Websites.findFirst({
    where: eq(Websites.id, websiteId),
    with: {
      company: true,
    },
  }) as Website;

  const { id: companyId, parentCompanyId } = website.company;
  if (![companyId, parentCompanyId].includes(user.companyId)) {
    if (user.role !== 'Super Admin') {
      throw errors.FORBIDDEN();
    }
  }

  ctx.set('website', website);

  return next();
};
