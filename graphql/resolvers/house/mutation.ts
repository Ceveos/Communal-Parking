import { AddHouse, ConnectUserToHouse, CreateUserToHouse, GetUserByEmail } from 'graphql/models';
import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-micro';
import { mutationField, nonNull, stringArg } from 'nexus';

export const addTenant = mutationField('addTenant', {
  type: 'User',
  args: {
    communityId: nonNull(stringArg()),
    unit: nonNull(stringArg()),
    name: nonNull(stringArg()),
    email: nonNull(stringArg()),
  },
  complexity: 50,
  resolve: async (_, args, ctx) => {
    const user = await GetUserByEmail(ctx, args.email);

    if (user && user.houseId) {
      throw new UserInputError('User already belongs to a community');
    }

    // User exists, connect them to their new house
    if (user) {
      return ConnectUserToHouse(ctx, user.id, args.communityId, args.unit);
    } else {
      return CreateUserToHouse(ctx, args.email, args.name, args.communityId, args.unit);
    }
  },
});

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
