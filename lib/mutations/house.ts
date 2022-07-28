import { Modify } from 'lib/FixType';
import { Prisma } from '@prisma/client';
import { gql } from '@apollo/client';

export interface AddHouseData {
  getHouses: HouseModified[];
}

export interface AddHouseVars {
  unit: String;
}

export const ADD_HOUSE_MUTATION = gql`
  mutation AddHouse($unit: String!) {
    addHouse(unit: $unit) {
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