import * as NexusPrisma from 'nexus-prisma';
import * as Prisma from '@prisma/client';
import { Context } from 'graphql/context';
import { objectType } from 'nexus';

export const Reservations = objectType({
  name: NexusPrisma.Reservation.$name,
  description: NexusPrisma.Reservation.$description,
  definition(t) {
    t.nonNull.field(NexusPrisma.Reservation.id);
    t.field(NexusPrisma.Reservation.Community);
    t.field(NexusPrisma.Reservation.House);
    t.field(NexusPrisma.Reservation.User);
    t.field(NexusPrisma.Reservation.Vehicle);
    t.field(NexusPrisma.Reservation.reservedFrom);
    t.field(NexusPrisma.Reservation.reservedTo);
  },
});

export async function GetCurrentReservationsForCommunity(ctx: Context, communityId: string): Promise<Prisma.Reservation[]> {
  const date = new Date().toISOString();

  return await ctx.prisma.reservation.findMany({
    where: {
      communityId,
      reservedFrom: {
        lte: date,
      },
      reservedTo: {
        gte: date
      }
    },
    include: {
      Vehicle: true,
      Community: true,
      House: true,
      User: true
    }
  });
}