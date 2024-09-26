/*
  Warnings:

  - Added the required column `lastName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "lastName" TEXT NOT NULL;
