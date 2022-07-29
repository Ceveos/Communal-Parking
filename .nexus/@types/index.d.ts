/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../../graphql/context"
import type { QueryComplexity } from "nexus/dist/plugins/queryComplexityPlugin"
import type { core, connectionPluginCore } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
    /**
     * Adds a Relay-style connection to the type, with numerous options for configuration
     *
     * @see https://nexusjs.org/docs/plugins/connection
     */
    connectionField<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName>
    ): void
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  ReservationInputType: { // input type
    communityId?: string | null; // String
    houseId?: string | null; // String
  }
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  AuthPayload: { // root type
    token: string; // String!
    user?: NexusGenRootTypes['User'] | null; // User
  }
  Community: { // root type
    id: string; // ID!
    parkingSpaces: number; // Int!
    subdomain: string; // String!
  }
  House: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    unit: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Mutation: {};
  Query: {};
  Reservation: { // root type
    id: string; // ID!
    reservedFrom: NexusGenScalars['DateTime']; // DateTime!
    reservedTo: NexusGenScalars['DateTime']; // DateTime!
  }
  User: { // root type
    email?: string | null; // String
    id: string; // ID!
    name?: string | null; // String
  }
  Vehicle: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description?: string | null; // String
    hidden: boolean; // Boolean!
    houseId?: string | null; // String
    id: string; // ID!
    licensePlate: string; // String!
    name: string; // String!
    personal: boolean; // Boolean!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId?: string | null; // String
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  AuthPayload: { // field return type
    token: string; // String!
    user: NexusGenRootTypes['User'] | null; // User
  }
  Community: { // field return type
    Houses: NexusGenRootTypes['House'][]; // [House!]!
    Reservations: NexusGenRootTypes['Reservation'][]; // [Reservation!]!
    id: string; // ID!
    parkingSpaces: number; // Int!
    subdomain: string; // String!
  }
  House: { // field return type
    Community: NexusGenRootTypes['Community']; // Community!
    Reservations: NexusGenRootTypes['Reservation'][]; // [Reservation!]!
    Users: NexusGenRootTypes['User'][]; // [User!]!
    Vehicles: NexusGenRootTypes['Vehicle'][]; // [Vehicle!]!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    unit: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Mutation: { // field return type
    addHouse: NexusGenRootTypes['House'] | null; // House
    addReservation: NexusGenRootTypes['Reservation'] | null; // Reservation
    addTenant: NexusGenRootTypes['User'] | null; // User
    addVehicle: NexusGenRootTypes['Vehicle'] | null; // Vehicle
    editVehicle: NexusGenRootTypes['Vehicle'] | null; // Vehicle
  }
  Query: { // field return type
    getCurrentReservations: Array<NexusGenRootTypes['Reservation'] | null> | null; // [Reservation]
    getHouse: NexusGenRootTypes['House'] | null; // House
    getHouses: Array<NexusGenRootTypes['House'] | null> | null; // [House]
    getTenants: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    getVehicle: NexusGenRootTypes['Vehicle'] | null; // Vehicle
    getVehicles: Array<NexusGenRootTypes['Vehicle'] | null> | null; // [Vehicle]
    user: NexusGenRootTypes['User'] | null; // User
  }
  Reservation: { // field return type
    Community: NexusGenRootTypes['Community']; // Community!
    House: NexusGenRootTypes['House']; // House!
    User: NexusGenRootTypes['User'] | null; // User
    Vehicle: NexusGenRootTypes['Vehicle']; // Vehicle!
    id: string; // ID!
    reservedFrom: NexusGenScalars['DateTime']; // DateTime!
    reservedTo: NexusGenScalars['DateTime']; // DateTime!
  }
  User: { // field return type
    House: NexusGenRootTypes['House'] | null; // House
    Reservations: NexusGenRootTypes['Reservation'][]; // [Reservation!]!
    email: string | null; // String
    id: string; // ID!
    name: string | null; // String
  }
  Vehicle: { // field return type
    House: NexusGenRootTypes['House'] | null; // House
    Reservations: NexusGenRootTypes['Reservation'][]; // [Reservation!]!
    User: NexusGenRootTypes['User'] | null; // User
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string | null; // String
    hidden: boolean; // Boolean!
    houseId: string | null; // String
    id: string; // ID!
    licensePlate: string; // String!
    name: string; // String!
    personal: boolean; // Boolean!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: string | null; // String
  }
}

export interface NexusGenFieldTypeNames {
  AuthPayload: { // field return type name
    token: 'String'
    user: 'User'
  }
  Community: { // field return type name
    Houses: 'House'
    Reservations: 'Reservation'
    id: 'ID'
    parkingSpaces: 'Int'
    subdomain: 'String'
  }
  House: { // field return type name
    Community: 'Community'
    Reservations: 'Reservation'
    Users: 'User'
    Vehicles: 'Vehicle'
    createdAt: 'DateTime'
    id: 'ID'
    unit: 'String'
    updatedAt: 'DateTime'
  }
  Mutation: { // field return type name
    addHouse: 'House'
    addReservation: 'Reservation'
    addTenant: 'User'
    addVehicle: 'Vehicle'
    editVehicle: 'Vehicle'
  }
  Query: { // field return type name
    getCurrentReservations: 'Reservation'
    getHouse: 'House'
    getHouses: 'House'
    getTenants: 'User'
    getVehicle: 'Vehicle'
    getVehicles: 'Vehicle'
    user: 'User'
  }
  Reservation: { // field return type name
    Community: 'Community'
    House: 'House'
    User: 'User'
    Vehicle: 'Vehicle'
    id: 'ID'
    reservedFrom: 'DateTime'
    reservedTo: 'DateTime'
  }
  User: { // field return type name
    House: 'House'
    Reservations: 'Reservation'
    email: 'String'
    id: 'ID'
    name: 'String'
  }
  Vehicle: { // field return type name
    House: 'House'
    Reservations: 'Reservation'
    User: 'User'
    createdAt: 'DateTime'
    description: 'String'
    hidden: 'Boolean'
    houseId: 'String'
    id: 'ID'
    licensePlate: 'String'
    name: 'String'
    personal: 'Boolean'
    updatedAt: 'DateTime'
    userId: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    addHouse: { // args
      unit: string; // String!
    }
    addReservation: { // args
      date: string; // String!
      vehicleId: string; // String!
    }
    addTenant: { // args
      communityId: string; // String!
      email: string; // String!
      name: string; // String!
      unit: string; // String!
    }
    addVehicle: { // args
      description?: string | null; // String
      licensePlate: string; // String!
      name: string; // String!
      personal: boolean; // Boolean!
    }
    editVehicle: { // args
      description?: string | null; // String
      hidden: boolean; // Boolean!
      id: string; // String!
      name: string; // String!
    }
  }
  Query: {
    getCurrentReservations: { // args
      data: NexusGenInputs['ReservationInputType']; // ReservationInputType!
    }
    getHouse: { // args
      communityId: string; // String!
      houseUnit: string; // String!
    }
    getHouses: { // args
      communityId: string; // String!
    }
    getTenants: { // args
      communityId?: string | null; // String
      houseId?: string | null; // String
      houseUnit?: string | null; // String
    }
    getVehicle: { // args
      id: string; // String!
    }
    getVehicles: { // args
      houseId: string; // String!
      showHidden?: boolean | null; // Boolean
    }
    user: { // args
      userId: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * The complexity for an individual field. Return a number
     * or a function that returns a number to specify the
     * complexity for this field.
     */
    complexity?: QueryComplexity<TypeName, FieldName>
    
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}