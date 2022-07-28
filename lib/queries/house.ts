import { Modify } from 'lib/FixType';
import { Prisma } from '@prisma/client';
import { gql } from '@apollo/client';

export interface GetHousesData {
  getHouses: HouseModified[];
}

export interface GetHousesVars {
  communityId: String;
}

export const GET_HOUSES_QUERY = gql`
  query GetHouses($communityId: String!) {
    getHouses(communityId: $communityId) {
      id
      unit
      createdAt
      updatedAt
      Users {
        id
        name
      }
    }
  }
`;

const house = Prisma.validator<Prisma.HouseArgs>()({
  select: {
    id: true,
    unit: true,
    createdAt: true,
    updatedAt: true,
    Users: {
      select: {
        id: true,
        name: true,
      }
    }
  }
});

export type House = Prisma.HouseGetPayload<typeof house>

export type HouseModified = Modify<
  House,
  { createdAt: string, updatedAt: string }
>;