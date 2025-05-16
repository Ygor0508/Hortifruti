/*
  Warnings:

  - You are about to drop the column `localizacao` on the `feirantes` table. All the data in the column will be lost.
  - You are about to drop the column `data_pedido` on the `pedidos` table. All the data in the column will be lost.
  - The `status` column on the `pedidos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tipo_entrega` column on the `pedidos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `pedido_mercadoria` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mercadoria_id` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('EM_ANDAMENTO', 'FINALIZADO', 'CANCELADO', 'PENDENTE', 'ENTREGUE', 'EM_PREPARACAO', 'EM_ROTA', 'RETORNANDO');

-- CreateEnum
CREATE TYPE "Tipo_entrega" AS ENUM ('RETIRADA_NO_LOCAL', 'ENTREGA', 'ENTREGA_PROGRAMADA');

-- DropForeignKey
ALTER TABLE "pedido_mercadoria" DROP CONSTRAINT "pedido_mercadoria_mercadoria_id_fkey";

-- DropForeignKey
ALTER TABLE "pedido_mercadoria" DROP CONSTRAINT "pedido_mercadoria_pedido_id_fkey";

-- AlterTable
ALTER TABLE "feirantes" DROP COLUMN "localizacao";

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "data_pedido",
ADD COLUMN     "mercadoria_id" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'EM_PREPARACAO',
DROP COLUMN "tipo_entrega",
ADD COLUMN     "tipo_entrega" "Tipo_entrega" NOT NULL DEFAULT 'ENTREGA';

-- DropTable
DROP TABLE "pedido_mercadoria";

-- CreateTable
CREATE TABLE "localizacao" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "feirante_id" INTEGER NOT NULL,

    CONSTRAINT "localizacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "localizacao" ADD CONSTRAINT "localizacao_feirante_id_fkey" FOREIGN KEY ("feirante_id") REFERENCES "feirantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_mercadoria_id_fkey" FOREIGN KEY ("mercadoria_id") REFERENCES "mercadorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
