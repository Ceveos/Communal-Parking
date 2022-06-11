import * as NexusPrisma from 'nexus-prisma';
import * as Prisma from '@prisma/client';
import { objectType } from 'nexus';

export const HousesOnVehicles = objectType({
  name: NexusPrisma.HousesOnVehicles.$name,
  description: NexusPrisma.HousesOnVehicles.$description,
  definition(t) {
    t.nonNull.field(NexusPrisma.HousesOnVehicles.House);
    t.nonNull.field(NexusPrisma.HousesOnVehicles.Vehicle);
  },
});
