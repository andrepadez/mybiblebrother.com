import { HonoRouter } from 'hono-server';
import { db, eq, desc, Screenshots } from 'pertentodb'
import { createClient } from 's3'

const s3Client = createClient('screenshots')

export const screenshotsRouter = HonoRouter();

screenshotsRouter.get('/:variantId', async (ctx) => {
  const { variantId } = ctx.req.param();
  const screenshots = await db.select().from(Screenshots).where(eq(Screenshots.variantId, +variantId)).orderBy(desc(Screenshots.id));
  return ctx.json(screenshots);
})

screenshotsRouter.post('/', async (ctx) => {
  const { body, user } = ctx.var;

  const screenshot = { ...body, createdBy: user.id }

  await db.insert(Screenshots).values(screenshot)

  return ctx.json({ message: 'Screenshot saved' });
});


screenshotsRouter.delete('/:screenshotId', async (ctx) => {
  const { screenshotId } = ctx.req.param();
  return db.transaction(async (tx) => {
    const [{ id, url }] = await db.delete(Screenshots).where(eq(Screenshots.id, +screenshotId)).returning();
    const file = s3Client.file(url.replace('screenshots/', ''))
    await file.delete()
    return ctx.json({ success: true });
  });
})

screenshotsRouter.put('/:screenshotId', async (ctx) => {
  const { screenshotId } = ctx.req.param();
  const { body } = ctx.var;

  await db.update(Screenshots).set(body).where(eq(Screenshots.id, +screenshotId))

  return ctx.json({ ok: true });
});