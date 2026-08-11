import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import * as stockApi from "../../../api/stock";
import type { EstoqueItem, MovimentacaoEstoque } from "../../../types";
import "./StockPage.css";
import { useAuth } from "../../../contexts/AuthContext";


export function StockPage() {
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [produtoAbertoId, setProdutoAbertoId] = useState<number | null>(null);
  const [tipo, setTipo] = useState<"ENTRADA" | "SAIDA">("ENTRADA");
  const [quantidade, setQuantidade] = useState(1);
  const [motivo, setMotivo] = useState("");
  const [variantId, setVariantId] = useState<number | "">("");
  const [salvando, setSalvando] = useState(false);
  const { user } = useAuth();
  const [mostrarMovimentacoes, setMostrarMovimentacoes] = useState(false);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [carregandoMovimentacoes, setCarregandoMovimentacoes] = useState(false);

  function carregar() {
    setLoading(true);
    stockApi
      .list()
      .then(setItens)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirMovimentacao(item: EstoqueItem) {
    setProdutoAbertoId(item.id);
    setTipo("ENTRADA");
    setQuantidade(1);
    setMotivo("");
    setVariantId(item.variantes.length === 1 ? item.variantes[0].id : "");
    setError("");
  }

  function fecharMovimentacao() {
    setProdutoAbertoId(null);
  }

  function toggleMovimentacoes() {
    if (mostrarMovimentacoes) {
      setMostrarMovimentacoes(false);
      return;
    }

    setMostrarMovimentacoes(true);
    setCarregandoMovimentacoes(true);
    stockApi
      .listMovements()
      .then(setMovimentacoes)
      .finally(() => setCarregandoMovimentacoes(false));
  }

  async function handleSubmit(event: FormEvent, item: EstoqueItem) {
    event.preventDefault();

    if (item.variantes.length > 0 && !variantId) {
      setError("Selecione a variação.");
      return;
    }

    setError("");
    setSalvando(true);
    try {
      const vId = variantId === "" ? undefined : Number(variantId);
      if (tipo === "ENTRADA") {
        await stockApi.registerEntry(
          item.id,
          quantidade,
          motivo || undefined,
          vId,
        );
      } else {
        await stockApi.registerExit(
          item.id,
          quantidade,
          motivo || undefined,
          vId,
        );
      }

      fecharMovimentacao();
      carregar();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Não foi possível registrar a movimentação.",
      );
    } finally {
      setSalvando(false);
    }
  }

  if (loading) return <p>Carregando estoque...</p>;

  return (
    <div className="stock-page">
        <div className="stock-page__header">
          <h1>Estoque</h1>
            {user?.role === "ADMIN" && (
            <button className="btn btn-secondary" onClick={toggleMovimentacoes}>
              {mostrarMovimentacoes ? "Ocultar histórico" : "Ver histórico de movimentações"}
            </button>
          )}
        </div>

        {mostrarMovimentacoes && (
          <div className="card stock-movements">
            {carregandoMovimentacoes ? (
              <p>Carregando histórico...</p>
            ) : (
              <>
                <div className="stock-movements__header">
                  <span>Produto</span>
                  <span>Tipo</span>
                  <span>Quantidade</span>
                  <span>Motivo</span>
                  <span>Data</span>
                </div>
                {movimentacoes.map((mov) => (
                  <div key={mov.id} className="stock-movements__row">
                    <span>{mov.produto?.nome ?? "-"}</span>
                    <span>{mov.tipo === "ENTRADA" ? "Entrada" : "Saída"}</span>
                    <span>{mov.quantidade}</span>
                    <span>{mov.motivo ?? "-"}</span>
                    <span>{new Date(mov.createdAt).toLocaleDateString("pt-BR")}</span>
                  </div>
                ))}
                {movimentacoes.length === 0 && <p>Nenhuma movimentação registrada.</p>}
              </>
            )}
        </div>
      )}

      <div className="stock-table card">
        <div className="stock-table__header">
          <span>Produto</span>
          <span>Estoque</span>
          <span>Mínimo</span>
          <span>Status</span>
          <span></span>
        </div>

        {itens.map((item) => (
          <div key={item.id} className="stock-table__row-wrapper">
            <div className="stock-table__row">
              <span>{item.nome}</span>
              <span>{item.estoque}</span>
              <span>{item.estoqueMinimo}</span>
              <span>
                {item.estoqueBaixo ? (
                  <span className="stock-badge stock-badge--low">
                    Estoque baixo
                  </span>
                ) : (
                  <span className="stock-badge stock-badge--ok">OK</span>
                )}
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  produtoAbertoId === item.id
                    ? fecharMovimentacao()
                    : abrirMovimentacao(item)
                }
              >
                {produtoAbertoId === item.id ? "Cancelar" : "Movimentar"}
              </button>
            </div>

            {item.variantes.length > 0 && (
              <div className="stock-table__variants">
                {item.variantes.map((v) => (
                  <span key={v.id} className="stock-variant-chip">
                    {[v.tamanho, v.cor].filter(Boolean).join(" / ") || "Padrão"}
                    : {v.estoque}
                  </span>
                ))}
              </div>
            )}

            {produtoAbertoId === item.id && (
              <form
                className="stock-form"
                onSubmit={(event) => handleSubmit(event, item)}
              >
                <div className="field">
                  <label>Tipo</label>
                  <select
                    value={tipo}
                    onChange={(e) =>
                      setTipo(e.target.value as "ENTRADA" | "SAIDA")
                    }
                  >
                    <option value="ENTRADA">Entrada</option>
                    <option value="SAIDA">Saída</option>
                  </select>
                </div>

                {item.variantes.length > 0 && (
                  <div className="field">
                    <label>Variação</label>
                    <select
                      value={variantId}
                      onChange={(e) =>
                        setVariantId(
                          e.target.value ? Number(e.target.value) : "",
                        )
                      }
                    >
                      <option value="">Selecione</option>
                      {item.variantes.map((v) => (
                        <option key={v.id} value={v.id}>
                          {[v.tamanho, v.cor].filter(Boolean).join(" / ") ||
                            "Padrão"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="field">
                  <label>Quantidade</label>
                  <input
                    type="number"
                    min={1}
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label>Motivo (opcional)</label>
                  <input
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                  />
                </div>

                {error && <p className="error-text">{error}</p>}

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={salvando}
                >
                  {salvando ? "Salvando..." : "Confirmar movimentação"}
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
