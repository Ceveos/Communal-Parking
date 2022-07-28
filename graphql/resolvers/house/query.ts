import { list, nonNull, queryField, stringArg} from 'nexus';

export const getHouses = queryField('getHouses', {
  type: list('House'),
  args: {
    communityId: nonNull(stringArg()),
  },
  complexity: 1,
  resolve: (_, args, ctx) => {
    return ctx.prisma.house.findMany({
      where: { communityId: args.communityId },
      orderBy: {
        unit: 'asc'
      }
    });
  },
});
