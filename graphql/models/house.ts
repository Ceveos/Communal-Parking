import * as NexusPrisma from 'nexus-prisma';
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
