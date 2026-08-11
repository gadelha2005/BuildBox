import { useEffect, useState } from "react";
import * as ordersApi from "../../../api/orders";
import { StatusBadge } from "../../../components/StatusBadge";
import type { Pedido, StatusPedido } from "../../../types";
import "./ordersPage.css";
import { useAuth } from "../../../contexts/AuthContext";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const PROXIMO_STATUS: Partial<Record<StatusPedido, StatusPedido>> = {
  EM_SEPARACAO: "ENVIADO",
  ENVIADO: "ENTREGUE",
};

const PROXIMO_STATUS_LABEL: Record<StatusPedido, string> = {
  EM_SEPARACAO: "",
  ENVIADO: "Marcar como enviado",
  ENTREGUE: "Marcar como entregue",
  CANCELADO: "",
};

const FILTROS: { value: StatusPedido | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "EM_SEPARACAO", label: "Em separação" },
  { value: "ENVIADO", label: "Enviado" },
  { value: "ENTREGUE", label: "Entregue" },
  { value: "CANCELADO", label: "Cancelado" },
];

export function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<StatusPedido | "">("");
  const [loading, setLoading] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const { user } = useAuth();

  function carregar() {
    setLoading(true);
    ordersApi
      .findAll(filtro || undefined)
      .then(setPedidos)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    carregar();
  }, [filtro]);

  async function handleAvancarStatus(pedido: Pedido) {
    const proximo = PROXIMO_STATUS[pedido.status];
    if (!proximo) return;

    setError("");
    setAtualizandoId(pedido.id);
    try {
      await ordersApi.updateStatus(pedido.id, proximo);
      carregar();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Não foi possível atualizar o status.",
      );
    } finally {
      setAtualizandoId(null);
    }
  }
  async function handleCancelar(pedido: Pedido) {
    if (!confirm(`Cancelar o pedido #${pedido.id}?`)) return;

    setError("");
    setAtualizandoId(pedido.id);
    try {
      await ordersApi.cancel(pedido.id);
      carregar();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Não foi possível cancelar o pedido.",
      );
    } finally {
      setAtualizandoId(null);
    }
  }

  return (
    <div className="orders-page">
      <h1>Pedidos</h1>

      <div className="field orders-page__filter">
        <label htmlFor="filtro">Status</label>
        <select
          id="filtro"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as StatusPedido | "")}
        >
          {FILTROS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : (
        <div className="orders-table card">
          <div className="orders-table__header">
            <span>Pedido</span>
            <span>Cliente</span>
            <span>Data</span>
            <span>Total</span>
            <span>Status</span>
            <span></span>
          </div>

          {pedidos.map((pedido) => {
            const proximo = PROXIMO_STATUS[pedido.status];
            return (
              <div key={pedido.id} className="orders-table__row">
                <span>#{pedido.id}</span>
                <span>{pedido.usuario?.nome ?? "-"}</span>
                <span>
                  {new Date(pedido.createdAt).toLocaleDateString("pt-BR")}
                </span>
                <span>{currency.format(Number(pedido.total))}</span>
                <span>
                  <StatusBadge status={pedido.status} />
                </span>
                <span className="orders-table__actions">
                  {proximo && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={atualizandoId === pedido.id}
                      onClick={() => handleAvancarStatus(pedido)}
                    >
                      {atualizandoId === pedido.id
                        ? "Atualizando..."
                        : PROXIMO_STATUS_LABEL[proximo]}
                    </button>
                  )}
                  {user?.role === "ADMIN" && pedido.status === "EM_SEPARACAO" && (
                    <button
                      type="button"
                      className="address-card__action address-card__action--danger"
                      disabled={atualizandoId === pedido.id}
                      onClick={() => handleCancelar(pedido)}
                    >
                      Cancelar
                    </button>
                  )}
                </span>
              </div>
            );
          })}

          {pedidos.length === 0 && <p>Nenhum pedido encontrado.</p>}
        </div>
      )}
    </div>
  );
}