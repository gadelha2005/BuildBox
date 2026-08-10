import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import "./CartPage.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CartPage() {
  const { items, total, loading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <p>Carregando carrinho...</p>;

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Seu carrinho está vazio.</p>
        <Link to="/produtos" className="btn btn-primary">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__items">
        {items.map((item) => (
          <div key={item.id} className="cart-item card">
            <img
              src={item.produto.fotos?.[0]?.url}
              alt={item.produto.nome}
              className="cart-item__image"
            />
            <div className="cart-item__info">
              <Link to={`/produtos/${item.produtoId}`}>
                {item.produto.nome}
              </Link>
              {item.variacaoProduto && (
                <span className="cart-item__variant">
                  {[item.variacaoProduto.tamanho, item.variacaoProduto.cor]
                    .filter(Boolean)
                    .join(" / ")}
                </span>
              )}
              <span>{currency.format(Number(item.produto.preco))}</span>
            </div>
            <input
              type="number"
              min={1}
              max={item.variacaoProduto?.estoque ?? item.produto.estoque}
              value={item.quantidade}
              onChange={(e) => updateItem(item.id, Number(e.target.value))}
              className="cart-item__quantity"
            />
            <span className="cart-item__subtotal">
              {currency.format(Number(item.produto.preco) * item.quantidade)}
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => removeItem(item.id)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="cart-page__summary card">
        <h2>Resumo</h2>
        <div className="cart-page__total">
          <span>Total</span>
          <strong>{currency.format(total)}</strong>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/checkout")}
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
}
