// import type { User, Experiment, Variant } from 'types';
import type { ServerWebSocket } from 'bun';
// import { $ } from 'bun';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createBunWebSocket } from 'hono/bun';
import { bodyParser } from './middlewares/body-parser';
// import { CustomError } from './custom-errors';
// import { sendMail } from 'emailer';
export * from 'hono';
// export * from './jwt';
// export * from './middlewares';
// export * from 'hono/jsx-renderer';
// export * from './custom-errors';

export type HonoVariables = {
  // body: any;
  // origin: string;
  // user: User;
  // experiment: Experiment;
  // variant: Variant;
};




export const HonoRouter = () => new Hono<{ Variables: HonoVariables }>();

type HonoServer = (
  port: string,
  serverName: string,
  onSocketMessage?: (ws: any, message: string) => void
) => Hono<{ Variables: HonoVariables }>;

export const HonoServer: HonoServer = (port, serverName, onSocketMessage) => {
  const app = new Hono<{ Variables: HonoVariables }>();
  app.use(cors({
    origin: '*', // Adjust the origin as needed
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(bodyParser());

  app.onError((error, ctx) => {
    // if (error instanceof CustomError && !error.returnValue) {
    //   return ctx.text(error.message, error.statusCode);
    // }

    const headers = ctx.req.header();
    const stack = error.stack;
    const message = error.message;
    // const { body, user } = ctx.var;
    const url = ctx.req.url;
    const method = ctx.req.method;
    const timestamp = new Date().toLocaleString();

    // sendMail({
    //   to: 'andre.padez@pertento.ai',
    //   subject: `Unexpected Error in Server ${serverName} (${timestamp})`,
    //   template: 'UnexpectedError',
    //   data: {
    //     serverName,
    //     timestamp,
    //     url,
    //     method,
    //     message,
    //     stack,
    //     body,
    //     headers: JSON.parse(JSON.stringify(headers)),
    //     user,
    //   },
    // });

    console.log('message', message);
    console.log('stack', stack);
    // console.log('body', body);

    // if (error instanceof CustomError && error.returnValue) {
    //   if (typeof error.returnValue === 'string') {
    //     return ctx.text(error.returnValue, error.statusCode);
    //   } else {
    //     return ctx.json(error.returnValue, error.statusCode);
    //   }
    // }

    return ctx.text('message', 501);
  });

  const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>()

  app.get(
    '/ws',
    upgradeWebSocket((ctx) => {
      return {
        onOpen: () => {
          // console.log('Connection opened', serverName)
        },
        onMessage: async (evt, ws: any) => {
          const origin = ctx.req.header('Origin');
          console.log('origin', origin);
          if (onSocketMessage) {
            if (typeof evt.data === 'string') {
              const data = JSON.parse(evt.data);
              onSocketMessage(ws, data);
            } else if (evt.data instanceof Blob) {
              const text = await evt.data.text();
              const data = JSON.parse(text);
              onSocketMessage(ws, text);
            }
          }
        },
        onClose: () => {
          // console.log('Connection closed', serverName)
        },
      }
    })
  )

  Bun.serve({
    port,
    idleTimeout: 60,
    fetch: app.fetch,
    websocket,
  });

  console.log(serverName, 'running on port', port);

  return app;
};
