import * as Prisma from '@prisma/client';
import { Context } from 'graphql/context';

export async function GetUserPassword(ctx: Context, user: Prisma.User): Promise<Prisma.Password | null> {
  return await ctx.prisma.password.findUnique({
    where: {
      id: user.id
    }
  });
}