import { GetVehiclesByHouse } from 'graphql/models';
import { list, nonNull, queryField, stringArg } from 'nexus';

export const getVehicles = queryField('getVehicles', {
  type: list('HousesOnVehicles'),
  args: {
    houseId: nonNull(stringArg())
  },
  complexity: 10,
  resolve: async (_, args, ctx) => {
    return GetVehiclesByHouse(ctx, args.houseId);
  },
});
