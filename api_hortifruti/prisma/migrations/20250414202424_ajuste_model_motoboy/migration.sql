/*
  Warnings:

  - Added the required column `modelo_Veiculo` to the `motoboys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placa_Veiculo` to the `motoboys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "motoboys" ADD COLUMN     "modelo_Veiculo" VARCHAR(60) NOT NULL,
ADD COLUMN     "placa_Veiculo" VARCHAR(60) NOT NULL;
