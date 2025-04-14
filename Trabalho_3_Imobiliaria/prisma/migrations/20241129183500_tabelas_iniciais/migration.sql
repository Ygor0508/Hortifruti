-- CreateTable
CREATE TABLE `imoveis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cidade` VARCHAR(60) NOT NULL,
    `endereco` VARCHAR(60) NOT NULL,
    `bairro` VARCHAR(60) NOT NULL,
    `tamanho` VARCHAR(30) NULL,
    `quarto` SMALLINT NOT NULL,
    `banheiro` SMALLINT NOT NULL,
    `garagem` SMALLINT NOT NULL DEFAULT 0,
    `preco` DECIMAL(10, 2) NOT NULL,
    `tipo` ENUM('APARTAMENTO', 'CASA', 'COMERCIAL', 'SITIO', 'SOBRADO') NOT NULL DEFAULT 'CASA',
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imoveisArquivados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cidade` VARCHAR(60) NOT NULL,
    `endereco` VARCHAR(60) NOT NULL,
    `bairro` VARCHAR(60) NOT NULL,
    `tamanho` VARCHAR(30) NULL,
    `quarto` SMALLINT NOT NULL,
    `banheiro` SMALLINT NOT NULL,
    `garagem` SMALLINT NOT NULL DEFAULT 0,
    `preco` DECIMAL(10, 2) NOT NULL,
    `tipo` ENUM('APARTAMENTO', 'CASA', 'COMERCIAL', 'SITIO', 'SOBRADO') NOT NULL DEFAULT 'CASA',
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(60) NOT NULL,
    `email` VARCHAR(40) NOT NULL,
    `senha` VARCHAR(60) NOT NULL,
    `nivel` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(60) NOT NULL,
    `complemento` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `imoveis` ADD CONSTRAINT `imoveis_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `imoveisArquivados` ADD CONSTRAINT `imoveisArquivados_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
