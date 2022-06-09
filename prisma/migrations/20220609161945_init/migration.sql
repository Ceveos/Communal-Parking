-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateTable
CREATE TABLE "CustomDomain" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "parkingSpaces" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "House" (
    "id" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "House_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "licensePlate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HousesOnVehicles" (
    "houseId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HousesOnVehicles_pkey" PRIMARY KEY ("houseId","vehicleId")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "houseId" TEXT,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "reservedFrom" TIMESTAMP(3) NOT NULL,
    "reservedTo" TIMESTAMP(3) NOT NULL,
    "communityId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "email" TEXT,
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPassword" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "forceChange" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hash" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "expiration" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInvite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomDomain_domain_key" ON "CustomDomain"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Community_subdomain_key" ON "Community"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "House_unit_key" ON "House"("unit");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "Vehicle"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_tenantId_key" ON "User"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_hash_key" ON "RefreshToken"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "UserInvite_token_key" ON "UserInvite"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserInvite_userId_key" ON "UserInvite"("userId");

-- AddForeignKey
ALTER TABLE "CustomDomain" ADD CONSTRAINT "CustomDomain_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HousesOnVehicles" ADD CONSTRAINT "HousesOnVehicles_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HousesOnVehicles" ADD CONSTRAINT "HousesOnVehicles_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPassword" ADD CONSTRAINT "UserPassword_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvite" ADD CONSTRAINT "UserInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
