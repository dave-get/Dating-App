/*
  Warnings:

  - You are about to drop the column `location` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `value` to the `Creativity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `FunAndFavorites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Creativity` ADD COLUMN `value` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Food` ADD COLUMN `value` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `FunAndFavorites` ADD COLUMN `value` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Profile` DROP COLUMN `location`,
    MODIFY `lookingFor` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `phoneNumber` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Location_profileId_key`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
