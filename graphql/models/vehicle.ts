import * as NexusPrisma from 'nexus-prisma';
import { Context } from 'graphql/context';
import { HouseOnVehicle } from 'lib/queries/housesOnVehicles';
import { Prisma } from '@prisma/client';
import { objectType } from 'nexus';

export const Vehicles = objectType({
  name: NexusPrisma.Vehicle.$name,
  description: NexusPrisma.Vehicle.$description,
  definition(t) {
    t.nonNull.field(NexusPrisma.Vehicle.id);
    t.nonNull.field(NexusPrisma.Vehicle.name);
    t.field(NexusPrisma.Vehicle.description);
    t.nonNull.field(NexusPrisma.Vehicle.licensePlate);
    t.field(NexusPrisma.Vehicle.houseId);
    t.field(NexusPrisma.Vehicle.House);
    t.field(NexusPrisma.Vehicle.userId);
    t.field(NexusPrisma.Vehicle.User);
    t.field(NexusPrisma.Vehicle.Reservations);
    t.nonNull.field(NexusPrisma.Vehicle.personal);
    t.nonNull.field(NexusPrisma.Vehicle.hidden);
    t.nonNull.field(NexusPrisma.Vehicle.createdAt);
    t.nonNull.field(NexusPrisma.Vehicle.updatedAt);
  },
});

export async function GetVehiclesByHouse(ctx: Context, houseId: string): Promise<HouseOnVehicle[] | null> {
  return await ctx.prisma.vehicle.findMany({
    where: {
      houseId: houseId
    },
    include: {
      House: true
    }
  });
}

export type AddVehicleParam = Pick<Prisma.VehicleGetPayload<{}>, 'name' | 'licensePlate' | 'description' | 'personal'>

export async function AddVehicle(ctx: Context, data: AddVehicleParam, houseId: string, userId: string): Promise<Prisma.VehicleGetPayload<{}> | null> {
  return await ctx.prisma.vehicle.create({
    data: {
      ...data,
      House: {
        connect: {
          id: houseId
        }
      },
      User: {
        connect: {
          id: userId
        }
      }
    }
  });
}