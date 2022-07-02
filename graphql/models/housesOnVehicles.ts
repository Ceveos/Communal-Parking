import * as NexusPrisma from 'nexus-prisma';
import { Context } from 'graphql/context';
import { HouseOnVehicle } from 'lib/queries/housesOnVehicles';
import { objectType } from 'nexus';

export const HousesOnVehicles = objectType({
  name: NexusPrisma.HousesOnVehicles.$name,
  description: NexusPrisma.HousesOnVehicles.$description,
  definition(t) {
    t.nonNull.field(NexusPrisma.HousesOnVehicles.House);
    t.nonNull.field(NexusPrisma.HousesOnVehicles.Vehicle);
    t.nonNull.field(NexusPrisma.HousesOnVehicles.createdAt);
    t.nonNull.field(NexusPrisma.HousesOnVehicles.updatedAt);
  },
});

export async function GetVehiclesByHouse(ctx: Context, houseId: string): Promise<HouseOnVehicle[] | null> {
  return await ctx.prisma.housesOnVehicles.findMany({
    where: {
      houseId: houseId
    },
    include: {
      House: true,
      Vehicle: true
    }
  });
}