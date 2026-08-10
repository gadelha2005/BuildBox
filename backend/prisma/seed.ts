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

  await prisma.produto.create({
    data: {
      nome: 'Furadeira de Impacto 500W',
      descricao: 'Furadeira de impacto com maleta, 500W de potência',
      preco: 279.9,
      unidadeMedida: 'unidade',
      categoriaId: categorias[2].id,
      marcaId: marcas[2].id,
      estoque: 15,
      estoqueMinimo: 3,
      fotos: {
        create: [
          { url: 'https://casadopicapau.vtexassets.com/arquivos/ids/171525/Furadeira-Tramontina-500W.png?v=639193038480500000', ordem: 0 },
          { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwN6JUKw2aybKgGgnuDL4cEqjVcyiSjpoRmZVDptm1Y-EclqE_wT0hxkg&s=10', ordem: 1 },
          { url: 'https://armazemjenipapo.agilecdn.com.br/16898_1.jpg', ordem: 2 },
        ],
      },
    },
  });

  await prisma.produto.create({
    data: {
      nome: 'Torneira de Pressão para Cozinha',
      descricao: 'Torneira de pressão em metal cromado, bica alta',
      preco: 89.5,
      unidadeMedida: 'unidade',
      categoriaId: categorias[1].id,
      marcaId: marcas[0].id,
      estoque: 20,
      estoqueMinimo: 5,
      fotos: {
        create: [
          { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUnMQ6Yf9lHR97wf2iwwBTkl68S443JMCgygZ-SHjIuQ&s=10', ordem: 0 },
          { url: 'https://m.media-amazon.com/images/I/51S-abO8n0L._AC_UF894,1000_QL80_.jpg', ordem: 1 },
          { url: 'https://cdn.awsli.com.br/600x450/47/47186/produto/18509024/2c4f0afe82.jpg', ordem: 2 },
        ],
      },
    },
  });

  await prisma.produto.create({
    data: {
      nome: 'Cabo Flexível 2,5mm',
      descricao: 'Cabo flexível de cobre 2,5mm, rolo com 100 metros',
      preco: 145.0,
      unidadeMedida: 'rolo',
      categoriaId: categorias[0].id,
      marcaId: marcas[1].id,
      estoque: 8,
      estoqueMinimo: 2,
      fotos: {
        create: [
          { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNqcQs4m3WCANMMQyGOGkmlAJt_NO7bA2PWV-uVaazpxRqbO1nep2hjsQ&s=10', ordem: 0 },
          { url: 'https://santil.jetassets.com.br/produto/cabo-flexivel-2-5-mm-preto-750v-rolo-100-metros-sil_D.jpg', ordem: 1 },
          { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpi1I7F52Qy_eM9Lw0oqxwakHmQ-g_SHmUliHG3rZlZw&s=10', ordem: 2 },
        ],
      },
    },
  });

  await prisma.produto.create({
    data: {
      nome: 'Tinta Acrílica Branca 18L',
      descricao: 'Tinta acrílica fosca para paredes internas e externas',
      preco: 219.9,
      unidadeMedida: 'lata',
      categoriaId: categorias[3].id,
      marcaId: marcas[3].id,
      estoque: 12,
      estoqueMinimo: 3,
      fotos: {
        create: [
          { url: 'https://telhanorte.vtexassets.com/arquivos/ids/341855/Tinta-Suvinil-Latex-acrilica-Fosco-Completo-18-litros-branco-1759.jpg?v=637008886230870000', ordem: 0 },
          { url: 'https://telhanorte.vtexassets.com/arquivos/ids/341740/Tinta-Latex-standard-Rende-Muito-acrilico-fosco-18L-branco-Suvinil-1340379.jpg?v=637006286076730000', ordem: 1 },
          { url: 'https://images.tcdn.com.br/img/img_prod/1380002/tinta_acrilica_fosco_branco_toque_completo_suvinil_18l_15631_1_11992ec05d9d7d26d0385216407d57a0.jpg', ordem: 2 },
        ],
      },
    },
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