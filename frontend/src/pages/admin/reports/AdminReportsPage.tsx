import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import * as reportsApi from "../../../api/reports";
import type {Faturamento, ProdutoMaisVendido} from "../../../api/reports";
import type { EstoqueItem } from "../../../types";
import "./AdminReportsPage.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function AdminReportsPage() {
  const [maisVendidos, setMaisVendidos] = useState<ProdutoMaisVendido[]>([]);
  const [estoqueCritico, setEstoqueCritico] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [faturamento, setFaturamento] = useState<Faturamento | null>(null);
  const [carregandoFaturamento, setCarregandoFaturamento] = useState(true);

  useEffect(() => {
    Promise.all([reportsApi.mostSold(), reportsApi.criticalStock()])
      .then(([vendidos, critico]) => {
        setMaisVendidos(vendidos);
        setEstoqueCritico(critico);
      })
      .finally(() => setLoading(false));

    carregarFaturamento();
  }, []);

  function carregarFaturamento(inicio?: string, fim?: string) {
    setCarregandoFaturamento(true);
    reportsApi
      .revenue(inicio || undefined, fim || undefined)
      .then(setFaturamento)
      .finally(() => setCarregandoFaturamento(false));
  }

  function handleFiltrarFaturamento(event: FormEvent) {
    event.preventDefault();
    carregarFaturamento(dataInicio, dataFim);
  }

  return (
    <div className="admin-reports">
      <h1>Relatórios</h1>

      <div className="card admin-reports__block">
        <h2>Faturamento</h2>
        <form className="admin-reports__filter" onSubmit={handleFiltrarFaturamento}>
          <div className="field">
            <label>De</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Até</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Filtrar
          </button>
        </form>

        {carregandoFaturamento ? (
          <p>Carregando...</p>
        ) : (
          <div className="admin-reports__revenue">
            <div>
              <span className="admin-reports__revenue-label">Total faturado</span>
              <strong>{currency.format(faturamento?.total ?? 0)}</strong>
            </div>
            <div>
              <span className="admin-reports__revenue-label">Pedidos entregues</span>
              <strong>{faturamento?.totalPedidos ?? 0}</strong>
            </div>
          </div>
        )}
        <p className="admin-reports__hint">
          Considera apenas pedidos com status "Entregue".
        </p>
      </div>

      {loading ? (
        <p>Carregando relatórios...</p>
      ) : (
        <div className="admin-reports__grid">
          <div className="card admin-reports__block">
            <h2>Mais vendidos</h2>
            <div className="admin-reports__list">
              {maisVendidos.map((item) => (
                <div key={item.produtoId} className="admin-reports__row">
                  <span>{item.nome}</span>
                  <span>{item.quantidadeVendida} un.</span>
                </div>
              ))}
              {maisVendidos.length === 0 && <p>Nenhuma venda registrada.</p>}
            </div>
          </div>

          <div className="card admin-reports__block">
            <h2>Estoque crítico</h2>
            <div className="admin-reports__list">
              {estoqueCritico.map((item) => (
                <div key={item.id} className="admin-reports__row">
                  <span>{item.nome}</span>
                  <span className="stock-badge stock-badge--low">
                    {item.estoque} / mín. {item.estoqueMinimo}
                  </span>
                </div>
              ))}
              {estoqueCritico.length === 0 && (
                <p>Nenhum produto com estoque baixo.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}