import { Prisma } from '@prisma/client';
import { gql } from '@apollo/client';

export interface AddVehicleData {
  addVehicle: Prisma.VehicleGetPayload<{}>
}

export interface AddVehicleVars {
  name: string;
  description: string;
  licensePlate: string;
  personalVehicle: boolean;
}

export const ADD_VEHICLE_MUTATION = gql`
  mutation AddVehicle($name: String!, $description: String, $licensePlate: String!, $personalVehicle: Boolean!) {
    addVehicle(name: $name, description: $description, licensePlate: $licensePlate, personal: $personalVehicle) {
      id
      name
      licensePlate
    }
  }
`;