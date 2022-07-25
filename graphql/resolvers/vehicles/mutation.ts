import { AddVehicle, AddVehicleParam, EditVehicle, EditVehicleParam } from 'graphql/models';
import { AuthenticationError, UserInputError } from 'apollo-server-micro';
import { booleanArg, mutationField, nonNull, stringArg } from 'nexus';

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

export const editVehicle = mutationField('editVehicle', {
  type: 'Vehicle',
  args: {
    id: nonNull(stringArg()),
    name: nonNull(stringArg()),
    description: stringArg(),
    hidden: nonNull(booleanArg()),
  },
  complexity: 50,
  resolve: async (_, args, ctx) => {
    const { token } = ctx;
    let vehicle = await ctx.prisma.vehicle.findUnique({
      where: {
        id: args.id
      }
    });

    if (!token || !token.houseId || !token.id) {
      throw new AuthenticationError('Valid token required');
    }

    if (vehicle?.houseId !== token.houseId) {
      throw new AuthenticationError('User does not have permission to edit vehicle');
    }
    const editVehicleParam: EditVehicleParam = {
      ...args,
      description: args.description ?? null
    };

    try {
      return await EditVehicle(ctx, args.id, editVehicleParam);
    } catch (ex) {
      throw new UserInputError('Vehicle already exists');
    }
  },
});
