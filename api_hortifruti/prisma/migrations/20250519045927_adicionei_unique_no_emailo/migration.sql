/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `consumidores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "consumidores_email_key" ON "consumidores"("email");
