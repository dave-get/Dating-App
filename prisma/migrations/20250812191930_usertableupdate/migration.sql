/*
  Warnings:

  - You are about to drop the column `profileId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `distancePreference` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distancePreference` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Media` DROP FOREIGN KEY `Media_profileId_fkey`;

-- DropIndex
DROP INDEX `Media_profileId_fkey` ON `Media`;

-- AlterTable
ALTER TABLE `Media` DROP COLUMN `profileId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Profile` DROP COLUMN `age`,
    DROP COLUMN `distancePreference`,
    DROP COLUMN `gender`,
    DROP COLUMN `username`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `age` INTEGER NOT NULL,
    ADD COLUMN `distancePreference` INTEGER NOT NULL,
    ADD COLUMN `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Account`;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
