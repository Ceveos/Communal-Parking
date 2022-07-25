import { Modify } from 'lib/FixType';
import { Prisma } from '@prisma/client';
import { gql } from '@apollo/client';

export interface GetVehicleData {
  getVehicle: VehicleModified;
}

export interface GetVehicleVars {
  id: String;
}

export const GET_VEHICLE_QUERY = gql`
  query GetVehicle($id: String!) {
    getVehicle(id: $id) {
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

const vehicle = Prisma.validator<Prisma.VehicleArgs>()({
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

export type Vehicle = Prisma.VehicleGetPayload<typeof vehicle>

export type VehicleModified = Modify<
  Vehicle,
  { createdAt: string, updatedAt: string }
>;