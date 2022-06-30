import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { IncomingMessage, ServerResponse } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { prisma } from 'db';

export type Context = {
  req: IncomingMessage;
  res: ServerResponse;
  prisma: PrismaClient;
  session?: Session
  // token: UserToken | null;
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
  // token: UserToken | null;
}

export const tokens = {
  access: {
    name: 'ACCESS_TOKEN',
    expiry: '1d',
  },
};

export function getIpAddress(ctx: Context): string {
  const ip = (ctx.req.headers['x-forwarded-for'] as string)?.split(',').shift() ||
  ctx.req.socket.remoteAddress!;

  return ip;
}

export function userIdentifier(ctx: Context): string {
  const ip = getIpAddress(ctx);

  console.log(`IP Address: ${ip} | user id: ${ctx.session?.user}`);
  return ctx.session?.user ?? ip;
}

export interface Token {
  userId: number
  type: string
  timestamp: number
}

interface IncomingContext {
  req: NextApiRequest// IncomingMessage;
  res: NextApiResponse// ServerResponse;
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
    // token: null
  };
};

export const createContext = async (ctx: IncomingContext): Promise<Context> => {
  console.log('Here 1');
  const userSession = await getSession({ ctx });

  console.log('Creating context for:');
  console.log(JSON.stringify(userSession));

  return {
    ...ctx,
    prisma,
    session: userSession ?? undefined
  };
};