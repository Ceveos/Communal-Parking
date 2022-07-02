import { Modify } from 'lib/FixType';
import { Prisma } from '@prisma/client';
import { gql } from '@apollo/client';

export interface GetVehiclesData {
  getVehicles: HouseOnVehicleModified[];
}

export interface GetVehiclesVars {
  houseId: String;
}

export const GET_VEHICLES_QUERY = gql`
  query GetVehicles($houseId: String!) {
    getVehicles(houseId: $houseId) {
      createdAt
      updatedAt
      Vehicle {
        id
        licensePlate
        name
        description
      }
      House {
        id
        unit
      }
    }
  }
`;

const houseOnVehicle = Prisma.validator<Prisma.HousesOnVehiclesArgs>()({
  select: {
    createdAt: true,
    updatedAt: true,
    Vehicle: {
      select: {
        id: true,
        licensePlate: true,
        name: true,
        description: true,
      },
    },
    House: {
      select: {
        id: true,
        unit: true
      }
    },
  }
});

export type HouseOnVehicle = Prisma.HousesOnVehiclesGetPayload<typeof houseOnVehicle>

export type HouseOnVehicleModified = Modify<
  HouseOnVehicle,
  { createdAt: string, updatedAt: string }
>;