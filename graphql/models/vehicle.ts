import * as NexusPrisma from 'nexus-prisma';
import * as Prisma from '@prisma/client';
import { objectType } from 'nexus';

export const Vehicles = objectType({
  name: NexusPrisma.Vehicle.$name,
  description: NexusPrisma.Vehicle.$description,
  definition(t) {
    t.nonNull.field(NexusPrisma.Vehicle.id);
    t.field(NexusPrisma.Vehicle.Houses);
    t.field(NexusPrisma.Vehicle.Reservations);
    t.nonNull.field(NexusPrisma.Vehicle.licensePlate);
    t.field(NexusPrisma.Vehicle.name);
  },
});
