import { ProductOptions } from "../productOptions/ProductOptions";
import type { Produto, VariacaoProduto } from "../../types";
import "./BuyBox.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface BuyBoxProps {
  produto: Produto;
  variacaoSelecionada: VariacaoProduto | null;
  onSelecionarVariacao: (variacao: VariacaoProduto) => void;
  quantidade: number;
  onQuantidadeChange: (quantidade: number) => void;
  estoqueDisponivel: number;
  podeComprar: boolean;
  onAddToCart: () => void;
  mensagem: string;
}

export function BuyBox({
  produto,
  variacaoSelecionada,
  onSelecionarVariacao,
  quantidade,
  onQuantidadeChange,
  estoqueDisponivel,
  podeComprar,
  onAddToCart,
  mensagem,
}: BuyBoxProps) {
  const temVariacoes = (produto.variacoes?.length ?? 0) > 0;

  return (
    <div className="product-detail__info">
      {produto.marca && (
        <span className="product-card__brand">{produto.marca.nome}</span>
      )}
      <h1>{produto.nome}</h1>
      <span className="product-detail__price">
        {currency.format(Number(produto.preco))}
      </span>
      <p className="product-detail__description">{produto.descricao}</p>

      {temVariacoes && (
        <div className="field">
          <label>Variação</label>
          <ProductOptions
            variacoes={produto.variacoes!}
            selecionada={variacaoSelecionada}
            onSelecionar={onSelecionarVariacao}
          />
        </div>
      )}

      <p className="product-detail__stock">
        {estoqueDisponivel > 0
          ? `${estoqueDisponivel} em estoque`
          : "Produto indisponível"}
      </p>

      <div className="field product-detail__quantity">
        <label htmlFor="quantidade">Quantidade</label>
        <input
          id="quantidade"
          type="number"
          min={1}
          max={Math.max(estoqueDisponivel, 1)}
          value={quantidade}
          onChange={(e) => onQuantidadeChange(Number(e.target.value))}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={onAddToCart}
        disabled={!podeComprar || estoqueDisponivel <= 0}
      >
        Adicionar ao carrinho
      </button>

      {mensagem && <p className="product-detail__message">{mensagem}</p>}
    </div>
  );
}