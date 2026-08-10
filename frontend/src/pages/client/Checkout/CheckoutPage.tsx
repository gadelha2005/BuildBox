import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as ordersApi from "../../../api/orders";
import * as addressesApi from "../../../api/addresses";
import { useCart } from "../../../contexts/CartContext";
import type { Endereco } from "../../../types";
import "./CheckoutPage.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const CAMPOS_VAZIOS = {
  rua: "",
  numero: "",
  complemento: "",
  cidade: "",
  estado: "",
  cep: "",
};

export function CheckoutPage() {
  const { items, total, refresh } = useCart();
  const navigate = useNavigate();

  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState<number | null>(null);
  const [carregandoEnderecos, setCarregandoEnderecos] = useState(true);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [campos, setCampos] = useState(CAMPOS_VAZIOS);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    addressesApi
      .findMine()
      .then((lista) => {
        setEnderecos(lista);
        if (lista.length > 0) {
          setEnderecoSelecionadoId(lista[0].id);
        } else {
          setMostrarForm(true);
        }
      })
      .finally(() => setCarregandoEnderecos(false));
  }, []);

  if (items.length === 0) {
    return <p>Seu carrinho está vazio.</p>;
  }

  function abrirNovoEndereco() {
    setEditandoId(null);
    setCampos(CAMPOS_VAZIOS);
    setMostrarForm(true);
  }

  function abrirEdicaoEndereco(endereco: Endereco) {
    setEditandoId(endereco.id);
    setCampos({
      rua: endereco.rua,
      numero: endereco.numero,
      complemento: endereco.complemento ?? "",
      cidade: endereco.cidade,
      estado: endereco.estado,
      cep: endereco.cep,
    });
    setMostrarForm(true);
  }

  function cancelarForm() {
    setMostrarForm(false);
    setEditandoId(null);
    setCampos(CAMPOS_VAZIOS);
  }

  async function handleSalvarEndereco(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        rua: campos.rua,
        numero: campos.numero,
        complemento: campos.complemento || undefined,
        cidade: campos.cidade,
        estado: campos.estado,
        cep: campos.cep,
      };

      const salvo = editandoId
        ? await addressesApi.update(editandoId, payload)
        : await addressesApi.create(payload);

      setEnderecos((prev) => {
        if (editandoId) {
          return prev.map((item) => (item.id === salvo.id ? salvo : item));
        }
        return [...prev, salvo];
      });
      setEnderecoSelecionadoId(salvo.id);
      cancelarForm();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Não foi possível salvar o endereço.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoverEndereco(id: number) {
    setError("");
    try {
      await addressesApi.remove(id);
      setEnderecos((prev) => prev.filter((item) => item.id !== id));
      if (enderecoSelecionadoId === id) {
        setEnderecoSelecionadoId(null);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Não foi possível remover o endereço.",
      );
    }
  }

  async function handleConfirmarPedido() {
    if (!enderecoSelecionadoId) {
      setError("Selecione um endereço de entrega.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const pedido = await ordersApi.checkout({
        addressId: enderecoSelecionadoId,
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
      <div className="card checkout-form">
        <h1>Endereço de entrega</h1>

        {carregandoEnderecos ? (
          <p>Carregando endereços...</p>
        ) : (
          <div className="address-list">
            {enderecos.map((endereco) => (
              <div
                key={endereco.id}
                className={`address-card ${
                  enderecoSelecionadoId === endereco.id ? "is-selected" : ""
                }`}
                onClick={() => setEnderecoSelecionadoId(endereco.id)}
              >
                <input
                  type="radio"
                  name="endereco"
                  className="address-card__radio"
                  checked={enderecoSelecionadoId === endereco.id}
                  onChange={() => setEnderecoSelecionadoId(endereco.id)}
                />
                <div className="address-card__info">
                  <strong>
                    {endereco.rua}, {endereco.numero}
                    {endereco.complemento ? ` - ${endereco.complemento}` : ""}
                  </strong>
                  <span>
                    {endereco.cidade}/{endereco.estado} - {endereco.cep}
                  </span>
                </div>
                <div className="address-card__actions">
                  <button
                    type="button"
                    className="address-card__action"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirEdicaoEndereco(endereco);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="address-card__action address-card__action--danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoverEndereco(endereco.id);
                    }}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

          {!mostrarForm && (
            <button
              type="button"
              className="address-add-btn"
              onClick={abrirNovoEndereco}
            >
              + Adicionar novo endereço
            </button>
          )}

        {mostrarForm && (
          <form className="address-form" onSubmit={handleSalvarEndereco}>
            <div className="field">
              <label htmlFor="rua">Rua</label>
              <input
                id="rua"
                required
                value={campos.rua}
                onChange={(e) =>
                  setCampos({ ...campos, rua: e.target.value })
                }
              />
            </div>
            <div className="checkout-form__row">
              <div className="field">
                <label htmlFor="numero">Número</label>
                <input
                  id="numero"
                  required
                  value={campos.numero}
                  onChange={(e) =>
                    setCampos({ ...campos, numero: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="complemento">Complemento</label>
                <input
                  id="complemento"
                  value={campos.complemento}
                  onChange={(e) =>
                    setCampos({ ...campos, complemento: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="checkout-form__row">
              <div className="field">
                <label htmlFor="cidade">Cidade</label>
                <input
                  id="cidade"
                  required
                  value={campos.cidade}
                  onChange={(e) =>
                    setCampos({ ...campos, cidade: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="estado">Estado</label>
                <input
                  id="estado"
                  required
                  maxLength={2}
                  value={campos.estado}
                  onChange={(e) =>
                    setCampos({ ...campos, estado: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="cep">CEP</label>
                <input
                  id="cep"
                  required
                  value={campos.cep}
                  onChange={(e) =>
                    setCampos({ ...campos, cep: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="address-form__actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar endereço"}
              </button>
              {enderecos.length > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelarForm}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}

        {error && <p className="error-text">{error}</p>}

        <button
          className="btn btn-primary checkout-form__confirm"
          onClick={handleConfirmarPedido}
          disabled={loading || !enderecoSelecionadoId}
        >
          {loading ? "Confirmando..." : "Confirmar pedido"}
        </button>
      </div>

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