/*
  Warnings:

  - You are about to alter the column `phoneNumber` on the `phoneverification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `phoneNumber` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `phoneverification` MODIFY `phoneNumber` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `phoneNumber` INTEGER NULL;
