import { sign as jwtSign, verify as jwtVerify } from 'hono/jwt'
// import * as errors from 'hono-server';

const { JWT_SECRET } = process.env;

export const sign = async (payload: any, expiration = '30d') => {
  const data = { ...payload, exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 };
  return jwtSign(data, JWT_SECRET!)

};

export const verify: (token: string) => Promise<any> = async (token) => {
  return jwtVerify(token, JWT_SECRET!);
};