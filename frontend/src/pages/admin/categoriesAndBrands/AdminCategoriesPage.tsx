
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import * as categoriesApi from "../../../api/categories";
import * as brandsApi from "../../../api/brands";
import type { Categoria, Marca } from "../../../types";
import "./AdminCategoriesPage.css";

interface ListaProps<T extends { id: number; nome: string }> {
  titulo: string;
  itens: T[];
  onCreate: (nome: string) => Promise<void>;
  onUpdate: (id: number, nome: string) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
}

function ListaGerenciavel<T extends { id: number; nome: string }>({
  titulo,
  itens,
  onCreate,
  onUpdate,
  onRemove,
}: ListaProps<T>) {
  const [novoNome, setNovoNome] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nomeEdicao, setNomeEdicao] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!novoNome.trim()) return;
    setError("");
    setSaving(true);
    try {
      await onCreate(novoNome.trim());
      setNovoNome("");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Não foi possível criar.");
    } finally {
      setSaving(false);
    }
  }

  function abrirEdicao(item: T) {
    setEditandoId(item.id);
    setNomeEdicao(item.nome);
    setError("");
  }

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();
    if (editandoId === null || !nomeEdicao.trim()) return;
    setError("");
    setSaving(true);
    try {
      await onUpdate(editandoId, nomeEdicao.trim());
      setEditandoId(null);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: number) {
    if (!confirm("Remover este item?")) return;
    setError("");
    try {
      await onRemove(id);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Não foi possível remover (pode haver produtos vinculados).",
      );
    }
  }

  return (
    <div className="card admin-category-list">
      <h2>{titulo}</h2>

      <form className="admin-category-list__new" onSubmit={handleCreate}>
        <input
          placeholder={`Nova ${titulo.toLowerCase()}`}
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={saving}>
          Adicionar
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <div className="admin-category-list__items">
        {itens.map((item) =>
          editandoId === item.id ? (
            <form
              key={item.id}
              className="admin-category-list__edit-row"
              onSubmit={handleUpdate}
            >
              <input
                value={nomeEdicao}
                onChange={(e) => setNomeEdicao(e.target.value)}
                autoFocus
              />
              <button className="address-card__action" type="submit" disabled={saving}>
                Salvar
              </button>
              <button
                type="button"
                className="address-card__action"
                onClick={() => setEditandoId(null)}
              >
                Cancelar
              </button>
            </form>
          ) : (
            <div key={item.id} className="admin-category-list__row">
              <span>{item.nome}</span>
              <div className="admin-category-list__actions">
                <button
                  type="button"
                  className="address-card__action"
                  onClick={() => abrirEdicao(item)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="address-card__action address-card__action--danger"
                  onClick={() => handleRemove(item.id)}
                >
                  Remover
                </button>
              </div>
            </div>
          ),
        )}

        {itens.length === 0 && <p>Nenhum item cadastrado.</p>}
      </div>
    </div>
  );
}

export function AdminCategoriesPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);

  function carregar() {
    setLoading(true);
    Promise.all([categoriesApi.findAll(), brandsApi.findAll()])
      .then(([cats, brs]) => {
        setCategorias(cats);
        setMarcas(brs);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="admin-categories">
      <h1>Categorias e Marcas</h1>
      <div className="admin-categories__grid">
        <ListaGerenciavel
          titulo="Categorias"
          itens={categorias}
          onCreate={async (nome) => {
            await categoriesApi.create(nome);
            carregar();
          }}
          onUpdate={async (id, nome) => {
            await categoriesApi.update(id, nome);
            carregar();
          }}
          onRemove={async (id) => {
            await categoriesApi.remove(id);
            carregar();
          }}
        />
        <ListaGerenciavel
          titulo="Marcas"
          itens={marcas}
          onCreate={async (nome) => {
            await brandsApi.create(nome);
            carregar();
          }}
          onUpdate={async (id, nome) => {
            await brandsApi.update(id, nome);
            carregar();
          }}
          onRemove={async (id) => {
            await brandsApi.remove(id);
            carregar();
          }}
        />
      </div>
    </div>
  );
}