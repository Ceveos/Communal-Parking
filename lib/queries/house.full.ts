
import { HouseOnVehicleModified } from './housesOnVehicles';
import { Modify } from 'lib/FixType';
import { Prisma } from '@prisma/client';
import { Reservation } from 'lib/queries/reservation';
import { gql } from '@apollo/client';

export interface GetFullHouseData {
  getHouse: FullHouseModified;
}

export interface GetFullHouseVars {
  communityId: string;
  houseUnit: string
}

export const GET_FULL_HOUSE_QUERY = gql`
  query GetHouses($communityId: String!, $houseUnit: String!) {
    getHouse(communityId: $communityId, houseUnit: $houseUnit) {
      id
      unit
      createdAt
      updatedAt
      Users {
        id
        name
        email
      }
      Vehicles {
        id
        name
        description
        licensePlate
        personal
        hidden
        createdAt
        updatedAt
        House {
          id
          unit
        }
      }
      Reservations {
        id
        reservedFrom
        reservedTo
        Vehicle {
          id
          licensePlate
          name
          description
        }
        House {
          unit
        }
        User {
          name
        }
      }
    }
  }
`;

const fullHouse = Prisma.validator<Prisma.HouseArgs>()({
  select: {
    id: true,
    unit: true,
    createdAt: true,
    updatedAt: true,
    Users: {
      select: {
        id: true,
        name: true,
        email: true
      }
    },
    Vehicles: {
      select: {
        id: true,
        name: true,
        description: true,
        licensePlate: true,
        personal: true,
        hidden: true,
        createdAt: true,
        updatedAt: true,
        House: {
          select: {
            id: true,
            unit: true
          }
        },
      }
    },
    Reservations: {
      select: {
        id: true,
        reservedFrom: true,
        reservedTo: true,
        Vehicle: {
          select: {
            id: true,
            licensePlate: true,
            name: true,
            description: true,
          }
        },
        House: {
          select: {
            unit: true
          }
        },
        User: {
          select: {
            name: true
          }
        }
      }
    }
  }
});

export type FullHouse = Prisma.HouseGetPayload<typeof fullHouse>

export type FullHouseModified = Modify<
  FullHouse,
  { createdAt: string, updatedAt: string, Vehicles: HouseOnVehicleModified[], Reservations: Reservation[] }
>;