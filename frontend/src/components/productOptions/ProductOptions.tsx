import type { VariacaoProduto } from "../../types";
import "./ProductOptions.css";

interface ProductOptionsProps {
  variacoes: VariacaoProduto[];
  selecionada: VariacaoProduto | null;
  onSelecionar: (variacao: VariacaoProduto) => void;
}

export function ProductOptions({
  variacoes,
  selecionada,
  onSelecionar,
}: ProductOptionsProps) {
  return (
    <div className="product-options">
      {variacoes.map((variacao) => (
        <button
          key={variacao.id}
          type="button"
          className={`product-options__item ${
            selecionada?.id === variacao.id ? "is-active" : ""
          }`}
          disabled={variacao.estoque <= 0}
          onClick={() => onSelecionar(variacao)}
        >
          {[variacao.tamanho, variacao.cor].filter(Boolean).join(" / ") ||
            "Padrão"}
          {variacao.estoque <= 0 ? " (indisponível)" : ""}
        </button>
      ))}
    </div>
  );
}