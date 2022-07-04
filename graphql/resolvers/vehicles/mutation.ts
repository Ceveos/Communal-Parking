import { AddVehicle, AddVehicleParam } from 'graphql/models';
import { AuthenticationError, UserInputError } from 'apollo-server-micro';
import { booleanArg, mutationField, nonNull, stringArg } from 'nexus';

// Create a game and link to existing database
// or creat a game and database in one go
export const addVehicle = mutationField('addVehicle', {
  type: 'Vehicle',
  args: {
    name: nonNull(stringArg()),
    description: stringArg(),
    licensePlate: nonNull(stringArg()),
    personal: nonNull(booleanArg()),
  },
  complexity: 50,
  resolve: async (_, args, ctx) => {
    const { token } = ctx;
    const addVehicleParam: AddVehicleParam = {
      ...args,
      licensePlate: args.licensePlate.toUpperCase(),
      description: args.description ?? null
    };

    if (!token || !token.houseId || !token.id) {
      throw new AuthenticationError('Valid token required');
    }

    try {
      return await AddVehicle(ctx, addVehicleParam, token.houseId, token.id);
    } catch (ex) {
      throw new UserInputError('Vehicle already exists');
    }
  },
});
