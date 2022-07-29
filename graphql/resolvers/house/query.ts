import { GetTenantsByHouseId, GetTenantsByUnit } from 'graphql/models';
import { UserInputError } from 'apollo-server-micro';
import { list, nonNull, queryField, stringArg} from 'nexus';

export const getHouses = queryField('getHouses', {
  type: list('House'),
  args: {
    communityId: nonNull(stringArg()),
  },
  complexity: 1,
  resolve: async (_, args, ctx) => {
    return await ctx.prisma.house.findMany({
      where: { communityId: args.communityId },
      orderBy: {
        unit: 'asc'
      }
    });
  },
});

export const getHouse = queryField('getHouse', {
  type: 'House',
  args: {
    communityId: nonNull(stringArg()),
    houseUnit: nonNull(stringArg()),
  },
  complexity: 10,
  resolve: async (_, args, ctx) => {
    return await ctx.prisma.house.findUnique({
      where: {
        communityId_unit: {
          communityId: args.communityId,
          unit: args.houseUnit
        },
      },
      include: {
        Community: true,
        Users: true,
        Vehicles: {
          include: {
            House: true,
            User: true
          }
        },
        Reservations: {
          include: {
            Vehicle: true,
            House: true,
            User: true
          }
        },
      }
    });
  },
});

export const getTenants = queryField('getTenants', {
  type: list('User'),
  args: {
    houseId: stringArg(),
    communityId: stringArg(),
    houseUnit: stringArg()
  },
  complexity: 1,
  resolve: async (_, args, ctx) => {
    const communityId = args.communityId ?? ctx.token?.communityId;

    if (!communityId) {
      throw new UserInputError('communityId must be defined');
    }

    if (args.houseId) {
      return GetTenantsByHouseId(ctx, communityId, args.houseId);
    } else if (args.houseUnit) {
      return GetTenantsByUnit(ctx, communityId, args.houseUnit);
    }

    throw new UserInputError('houseId or houseUnit must be defined');
  },
});
