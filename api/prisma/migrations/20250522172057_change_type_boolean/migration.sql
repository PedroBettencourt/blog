/*
  Warnings:

  - You are about to drop the column `type` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "type",
ADD COLUMN     "author" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "Type";
