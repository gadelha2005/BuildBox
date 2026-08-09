export type RoleUsuario = "CLIENTE" | "FUNCIONARIO" | "ADMIN";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: RoleUsuario;
  ativo: boolean;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface Marca {
  id: number;
  nome: string;
}

export interface FotoProduto {
  id: number;
  url: string;
  ordem: number;
}

export interface VariacaoProduto {
  id: number;
  tamanho: string | null;
  cor: string | null;
  estoque: number;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  unidadeMedida: string;
  categoriaId: number;
  marcaId: number;
  estoque: number;
  estoqueMinimo: number;
  ativo: boolean;
  categoria?: Categoria;
  marca?: Marca;
  fotos?: FotoProduto[];
  variacoes?: VariacaoProduto[];
}

export interface ProdutoListResponse {
  data: Produto[];
  total: number;
}

export interface ItemCarrinho {
  id: number;
  produtoId: number;
  variacaoProdutoId: number | null;
  quantidade: number;
  produto: Produto;
  variacaoProduto?: VariacaoProduto | null;
}

export type StatusPedido =
  | "EM_SEPARACAO"
  | "ENVIADO"
  | "ENTREGUE"
  | "CANCELADO";

export interface ItemPedido {
  id: number;
  produtoId: number;
  variacaoProdutoId: number | null;
  quantidade: number;
  precoUnitario: number;
  produto?: Produto;
  variacaoProduto?: VariacaoProduto | null;
}

export interface Pedido {
  id: number;
  usuarioId: number;
  status: StatusPedido;
  total: number;
  rua: string;
  numero: string;
  complemento?: string | null;
  cidade: string;
  estado: string;
  cep: string;
  createdAt: string;
  itens?: ItemPedido[];
  usuario?: Usuario;
}

export interface Endereco {
  id: number;
  rua: string;
  numero: string;
  complemento?: string | null;
  cidade: string;
  estado: string;
  cep: string;
}

export type TipoMovimentacao = "ENTRADA" | "SAIDA";

export interface MovimentacaoEstoque {
  id: number;
  produtoId: number;
  variacaoProdutoId: number | null;
  usuarioId: number;
  tipo: TipoMovimentacao;
  quantidade: number;
  motivo?: string | null;
  createdAt: string;
  produto?: Produto;
}

export interface ProductFilters {
  q?: string;
  categoriaId?: number;
  marcaId?: number;
  precoMin?: number;
  precoMax?: number;
  sort?: "preco_asc" | "preco_desc";
  page?: number;
  pageSize?: number;
}
