import * as NexusPrisma from 'nexus-prisma';
import { Context } from 'graphql/context';
import { UserInputError } from 'apollo-server-micro';
import { objectType } from 'nexus';

export const Communities = objectType({
  name: NexusPrisma.Community.$name,
  description: NexusPrisma.Community.$description,
  definition(t) {
    t.nonNull.field(NexusPrisma.Community.id);
    t.field(NexusPrisma.Community.Houses);
    t.field(NexusPrisma.Community.Reservations);
    t.nonNull.field(NexusPrisma.Community.parkingSpaces);
    t.field(NexusPrisma.Community.subdomain);
  },
});

export async function GetTimezoneFromCommunity(ctx: Context, communityId: string): Promise<string> {
  const community = await ctx.prisma.community.findUnique({
    where: {
      id: communityId
    }
  });

  if (community?.timezone) {
    return community.timezone;
  } else {
    throw new UserInputError('Community ID does not exist');
  }
}