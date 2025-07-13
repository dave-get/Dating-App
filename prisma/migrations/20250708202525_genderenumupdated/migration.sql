/*
  Warnings:

  - The values [OTHER] on the enum `Profile_gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `profile` MODIFY `gender` ENUM('MALE', 'FEMALE') NOT NULL;
