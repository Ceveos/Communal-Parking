import { Prisma } from '@prisma/client';
import { gql } from '@apollo/client';

export interface AddReservationData {
  addReservation: Prisma.ReservationGetPayload<{}>
}

export interface AddReservationVars {
  date: moment.Moment;
  vehicleId: string;
}

export const ADD_RESERVATION_MUTATION = gql`
  mutation AddReservation($date: String!, $vehicleId: String!) {
    addReservation(date: $date, vehicleId: $vehicleId) {
      id
      reservedFrom
      reservedTo
      Vehicle {
        id
        licensePlate
      }
      House {
        id
        unit
      }
      User {
        id
        name
      }
    }
  }
`;