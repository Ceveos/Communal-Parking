import { GetVehicleById, GetVehiclesByHouse } from 'graphql/models';
import { booleanArg, list, nonNull, queryField, stringArg } from 'nexus';

export const getVehicles = queryField('getVehicles', {
  type: list('Vehicle'),
  args: {
    houseId: nonNull(stringArg()),
    showHidden: booleanArg()
  },
  complexity: 10,
  resolve: async (_, args, ctx) => {
    return GetVehiclesByHouse(ctx, args.houseId, args.showHidden === null ? undefined : args.showHidden);
  },
});

export const getVehicle = queryField('getVehicle', {
  type: 'Vehicle',
  args: {
    id: nonNull(stringArg())
  },
  complexity: 1,
  resolve: async (_, args, ctx) => {
    return GetVehicleById(ctx, args.id);
  },
});
