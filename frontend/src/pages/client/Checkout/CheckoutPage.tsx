import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as ordersApi from "../../../api/orders";
import { useCart } from "../../../contexts/CartContext";
import "./CheckoutPage.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CheckoutPage() {
  const { items, total, refresh } = useCart();
  const navigate = useNavigate();

  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return <p>Seu carrinho está vazio.</p>;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const pedido = await ordersApi.checkout({
        rua,
        numero,
        complemento,
        cidade,
        estado,
        cep,
      });
      await refresh();
      navigate(`/pedidos/${pedido.id}`, { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Não foi possível confirmar o pedido.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-page">
      <form className="card checkout-form" onSubmit={handleSubmit}>
        <h1>Endereço de entrega</h1>
        <div className="field">
          <label htmlFor="rua">Rua</label>
          <input
            id="rua"
            required
            value={rua}
            onChange={(e) => setRua(e.target.value)}
          />
        </div>
        <div className="checkout-form__row">
          <div className="field">
            <label htmlFor="numero">Número</label>
            <input
              id="numero"
              required
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="complemento">Complemento</label>
            <input
              id="complemento"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
          </div>
        </div>
        <div className="checkout-form__row">
          <div className="field">
            <label htmlFor="cidade">Cidade</label>
            <input
              id="cidade"
              required
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="estado">Estado</label>
            <input
              id="estado"
              required
              maxLength={2}
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="cep">CEP</label>
            <input
              id="cep"
              required
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Confirmando..." : "Confirmar pedido"}
        </button>
      </form>

      <div className="card checkout-summary">
        <h2>Resumo do pedido</h2>
        {items.map((item) => (
          <div key={item.id} className="checkout-summary__item">
            <span>
              {item.quantidade}x {item.produto.nome}
            </span>
            <span>
              {currency.format(Number(item.produto.preco) * item.quantidade)}
            </span>
          </div>
        ))}
        <div className="checkout-summary__total">
          <span>Total</span>
          <strong>{currency.format(total)}</strong>
        </div>
      </div>
    </div>
  );
}
