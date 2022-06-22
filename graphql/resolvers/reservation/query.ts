import { GetCurrentReservationsForCommunity } from 'graphql/models';
import { list, nonNull, queryField, stringArg} from 'nexus';

export const getCurrentReservations = queryField('getCurrentReservations', {
  type: list('Reservation'),
  args: {
    communityId: nonNull(stringArg())
  },
  complexity: 10,
  resolve: (_, args, ctx) => {
    return GetCurrentReservationsForCommunity(ctx, args.communityId);
  },
});
