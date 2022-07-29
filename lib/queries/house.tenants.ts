import { Modify } from 'lib/FixType';
import { Prisma } from '@prisma/client';
import { gql } from '@apollo/client';

export interface GetTenantsData {
  getTenants: HouseTenantsModified[];
}

interface GetTenantByHouseId {
  communityId: string;
  houseId: String;
}

interface GetTenantByHouseUnit {
  communityId: string;
  houseUnit: String;
}

export type GetTenantsVars = GetTenantByHouseUnit | GetTenantByHouseId;

export const GET_TENANTS_QUERY = gql`
  query GetTenants($communityId: String!, $houseUnit: String, $houseId: String) {
    getTenants(communityId: $communityId, houseUnit: $houseUnit, houseId: $houseId) {
      id
      name
      email
    }
  }
`;

const user = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    name: true,
    email: true,
    role: true
  }
});

export type HouseTenants = Prisma.UserGetPayload<typeof user>

export type HouseTenantsModified = Modify<
  HouseTenants,
  { createdAt: string, updatedAt: string }
>;