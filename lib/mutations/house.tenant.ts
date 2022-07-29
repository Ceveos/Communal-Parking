import { Prisma } from '@prisma/client';
import { gql } from '@apollo/client';

export interface AddTenantData {
  getTenant: Tenant;
}

export interface AddTenantVars {
  communityId: string;
  unit: string;
  name: string;
  email: string;
}

export const ADD_TENANT_MUTATION = gql`
  mutation AddHouse($communityId: String!, $unit: String!, $name: String!, $email: String!) {
    addTenant(communityId: $communityId, unit: $unit, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const tenant = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    name: true,
    email: true,
  }
});

export type Tenant = Prisma.UserGetPayload<typeof tenant>;