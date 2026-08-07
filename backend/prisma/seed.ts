import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Limpando dados existentes...');

  await prisma.movimentacaoEstoque.deleteMany();
  await prisma.itemPedido.deleteMany();
  await prisma.itemCarrinho.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.endereco.deleteMany();
  await prisma.fotoProduto.deleteMany();
  await prisma.variacaoProduto.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.marca.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('Criando usuários...');

  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.usuario.createMany({
    data: [
      { nome: 'Admin', email: 'admin@buildbox.com', senha: passwordHash, role: 'ADMIN' },
      { nome: 'Funcionário', email: 'funcionario@buildbox.com', senha: passwordHash, role: 'FUNCIONARIO' },
      { nome: 'Cliente', email: 'cliente@buildbox.com', senha: passwordHash, role: 'CLIENTE' },
    ],
  });

  console.log('Criando categorias...');

  const categorias = await Promise.all(
    ['Elétrica', 'Hidráulica', 'Ferramentas', 'Tintas'].map((nome) =>
      prisma.categoria.create({ data: { nome } })
    )
  );

  console.log('Criando marcas...');

  const marcas = await Promise.all(
    ['Tramontina', 'Vonder', 'Bosch', 'Suvinil'].map((nome) =>
      prisma.marca.create({ data: { nome } })
    )
  );

  console.log('Criando produtos...');

  await prisma.produto.createMany({
    data: [
      {
        nome: 'Furadeira de Impacto 500W',
        descricao: 'Furadeira de impacto com maleta, 500W de potência',
        preco: 279.9,
        unidadeMedida: 'unidade',
        categoriaId: categorias[2].id,
        marcaId: marcas[2].id,
        estoque: 15,
        estoqueMinimo: 3,
      },
      {
        nome: 'Torneira de Pressão para Cozinha',
        descricao: 'Torneira de pressão em metal cromado, bica alta',
        preco: 89.5,
        unidadeMedida: 'unidade',
        categoriaId: categorias[1].id,
        marcaId: marcas[0].id,
        estoque: 20,
        estoqueMinimo: 5,
      },
      {
        nome: 'Cabo Flexível 2,5mm',
        descricao: 'Cabo flexível de cobre 2,5mm, rolo com 100 metros',
        preco: 145.0,
        unidadeMedida: 'rolo',
        categoriaId: categorias[0].id,
        marcaId: marcas[1].id,
        estoque: 8,
        estoqueMinimo: 2,
      },
      {
        nome: 'Tinta Acrílica Branca 18L',
        descricao: 'Tinta acrílica fosca para paredes internas e externas',
        preco: 219.9,
        unidadeMedida: 'lata',
        categoriaId: categorias[3].id,
        marcaId: marcas[3].id,
        estoque: 12,
        estoqueMinimo: 3,
      },
    ],
  });

  console.log('Seed concluído com sucesso.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });