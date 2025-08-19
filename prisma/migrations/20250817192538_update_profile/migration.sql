/*
  Warnings:

  - You are about to alter the column `lookingFor` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - Made the column `phoneNumber` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Profile` MODIFY `lookingFor` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `phoneNumber` VARCHAR(191) NOT NULL;
