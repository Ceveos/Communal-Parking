import * as NexusPrisma from 'nexus-prisma';
import * as Prisma from '@prisma/client';
import { objectType } from 'nexus';

export const Communities = objectType({
  name: NexusPrisma.Community.$name,
  description: NexusPrisma.Community.$description,
  definition(t) {
    t.nonNull.field(NexusPrisma.Community.id);
    t.field(NexusPrisma.Community.Houses);
    t.field(NexusPrisma.Community.Reservations);
    t.nonNull.field(NexusPrisma.Community.parkingSpaces);
    t.field(NexusPrisma.Community.subdomain);
  },
});
