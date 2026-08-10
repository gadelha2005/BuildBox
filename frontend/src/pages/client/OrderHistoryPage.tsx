import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as ordersApi from "../../api/orders";
import type { Pedido } from "../../types";
import { StatusBadge } from "../../components/StatusBadge";
import "./OrderHistoryPage.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function OrderHistoryPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .findMine()
      .then(setPedidos)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;

  if (pedidos.length === 0) {
    return <p>Você ainda não fez nenhum pedido.</p>;
  }

  return (
    <div className="order-history">
      <h1>Meus pedidos</h1>
      {pedidos.map((pedido) => (
        <Link
          key={pedido.id}
          to={`/pedidos/${pedido.id}`}
          className="order-history__item card"
        >
          <div>
            <strong>Pedido #{pedido.id}</strong>
            <span className="order-history__date">
              {dateFormat.format(new Date(pedido.createdAt))}
            </span>
          </div>
          <StatusBadge status={pedido.status} />
          <strong>{currency.format(Number(pedido.total))}</strong>
        </Link>
      ))}
    </div>
  );
}
