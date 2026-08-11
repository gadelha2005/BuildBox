# BuildBox — Frontend

Aplicação React do e-commerce de ferragens BuildBox — catálogo, carrinho, checkout,
histórico de pedidos, painel de funcionário e painel administrativo.

## Stack

React 19 + TypeScript + Vite, React Router, Axios.

## Como rodar localmente

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
Ajuste o .env com a URL do backend (local ou produção):

VITE_API_URL=http://localhost:3000
A aplicação sobe em http://localhost:5173. É necessário ter o backend rodando — veja
backend/README.md.