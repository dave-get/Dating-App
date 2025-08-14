/*
  Warnings:

  - You are about to drop the column `type` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ProfileInterest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `distancePreference` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProfileInterest` DROP FOREIGN KEY `ProfileInterest_profileId_fkey`;

-- AlterTable
ALTER TABLE `Media` DROP COLUMN `type`;

-- AlterTable
ALTER TABLE `Profile` DROP COLUMN `bio`,
    DROP COLUMN `profilePicture`,
    ADD COLUMN `distancePreference` INTEGER NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `firstname`,
    DROP COLUMN `lastname`;

-- DropTable
DROP TABLE `ProfileInterest`;

-- CreateTable
CREATE TABLE `WhatIsYourPassion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER NOT NULL,

    UNIQUE INDEX `WhatIsYourPassion_profileId_key`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Creativity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `passionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FunAndFavorites` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `passionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Food` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `passionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LifeStyle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER NOT NULL,
    `smoking` VARCHAR(191) NULL,
    `drinking` VARCHAR(191) NULL,
    `workout` VARCHAR(191) NULL,
    `pets` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LifeStyle_profileId_key`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhatMakesYouUnique` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER NOT NULL,
    `education` VARCHAR(191) NULL,
    `howDoYouShowLove` VARCHAR(191) NULL,
    `comunicationWay` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `WhatMakesYouUnique_profileId_key`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WhatIsYourPassion` ADD CONSTRAINT `WhatIsYourPassion_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creativity` ADD CONSTRAINT `Creativity_passionId_fkey` FOREIGN KEY (`passionId`) REFERENCES `WhatIsYourPassion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FunAndFavorites` ADD CONSTRAINT `FunAndFavorites_passionId_fkey` FOREIGN KEY (`passionId`) REFERENCES `WhatIsYourPassion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Food` ADD CONSTRAINT `Food_passionId_fkey` FOREIGN KEY (`passionId`) REFERENCES `WhatIsYourPassion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LifeStyle` ADD CONSTRAINT `LifeStyle_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WhatMakesYouUnique` ADD CONSTRAINT `WhatMakesYouUnique_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
