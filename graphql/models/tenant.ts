import * as NexusPrisma from 'nexus-prisma';
import * as Prisma from '@prisma/client';
import { Context } from 'graphql/context';
import { objectType } from 'nexus';

export const Tenants = objectType({
  name: NexusPrisma.Tenant.$name,
  description: NexusPrisma.Tenant.$description,
  definition(t) {
    t.nonNull.field(NexusPrisma.Tenant.id);
    t.field(NexusPrisma.Tenant.House);
    t.field(NexusPrisma.Tenant.User);
    t.nonNull.field(NexusPrisma.Tenant.firstName);
    t.nonNull.field(NexusPrisma.Tenant.lastName);
  },
});

// export type TenantParam = Pick<Prisma.Tenant, 'firstName' | 'lastName' | 'houseId'>

// export async function GetTenantByEmail(ctx: Context, email: string): Promise<Prisma.Tenant | null> {
//   return await ctx.prisma.user.findUnique({
//     where: {
//       email
//     },
//     include: {
//       Tenant: true
//     }
//   })?.Tenant ?? null;
// }