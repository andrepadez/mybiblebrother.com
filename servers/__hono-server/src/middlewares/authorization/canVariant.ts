import type { MiddlewareHandler } from 'hono';
import { db, eq, Variants } from 'pertentodb';
import * as errors from 'hono-server/custom-errors';

export const canVariant: MiddlewareHandler = async (ctx, next) => {
  const { user, body } = ctx.var;
  const variantId = ctx.req.param('variantId') || body?.variantId;
  if (!variantId || isNaN(variantId)) return next();

  const variant = await db.query.Variants.findFirst({
    where: eq(Variants.id, +variantId),
    with: { screenshots: true }
  });

  if (!variant) throw errors.NOT_FOUND();

  const { companyId, parentCompanyId } = variant;
  if (![companyId, parentCompanyId].includes(user.companyId)) {
    if (user.role !== 'Super Admin') {
      throw errors.FORBIDDEN();
    }
  }

  ctx.set('variant', variant);

  return next();
};
