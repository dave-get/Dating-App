/*
  Warnings:

  - Added the required column `value` to the `Creativity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `FunAndFavorites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `creativity` ADD COLUMN `value` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `food` ADD COLUMN `value` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `funandfavorites` ADD COLUMN `value` VARCHAR(191) NOT NULL;
