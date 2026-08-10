import type { StatusPedido } from "../types";

const LABELS: Record<StatusPedido, string> = {
  EM_SEPARACAO: "Em separação",
  ENVIADO: "Enviado",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export function StatusBadge({ status }: { status: StatusPedido }) {
  return (
    <span className={`status-badge status-${status}`}>{LABELS[status]}</span>
  );
}
