import { AddHouse } from 'graphql/models';
import { ApolloError, AuthenticationError } from 'apollo-server-micro';
import { mutationField, nonNull, stringArg } from 'nexus';

export const addHouse = mutationField('addHouse', {
  type: 'House',
  args: {
    unit: nonNull(stringArg()),
  },
  complexity: 50,
  resolve: async (_, args, ctx) => {
    const { token } = ctx;

    if (!token || !token.communityId || !token.houseId) {
      throw new AuthenticationError('Invalid token');
    }

    try {
      return await AddHouse(ctx, args.unit, token.communityId);
    } catch (ex) {
      throw new ApolloError('Error adding unit');
    }
  },
});
