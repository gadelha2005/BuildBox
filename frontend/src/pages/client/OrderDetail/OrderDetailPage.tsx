import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as ordersApi from "../../../api/orders";
import type { Pedido } from "../../../types";
import { StatusBadge } from "../../../components/StatusBadge";
import "./OrderDetailPage.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function OrderDetailPage() {
  const { id } = useParams();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    ordersApi
      .findMineById(Number(id))
      .then(setPedido)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Carregando pedido...</p>;
  if (!pedido) return <p>Pedido não encontrado.</p>;

  return (
    <div className="order-detail">
      <div className="order-detail__header">
        <h1>Pedido #{pedido.id}</h1>
        <StatusBadge status={pedido.status} />
      </div>

      <div className="card order-detail__section">
        <h2>Endereço de entrega</h2>
        <p>
          {pedido.rua}, {pedido.numero}
          {pedido.complemento ? ` - ${pedido.complemento}` : ""}
          <br />
          {pedido.cidade} / {pedido.estado} — {pedido.cep}
        </p>
      </div>

      <div className="card order-detail__section">
        <h2>Itens</h2>
        {pedido.itens?.map((item) => (
          <div key={item.id} className="order-detail__item">
            <span>
              {item.quantidade}x{" "}
              {item.produto?.nome ?? `Produto #${item.produtoId}`}
              {item.variacaoProduto &&
                ` (${[item.variacaoProduto.tamanho, item.variacaoProduto.cor].filter(Boolean).join(" / ")})`}
            </span>
            <span>
              {currency.format(Number(item.precoUnitario) * item.quantidade)}
            </span>
          </div>
        ))}
        <div className="order-detail__total">
          <span>Total</span>
          <strong>{currency.format(Number(pedido.total))}</strong>
        </div>
      </div>
    </div>
  );
}
