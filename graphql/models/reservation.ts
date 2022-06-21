import * as NexusPrisma from 'nexus-prisma';
import * as Prisma from '@prisma/client';
import { objectType } from 'nexus';

export const Reservations = objectType({
  name: NexusPrisma.Reservation.$name,
  description: NexusPrisma.Reservation.$description,
  definition(t) {
    t.nonNull.field(NexusPrisma.Reservation.id);
    t.field(NexusPrisma.Reservation.Community);
    t.field(NexusPrisma.Reservation.Vehicle);
    t.field(NexusPrisma.Reservation.reservedFrom);
    t.field(NexusPrisma.Reservation.reservedTo);
  },
});
