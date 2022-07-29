import * as NexusPrisma from 'nexus-prisma';
import * as Prisma from '@prisma/client';
import { Context } from 'graphql/context';
import { objectType } from 'nexus';

export const Houses = objectType({
  name: NexusPrisma.House.$name,
  description: NexusPrisma.House.$description,
  definition(t) {
    t.nonNull.field(NexusPrisma.House.id);
    t.field(NexusPrisma.House.Community);
    t.field(NexusPrisma.House.Users);
    t.field(NexusPrisma.House.Vehicles);
    t.field(NexusPrisma.House.unit);
    t.field(NexusPrisma.House.createdAt);
    t.field(NexusPrisma.House.updatedAt);
  },
});

export async function AddHouse(ctx: Context, unit: string, communityId: string): Promise<Prisma.House> {
  const res = await ctx.prisma.house.create({
    data: {
      unit: unit,
      Community: {
        connect: {
          id: communityId
        }
      }
    }
  });

  return res;
}

export async function GetTenantsByHouseId(ctx: Context, communityId: string, houseId: string): Promise<Prisma.User[] | null> {
  const res = await ctx.prisma.house.findUnique({
    where: {
      id: houseId
    },
    include: {
      Users: true
    }
  });

  return res?.Users ?? null;
}

export async function GetTenantsByUnit(ctx: Context, communityId: string, unit: string): Promise<Prisma.User[] | null> {
  const res = await ctx.prisma.house.findUnique({
    where: {
      communityId_unit: {
        communityId: communityId,
        unit: unit
      }
    },
    include: {
      Users: true
    }
  });

  return res?.Users ?? null;
}