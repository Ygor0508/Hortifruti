/*
  Warnings:

  - Added the required column `feirante_id` to the `fotos_mercadoria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fotos_mercadoria" ADD COLUMN     "feirante_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "fotos_mercadoria" ADD CONSTRAINT "fotos_mercadoria_feirante_id_fkey" FOREIGN KEY ("feirante_id") REFERENCES "feirantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
