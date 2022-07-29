/*
  Warnings:

  - A unique constraint covering the columns `[communityId,unit]` on the table `House` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "House_unit_key";

-- CreateIndex
CREATE UNIQUE INDEX "House_communityId_unit_key" ON "House"("communityId", "unit");
