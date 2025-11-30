/*
  Warnings:

  - You are about to alter the column `email` on the `medics` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(80)`.

*/
-- CreateEnum
CREATE TYPE "gender_enum" AS ENUM ('MALE', 'FEMALE', 'OTHERS', 'NOT_INFORM');

-- CreateEnum
CREATE TYPE "appointment_status_enum" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "medics" ALTER COLUMN "email" SET DATA TYPE VARCHAR(80);

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(80),
    "name" VARCHAR(100),
    "cellphone" VARCHAR(11),
    "birth_date" DATE,
    "sex" "gender_enum",
    "height" SMALLINT,
    "weight" SMALLINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "medic_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "status" "appointment_status_enum" NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" SERIAL NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "medic_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- CreateIndex
CREATE INDEX "appointments_medic_id_idx" ON "appointments"("medic_id");

-- CreateIndex
CREATE INDEX "appointments_patient_id_idx" ON "appointments"("patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_medic_id_start_at_key" ON "appointments"("medic_id", "start_at");

-- CreateIndex
CREATE INDEX "notes_appointment_id_idx" ON "notes"("appointment_id");

-- CreateIndex
CREATE INDEX "notes_medic_id_idx" ON "notes"("medic_id");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_medic_id_fkey" FOREIGN KEY ("medic_id") REFERENCES "medics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_medic_id_fkey" FOREIGN KEY ("medic_id") REFERENCES "medics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
