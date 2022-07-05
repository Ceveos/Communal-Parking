import { Modify } from 'lib/FixType';
import { Prisma } from '@prisma/client';
import { gql } from '@apollo/client';

export interface GetCurrentReservationsData {
  getCurrentReservations: Reservation[];
}

export interface GetCurrentCommunityReservationsVars {
  communityId: String;
}
export interface GetCurrentHouseReservationsVars {
  houseId: String;
}

export const GET_CURRENT_COMMUNITY_RESERVATIONS_QUERY = gql`
  query GetCurrentReservations($communityId: String!) {
    getCurrentReservations(data: {communityId: $communityId}) {
      id
      reservedFrom
      reservedTo
      Vehicle {
        id
        licensePlate
        name
      }
      House {
        unit
      }
      User {
        name
      }
    }
  }
`;

export const GET_CURRENT_HOUSE_RESERVATIONS_QUERY = gql`
  query GetCurrentReservations($houseId: String!) {
    getCurrentReservations(data: {houseId: $houseId}) {
      id
      reservedFrom
      reservedTo
      Vehicle {
        id
        licensePlate
        name
      }
      House {
        unit
      }
      User {
        name
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
        id: true,
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
        name: true,
      }
    },
  }
});

export type Reservation = Modify<
    Prisma.ReservationGetPayload<typeof reservation>,
    { reservedTo: string, reservedFrom: string }
  >;