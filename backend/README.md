# BuildBox — Backend

API REST de um sistema de e-commerce para uma loja de ferragens (categorias: elétrica,
hidráulica, ferramentas e tintas).

## Stack

- Node.js + TypeScript + Express 5
- Prisma (ORM) + MySQL (via Docker Compose)
- JWT (autenticação) + bcrypt (hash de senha)
- Zod (validação de dados)
- Swagger UI (documentação interativa dos endpoints)

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para rodar o MySQL)
- Git

## Como rodar localmente

1. Clone o repositório e entre na pasta do backend:

```bash
git clone <URL_DO_REPOSITORIO>
cd BuildBox/backend
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o `.env` a partir do exemplo:

```bash
cp .env.example .env
```

4. Suba o banco de dados MySQL:

```bash
docker compose up -d
```

5. Gere o Prisma Client e aplique as migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

6. (Opcional, mas recomendado) Popule o banco com dados de teste:

```bash
npx prisma db seed
```

Isso cria 3 usuários de teste (senha `123456` para todos):

| E-mail | Role |
|---|---|
| admin@buildbox.com | ADMIN |
| funcionario@buildbox.com | FUNCIONARIO |
| cliente@buildbox.com | CLIENTE |

Além de 4 categorias, 4 marcas e 4 produtos de exemplo.

7. Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor sobe em `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `PORT` | Porta do servidor | `3000` |
| `DATABASE_URL` | String de conexão do MySQL | `mysql://root:root@localhost:3306/buildbox` |
| `JWT_SECRET` | Chave usada para assinar os tokens JWT | (string aleatória longa) |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `1d` |

## Documentação dos endpoints

Com o servidor rodando, acesse:

```
http://localhost:3000/docs
```

Interface interativa (Swagger UI) com todos os endpoints, organizados por recurso:

- **Auth** — cadastro e login
- **Categories** / **Brands** — CRUD (público para leitura, ADMIN para escrita)
- **Products** — CRUD, filtro/busca/ordenação/paginação, fotos e variações
- **Cart** — carrinho de compras do usuário logado
- **Addresses** — endereços de entrega do usuário logado
- **Orders** — checkout, histórico do cliente, gestão de pedidos (funcionário/admin)
- **Stock** — controle de estoque e histórico de movimentações (funcionário/admin)
- **Reports** — relatórios de vendas, estoque crítico e faturamento (admin)
- **Users** — gestão de usuários e roles (admin)

A especificação OpenAPI usada pelo Swagger fica em `src/docs/openapi.yaml`.

### Autenticação

A maioria das rotas exige um token JWT no header:

```
Authorization: Bearer <token>
```

O token é obtido no `POST /auth/login`. Algumas rotas também exigem uma role específica
(`FUNCIONARIO` ou `ADMIN`) — isso está indicado na descrição de cada endpoint na documentação.

## Estrutura do projeto

```
backend/
  src/
    controllers/    # recebem a requisição, validam entrada (Zod), chamam o service
    services/        # regra de negócio, acesso ao banco via Prisma
    routes/          # definição das rotas Express
    middlewares/      # autenticação (JWT) e autorização (role)
    errors/           # classe AppError
    lib/              # instância do Prisma Client
    types/            # interfaces TypeScript por entidade
    docs/             # especificação OpenAPI
    app.ts             # montagem do Express (middlewares, rotas, error handler)
    server.ts           # ponto de entrada (app.listen)
  prisma/
    schema.prisma        # modelos do banco
    migrations/            # histórico de migrations
    seed.ts                 # script de dados de teste
  docker-compose.yml
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor em modo desenvolvimento (hot reload) |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start` | Roda a versão compilada (`dist/server.js`) |
| `npx prisma studio` | Interface visual para ver/editar os dados do banco |
| `npx prisma db seed` | Popula o banco com dados de teste |
