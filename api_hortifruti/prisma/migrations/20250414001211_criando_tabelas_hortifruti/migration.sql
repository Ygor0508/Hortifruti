-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('FRUTAS', 'LEGUMES', 'VERDURAS', 'TEMPEROS');

-- CreateTable
CREATE TABLE "feirantes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "email" VARCHAR(45) NOT NULL,
    "senha" VARCHAR(45) NOT NULL,
    "telefone" VARCHAR(45) NOT NULL,
    "localizacao" VARCHAR(45) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feirantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mercadorias" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "quantidade" DECIMAL(10,2) NOT NULL,
    "categoria" "Categoria" NOT NULL DEFAULT 'FRUTAS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "foto" TEXT NOT NULL,
    "feirante_id" INTEGER NOT NULL,
    "destaque" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "mercadorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotos_mercadoria" (
    "id" SERIAL NOT NULL,
    "descricao" VARCHAR(45) NOT NULL,
    "url" TEXT NOT NULL,
    "mercadoria_id" INTEGER NOT NULL,

    CONSTRAINT "fotos_mercadoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" SERIAL NOT NULL,
    "data_pedido" VARCHAR(45) NOT NULL,
    "status" VARCHAR(45) NOT NULL,
    "tipo_entrega" VARCHAR(45) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "consumidor_id" INTEGER NOT NULL,
    "motoboy_id" INTEGER,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_mercadoria" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "mercadoria_id" INTEGER NOT NULL,
    "quantidade" VARCHAR(45) NOT NULL,

    CONSTRAINT "pedido_mercadoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumidores" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "email" VARCHAR(45) NOT NULL,
    "senha" VARCHAR(45) NOT NULL,
    "telefone" VARCHAR(45) NOT NULL,
    "endereco" VARCHAR(45) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consumidores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motoboys" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "email" VARCHAR(45) NOT NULL,
    "senha" VARCHAR(45) NOT NULL,
    "telefone" VARCHAR(45) NOT NULL,
    "veiculo" VARCHAR(45) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motoboys_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mercadorias" ADD CONSTRAINT "mercadorias_feirante_id_fkey" FOREIGN KEY ("feirante_id") REFERENCES "feirantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotos_mercadoria" ADD CONSTRAINT "fotos_mercadoria_mercadoria_id_fkey" FOREIGN KEY ("mercadoria_id") REFERENCES "mercadorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_consumidor_id_fkey" FOREIGN KEY ("consumidor_id") REFERENCES "consumidores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_motoboy_id_fkey" FOREIGN KEY ("motoboy_id") REFERENCES "motoboys"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_mercadoria" ADD CONSTRAINT "pedido_mercadoria_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_mercadoria" ADD CONSTRAINT "pedido_mercadoria_mercadoria_id_fkey" FOREIGN KEY ("mercadoria_id") REFERENCES "mercadorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
