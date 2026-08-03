-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `cidade` VARCHAR(191) NULL,
    ADD COLUMN `numero` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `MovimentacaoEstoque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produtoId` INTEGER NOT NULL,
    `variacaoProdutoId` INTEGER NULL,
    `usuarioId` INTEGER NOT NULL,
    `tipo` ENUM('ENTRADA', 'SAIDA') NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `motivo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MovimentacaoEstoque` ADD CONSTRAINT `MovimentacaoEstoque_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimentacaoEstoque` ADD CONSTRAINT `MovimentacaoEstoque_variacaoProdutoId_fkey` FOREIGN KEY (`variacaoProdutoId`) REFERENCES `VariacaoProduto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimentacaoEstoque` ADD CONSTRAINT `MovimentacaoEstoque_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
