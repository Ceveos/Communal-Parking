import * as NexusPrisma from 'nexus-prisma';
import * as Prisma from '@prisma/client';
import { Context } from 'graphql/context';
import { objectType } from 'nexus';

export const Users = objectType({
  name: NexusPrisma.User.$name,
  description: NexusPrisma.User.$description,
  definition(t) {
    t.nonNull.field(NexusPrisma.User.id);
    t.field(NexusPrisma.User.House);
    t.field(NexusPrisma.User.Reservations);
    t.field(NexusPrisma.User.name);
    t.field(NexusPrisma.User.email);
  },
});

export async function GetUserByEmail(ctx: Context, email: string): Promise<Prisma.User | null> {
  return await ctx.prisma.user.findUnique({
    where: {
      email
    }
  });
}

export async function ConnectUserToHouse(ctx: Context, userId: string, communityId: string, houseUnit: string): Promise<Prisma.User | null> {
  return await ctx.prisma.user.update({
    where: {
      id: userId
    },
    data: {
      House: {
        connect: {
          communityId_unit: {
            communityId: communityId,
            unit: houseUnit
          }
        }
      }
    }
  });
}

export async function CreateUserToHouse(ctx: Context, email: string, name: string, communityId: string, houseUnit: string): Promise<Prisma.User | null> {
  return await ctx.prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name: name,
      House: {
        connect: {
          communityId_unit: {
            communityId: communityId,
            unit: houseUnit
          }
        }
      }
    }
  });
}