import { Modify } from 'lib/FixType';
import { Prisma } from '@prisma/client';
import { gql } from '@apollo/client';

export interface GetCurrentReservationsData {
  getCurrentReservations: Reservation[];
}

export interface GetCurrentReservationsVars {
  communityId: String;
}

export const GET_CURRENT_RESERVATIONS_QUERY = gql`
  query GetCurrentReservations($communityId: String!) {
    getCurrentReservations(communityId: $communityId) {
      id
      reservedFrom
      reservedTo
      Vehicle {
        licensePlate
        name
      }
      House {
        unit
      }
      User {
        firstName
        lastName
      }
    }
  }
`;

const reservation = Prisma.validator<Prisma.ReservationArgs>()({
  select: {
    id: true,
    reservedFrom: true,
    reservedTo: true,
    Vehicle: {
      select: {
        licensePlate: true,
        name: true
      },
    },
    House: {
      select: {
        unit: true
      }
    },
    User: {
      select: {
        firstName: true,
        lastName: true
      }
    },
  }
});

export type Reservation = Modify<
    Prisma.ReservationGetPayload<typeof reservation>,
    { reservedTo: string, reservedFrom: string }
  >;