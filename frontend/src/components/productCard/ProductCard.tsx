import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { MouseEvent } from "react";
import type { Produto } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import "./ProductCard.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductCard({ produto }: { produto: Produto }) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const foto = produto.fotos?.[0]?.url;
  const semEstoque = produto.estoque <= 0;

  async function handleAddToCart(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate("/entrar", { state: { from: `/produtos/${produto.id}` } });
      return;
    }

    setMensagem("");
    setLoading(true);
    try {
      await addItem(produto.id, 1);
      setMensagem("Adicionado ao carrinho!");
    } catch (err: any) {
      if (err?.response?.status === 400) {
        // provavelmente exige selecionar uma variação
        navigate(`/produtos/${produto.id}`);
        return;
      }
      setMensagem(
        err?.response?.data?.message ?? "Não foi possível adicionar.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="product-card card">
      <Link to={`/produtos/${produto.id}`} className="product-card__link">
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

      <div className="product-card__footer">
        <button
          type="button"
          className="btn btn-primary product-card__add"
          onClick={handleAddToCart}
          disabled={semEstoque || loading}
        >
          {loading ? "Adicionando..." : "Adicionar ao carrinho"}
        </button>
        {mensagem && <span className="product-card__message">{mensagem}</span>}
      </div>
    </div>
  );
}
