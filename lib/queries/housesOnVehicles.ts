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
      id
      licensePlate
      name
      description
      createdAt
      updatedAt
      House {
        id
        unit
      }
    }
  }
`;

const houseOnVehicle = Prisma.validator<Prisma.VehicleArgs>()({
  select: {
    id: true,
    licensePlate: true,
    name: true,
    description: true,
    personal: true,
    createdAt: true,
    updatedAt: true,
    House: {
      select: {
        id: true,
        unit: true
      }
    },
  }
});

export type HouseOnVehicle = Prisma.VehicleGetPayload<typeof houseOnVehicle>

export type HouseOnVehicleModified = Modify<
  HouseOnVehicle,
  { createdAt: string, updatedAt: string }
>;