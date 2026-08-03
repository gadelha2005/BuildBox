-- CreateTable
CREATE TABLE `Pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `status` ENUM('EM_SEPARACAO', 'ENVIADO', 'ENTREGUE', 'CANCELADO') NOT NULL DEFAULT 'EM_SEPARACAO',
    `total` DECIMAL(10, 2) NOT NULL,
    `rua` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `complemento` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemPedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `variacaoProdutoId` INTEGER NULL,
    `quantidade` INTEGER NOT NULL,
    `precoUnitario` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ItemPedido` ADD CONSTRAINT `ItemPedido_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemPedido` ADD CONSTRAINT `ItemPedido_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemPedido` ADD CONSTRAINT `ItemPedido_variacaoProdutoId_fkey` FOREIGN KEY (`variacaoProdutoId`) REFERENCES `VariacaoProduto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
