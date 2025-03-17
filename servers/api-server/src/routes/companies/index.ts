import { HonoRouter } from 'hono-server';
import { db, eq, Companies, Websites } from 'pertentodb';

export const companiesRouter = HonoRouter();

companiesRouter.get('/:companyId/clients', async (ctx) => {
  const { companyId } = ctx.req.param();

  const companies = await db.query.Companies.findMany({
    where: eq(Companies.parentCompanyId, +companyId),
    orderBy: [Companies.name],
    with: {
      websites: {
        where: eq(Websites.deleted, false),
        with: { ganProperty: true, ganPropertyTags: true },
      },
    },
  });

  return ctx.json(companies);
});

companiesRouter.post('/', async (ctx) => {
  const { body, user } = ctx.var;
  const newCompany = { ...body };
  newCompany.friendlyName = body.name;
  if (!newCompany.parentCompanyId) {
    newCompany.parentCompanyId = user.company.id;
  }

  const [dbCompany] = await db.insert(Companies).values(newCompany).returning();
  return ctx.json(dbCompany);
});

companiesRouter.put('/:companyId', async (ctx) => {
  const { body, user } = ctx.var;
  const { companyId } = ctx.req.param();
  const [dbCompany] = await db.update(Companies).set(body).where(eq(Companies.id, +companyId)).returning();
  return ctx.json(dbCompany);
});

companiesRouter.delete('/:companyId', async (ctx) => {
  const { companyId } = ctx.req.param();
  await db.delete(Companies).where(eq(Companies.id, +companyId));
  return ctx.json({ ok: true });
});
