import 'moment-timezone';
import * as NexusPrisma from 'nexus-prisma';
import * as Prisma from '@prisma/client';
import { Context } from 'graphql/context';
import { GetCommunitySlugFromCommunityId, GetTimezoneFromCommunity } from './community';
import { GetHouseByHouseId } from './house';
import { UserInputError } from 'apollo-server-micro';
import { objectType } from 'nexus';
import moment from 'moment';

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
  const timezone = await GetTimezoneFromCommunity(ctx, communityId);
  const date = moment.tz(moment(), timezone).utc(true).toDate();

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

export async function GetCurrentReservationsForHouse(ctx: Context, houseId: string): Promise<Prisma.Reservation[]> {

  const house = await GetHouseByHouseId(ctx, houseId);

  if (!house) {
    throw new UserInputError('House ID does not exist');
  }

  const timezone = await GetTimezoneFromCommunity(ctx, house.communityId);
  const date = moment.tz(moment(), timezone).utc(true).toDate();

  return await ctx.prisma.reservation.findMany({
    where: {
      houseId,
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

export async function IsVehicleReservedAtDate(ctx: Context, date: Date, vehicleId: string): Promise<boolean> {
  return await ctx.prisma.reservation.count({
    where: {
      reservedFrom: {
        lte: date
      },
      reservedTo: {
        gte: date
      },
      vehicleId: vehicleId
    }
  }) > 0;
}

export async function IsVehicleOwnedByUser(ctx: Context, vehicleId: string): Promise<boolean> {
  const vehicle = await ctx.prisma.vehicle.findUnique({
    where: {
      id: vehicleId
    },
    include: {
      House: true
    }
  });

  return vehicle?.House?.id === ctx.token?.houseId;
}

export async function ReservationCapacityAvailableAtcommunity(ctx: Context, communityId: string): Promise<boolean> {
  const community = await ctx.prisma.community.findUnique({
    where: {
      id: communityId
    }
  });

  const currentReservations = await GetCurrentReservationsForCommunity(ctx, communityId);

  if (!community || !currentReservations) {
    return false;
  }

  return community.parkingSpaces > currentReservations.length;
}

export async function AddReservation(ctx: Context, communityId: string, houseId: string, userId: string, vehicleId: string, date: Date ): Promise<Prisma.Reservation> {
  const res = await ctx.prisma.reservation.create({
    data: {
      reservedFrom: moment(date).utc().startOf('day').toDate(),
      reservedTo: moment(date).utc().endOf('day').toDate(),
      Community: {
        connect: {
          id: communityId
        }
      },
      House: {
        connect: {
          id: houseId
        }
      },
      User: {
        connect: {
          id: userId
        }
      },
      Vehicle: {
        connect: {
          id: vehicleId
        }
      }
    },
    include: {
      Community: true,
      House: true,
      User: true,
      Vehicle: true
    }
  });

  const communityName = await GetCommunitySlugFromCommunityId(ctx, communityId);

  await ctx.res.revalidate(`/_sites/${communityName}`);
  await ctx.res.revalidate(`/_sites/${communityName}/vehicle/${vehicleId}`);
  await ctx.res.revalidate(`/_sites/${communityName}/unit/${res.House.unit}`);
  return res;
}