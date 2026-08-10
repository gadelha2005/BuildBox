import { Link } from "react-router-dom";
import type { Produto } from "../types";
import "./ProductCard.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductCard({ produto }: { produto: Produto }) {
  const foto = produto.fotos?.[0]?.url;
  const semEstoque = produto.estoque <= 0;

  return (
    <Link to={`/produtos/${produto.id}`} className="product-card card">
      <div className="product-card__image">
        {foto ? (
          <img src={foto} alt={produto.nome} />
        ) : (
          <div className="product-card__placeholder">Sem foto</div>
        )}
        {semEstoque && (
          <span className="product-card__badge">Indisponível</span>
        )}
      </div>
      <div className="product-card__body">
        {produto.marca && (
          <span className="product-card__brand">{produto.marca.nome}</span>
        )}
        <h3 className="product-card__name">{produto.nome}</h3>
        <span className="product-card__price">
          {currency.format(Number(produto.preco))}
        </span>
      </div>
    </Link>
  );
}
