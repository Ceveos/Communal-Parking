import * as NexusPrisma from 'nexus-prisma';
import * as Prisma from '@prisma/client';
import { objectType } from 'nexus';

export const Houses = objectType({
  name: NexusPrisma.House.$name,
  description: NexusPrisma.House.$description,
  definition(t) {
    t.nonNull.field(NexusPrisma.House.id);
    t.field(NexusPrisma.House.Community);
    t.field(NexusPrisma.House.Tenants);
    t.field(NexusPrisma.House.Vehicles);
    t.field(NexusPrisma.House.unit);
  },
});