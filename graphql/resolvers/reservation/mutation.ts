import { AddReservation, CancelReservation, IsVehicleOwnedByUser, IsVehicleReservedAtDate, ReservationCapacityAvailableAtHouse, ReservationCapacityAvailableAtcommunity } from 'graphql/models';
import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-micro';
import { mutationField, nonNull, stringArg } from 'nexus';

export const addReservation = mutationField('addReservation', {
  type: 'Reservation',
  args: {
    date: nonNull(stringArg()),
    vehicleId: nonNull(stringArg()),
  },
  complexity: 50,
  resolve: async (_, args, ctx) => {
    const { token } = ctx;

    const date = new Date(args.date);

    if (!token || !token.communityId || !token.houseId) {
      throw new AuthenticationError('Invalid token');
    }

    const vehicleOwnedByUser = await IsVehicleOwnedByUser(ctx, args.vehicleId);

    if (!vehicleOwnedByUser) {
      throw new AuthenticationError('Vehicle not owned by user');
    }

    const conflictingReseration = await IsVehicleReservedAtDate(ctx, date, args.vehicleId);

    if (conflictingReseration) {
      throw new UserInputError('Reservation conflicting with pre-existing reservation');
    }

    const houseReservationCapacity = await ReservationCapacityAvailableAtHouse(ctx, token.communityId, token.houseId, date);

    if (!houseReservationCapacity) {
      throw new UserInputError('No future reservation slots available');
    }

    const reservationAvailable = await ReservationCapacityAvailableAtcommunity(ctx, date, token.communityId);

    if (!reservationAvailable) {
      throw new UserInputError('No parking spaces available for selected date');
    }

    try {
      return await AddReservation(ctx, token.communityId, token.houseId, token.id, args.vehicleId, date);
    } catch (ex) {
      throw new ApolloError('Error adding reservation');
    }
  },
});

export const cancelReservation = mutationField('cancelReservation', {
  type: 'Reservation',
  args: {
    reservationId: nonNull(stringArg()),
  },
  complexity: 50,
  resolve: async (_, args, ctx) => {
    const { token } = ctx;

    if (!token || !token.communityId || !token.houseId) {
      throw new AuthenticationError('Invalid token');
    }

    try {
      return await CancelReservation(ctx, token.communityId, args.reservationId);
    } catch (ex) {
      throw new ApolloError('Error adding reservation');
    }
  },
});