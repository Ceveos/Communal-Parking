import { AddReservation, IsVehicleOwnedByUser, IsVehicleReservedAtDate, ReservationCapacityAvailableAtcommunity } from 'graphql/models';
import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-micro';
import { mutationField, nonNull, stringArg } from 'nexus';

// Create a game and link to existing database
// or creat a game and database in one go
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

    const reservationAvailable = await ReservationCapacityAvailableAtcommunity(ctx, token.communityId);

    if (!reservationAvailable) {
      throw new UserInputError('No parking spaces available for selected date');
    }

    try {
      const res = await AddReservation(ctx, token.communityId, token.houseId, token.id, args.vehicleId, date);

      await ctx.res.revalidate(`/_sites/${token.communityId}/vehicle/${args.vehicleId}`);
      return res;
    } catch (ex) {
      throw new ApolloError('Error adding reservation');
    }
  },
});
