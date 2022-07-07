import { GetCurrentReservationsForCommunity, GetCurrentReservationsForHouse } from 'graphql/models';
import { UserInputError } from 'apollo-server-micro';
import { arg, inputObjectType, list, nonNull, queryField} from 'nexus';

export const ReservationInputType = inputObjectType({
  name: 'ReservationInputType',
  definition(t) {
    t.string('communityId');
    t.string('houseId');
  }
});

export const getCurrentReservations = queryField('getCurrentReservations', {
  type: list('Reservation'),
  args: {
    data: nonNull(arg({type: ReservationInputType}))
  },
  complexity: 10,
  resolve: (_, {data}, ctx) => {
    if (data.communityId && data.houseId) {
      throw new UserInputError('Cannot define both a house and community filter. Please choose one');
    }

    if (!data.communityId && !data.houseId) {
      throw new UserInputError('House or Community Id must be provided');
    }

    if (data.communityId) {
      return GetCurrentReservationsForCommunity(ctx, data.communityId);
    }

    if (data.houseId) {
      return GetCurrentReservationsForHouse(ctx, data.houseId);
    }

    throw new UserInputError('Unknown input error occured');
  },
});