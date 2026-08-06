/*
  Warnings:

  - You are about to drop the column `cep` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `complemento` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `rua` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Usuario` DROP COLUMN `cep`,
    DROP COLUMN `cidade`,
    DROP COLUMN `complemento`,
    DROP COLUMN `estado`,
    DROP COLUMN `numero`,
    DROP COLUMN `rua`;

-- CreateTable
CREATE TABLE `Endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
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

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
