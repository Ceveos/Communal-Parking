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

export interface EditVehicleData {
  editVehicle: Prisma.VehicleGetPayload<{}>
}

export interface EditVehicleVars {
  id: string;
  name: string;
  description: string | null;
  hidden: boolean;
}

export const EDIT_VEHICLE_MUTATION = gql`
  mutation AddVehicle($id: String!, $name: String!, $description: String, $hidden: Boolean!) {
    editVehicle(id: $id, name: $name, description: $description, hidden: $hidden) {
      id
      name
      licensePlate
    }
  }
`;