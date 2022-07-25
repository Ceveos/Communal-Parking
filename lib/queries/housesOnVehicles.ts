import { Modify } from 'lib/FixType';
import { Prisma } from '@prisma/client';
import { gql } from '@apollo/client';

export interface GetVehiclesData {
  getVehicles: HouseOnVehicleModified[];
}

export interface GetVehiclesVars {
  houseId: String;
  showHidden?: Boolean;
}

export const GET_VEHICLES_QUERY = gql`
  query GetVehicles($houseId: String!, $showHidden: Boolean) {
    getVehicles(houseId: $houseId, showHidden: $showHidden) {
      id
      licensePlate
      name
      description
      personal
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
    hidden: true,
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