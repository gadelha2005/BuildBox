-- CreateTable
CREATE TABLE `ItemCarrinho` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `variacaoProdutoId` INTEGER NULL,
    `quantidade` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ItemCarrinho_usuarioId_produtoId_variacaoProdutoId_key`(`usuarioId`, `produtoId`, `variacaoProdutoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ItemCarrinho` ADD CONSTRAINT `ItemCarrinho_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemCarrinho` ADD CONSTRAINT `ItemCarrinho_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemCarrinho` ADD CONSTRAINT `ItemCarrinho_variacaoProdutoId_fkey` FOREIGN KEY (`variacaoProdutoId`) REFERENCES `VariacaoProduto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
