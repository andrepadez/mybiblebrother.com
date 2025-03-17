import type { Handler } from 'hono'

export const experimentByIdHandler: Handler = async (ctx) => {
  const experiment = ctx.get('experiment');
  return ctx.json(experiment);
};
