import { Prisma } from '@prisma/client';
import { gql } from '@apollo/client';

export interface AddReservationData {
  addReservation: Prisma.ReservationGetPayload<{}>
}

export interface AddReservationVars {
  date: moment.Moment;
  vehicleId: string;
}

export interface CancelReservationData {
  cancelReservation: Prisma.ReservationGetPayload<{}>
}

export interface CancelReservationVars {
  reservationId: string;
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

export const CANCEL_RESERVATION_MUTATION = gql`
  mutation CancelReservation($reservationId: String!) {
    cancelReservation(reservationId: $reservationId) {
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