/*
  Warnings:

  - You are about to alter the column `height` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `Decimal(4,2)`.

*/
-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "height" SET DATA TYPE DECIMAL(4,2),
ALTER COLUMN "weight" SET DATA TYPE DECIMAL(5,2);
