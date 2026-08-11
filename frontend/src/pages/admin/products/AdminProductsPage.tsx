import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import * as productsApi from "../../../api/products";
import * as categoriesApi from "../../../api/categories";
import * as brandsApi from "../../../api/brands";
import type { Categoria, Marca, Produto } from "../../../types";
import "./AdminProductsPage.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const CAMPOS_VAZIOS = {
  nome: "",
  descricao: "",
  preco: "",
  unidadeMedida: "",
  categoriaId: "",
  marcaId: "",
  estoque: "",
  estoqueMinimo: "",
};

export function AdminProductsPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [formAberto, setFormAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [campos, setCampos] = useState(CAMPOS_VAZIOS);
  const [produtoDetalhe, setProdutoDetalhe] = useState<Produto | null>(null);

  const [novaFotoUrl, setNovaFotoUrl] = useState("");
  const [novaVariante, setNovaVariante] = useState({
    tamanho: "",
    cor: "",
    estoque: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function carregar() {
    setLoading(true);
    productsApi
      .findAllAdmin({ pageSize: 200 })
      .then((res) => setProdutos(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    carregar();
    Promise.all([categoriesApi.findAll(), brandsApi.findAll()]).then(
      ([cats, brs]) => {
        setCategorias(cats);
        setMarcas(brs);
      },
    );
  }, []);

    useEffect(() => {
      if (!mensagem) return;
      const timer = setTimeout(() => setMensagem(""), 3000);
      return () => clearTimeout(timer);
    }, [mensagem]);

  function nomeCategoria(id: number) {
    return categorias.find((c) => c.id === id)?.nome ?? "-";
  }

  function nomeMarca(id: number) {
    return marcas.find((m) => m.id === id)?.nome ?? "-";
  }

  function abrirNovo() {
    setEditandoId(null);
    setProdutoDetalhe(null);
    setCampos(CAMPOS_VAZIOS);
    setError("");
    setFormAberto(true);
  }

  async function abrirEdicao(produto: Produto) {
    setError("");
    setEditandoId(produto.id);
    setCampos({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: String(produto.preco),
      unidadeMedida: produto.unidadeMedida,
      categoriaId: String(produto.categoriaId),
      marcaId: String(produto.marcaId),
      estoque: String(produto.estoque),
      estoqueMinimo: String(produto.estoqueMinimo),
    });
    setFormAberto(true);
    const detalhe = await productsApi.findById(produto.id);
    setProdutoDetalhe(detalhe);
  }

  function fecharForm() {
    setFormAberto(false);
    setEditandoId(null);
    setProdutoDetalhe(null);
    setCampos(CAMPOS_VAZIOS);
  }

    async function handleSubmit(event: FormEvent) {
      event.preventDefault();
      setError("");
      setSaving(true);
      try {
        const payload = {
          nome: campos.nome,
          descricao: campos.descricao,
          preco: Number(campos.preco),
          unidadeMedida: campos.unidadeMedida,
          categoriaId: Number(campos.categoriaId),
          marcaId: Number(campos.marcaId),
          estoque: campos.estoque ? Number(campos.estoque) : undefined,
          estoqueMinimo: campos.estoqueMinimo
            ? Number(campos.estoqueMinimo)
            : undefined,
        };

        if (editandoId) {
          await productsApi.update(editandoId, payload);
          setMensagem("Produto atualizado com sucesso!");
        } else {
          await productsApi.create(payload);
          setMensagem("Produto criado com sucesso!");
        }

        fecharForm();
        carregar();
      } catch (err: any) {
        setError(
          err?.response?.data?.message ?? "Não foi possível salvar o produto.",
        );
      } finally {
        setSaving(false);
      }
  }

  async function handleDesativar(produto: Produto) {
    if (!confirm(`Desativar "${produto.nome}"?`)) return;
    await productsApi.deactivate(produto.id);
    setMensagem("Produto desativado com sucesso!");
    carregar();
  }

  async function handleAtivar(produto: Produto) {
    await productsApi.activate(produto.id);
    setMensagem("Produto ativado com sucesso!");
    carregar();
  }

  async function handleAdicionarFoto(event: FormEvent) {
    event.preventDefault();
    if (!editandoId || !novaFotoUrl) return;
    await productsApi.addPhoto(editandoId, novaFotoUrl);
    setNovaFotoUrl("");
    const detalhe = await productsApi.findById(editandoId);
    setProdutoDetalhe(detalhe);
  }

  async function handleRemoverFoto(fotoId: number) {
    if (!editandoId) return;
    await productsApi.removePhoto(editandoId, fotoId);
    const detalhe = await productsApi.findById(editandoId);
    setProdutoDetalhe(detalhe);
  }

  async function handleAdicionarVariante(event: FormEvent) {
    event.preventDefault();
    if (!editandoId) return;
    await productsApi.addVariant(
      editandoId,
      novaVariante.tamanho || undefined,
      novaVariante.cor || undefined,
      Number(novaVariante.estoque) || 0,
    );
    setNovaVariante({ tamanho: "", cor: "", estoque: "" });
    const detalhe = await productsApi.findById(editandoId);
    setProdutoDetalhe(detalhe);
  }

  return (
    <div className="admin-products">
      <div className="admin-products__header">
        <h1>Produtos</h1>
        {!formAberto && (
          <button className="btn btn-primary" onClick={abrirNovo}>
            + Novo produto
          </button>
        )}
      </div>

      {mensagem && <p className="admin-products__toast">{mensagem}</p>}

      {formAberto && (
        <div className="card admin-product-form">
          <form onSubmit={handleSubmit}>
            <h2>{editandoId ? "Editar produto" : "Novo produto"}</h2>

            <div className="field">
              <label>Nome</label>
              <input
                required
                value={campos.nome}
                onChange={(e) => setCampos({ ...campos, nome: e.target.value })}
              />
            </div>

            <div className="field">
              <label>Descrição</label>
              <textarea
                required
                value={campos.descricao}
                onChange={(e) =>
                  setCampos({ ...campos, descricao: e.target.value })
                }
              />
            </div>

            <div className="admin-product-form__row">
              <div className="field">
                <label>Preço</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={campos.preco}
                  onChange={(e) =>
                    setCampos({ ...campos, preco: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Unidade</label>
                <input
                  required
                  placeholder="unidade, rolo, lata..."
                  value={campos.unidadeMedida}
                  onChange={(e) =>
                    setCampos({ ...campos, unidadeMedida: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="admin-product-form__row">
              <div className="field">
                <label>Categoria</label>
                <select
                  required
                  value={campos.categoriaId}
                  onChange={(e) =>
                    setCampos({ ...campos, categoriaId: e.target.value })
                  }
                >
                  <option value="">Selecione</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Marca</label>
                <select
                  required
                  value={campos.marcaId}
                  onChange={(e) =>
                    setCampos({ ...campos, marcaId: e.target.value })
                  }
                >
                  <option value="">Selecione</option>
                  {marcas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-product-form__row">
              <div className="field">
                <label>Estoque</label>
                <input
                  type="number"
                  min={0}
                  value={campos.estoque}
                  onChange={(e) =>
                    setCampos({ ...campos, estoque: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Estoque mínimo</label>
                <input
                  type="number"
                  min={0}
                  value={campos.estoqueMinimo}
                  onChange={(e) =>
                    setCampos({ ...campos, estoqueMinimo: e.target.value })
                  }
                />
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="admin-product-form__actions">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar produto"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={fecharForm}>
                Fechar
              </button>
            </div>
          </form>

            {!editandoId && (
                <p className="admin-product-form__hint">
                  Salve o produto primeiro para poder adicionar fotos e variações.
                </p>
              )}
          {editandoId && produtoDetalhe && (
            <div className="admin-product-extra">
              <div className="admin-product-extra__block">
                <h3>Fotos</h3>
                <div className="admin-photo-list">
                  {produtoDetalhe.fotos?.map((foto) => (
                    <div key={foto.id} className="admin-photo-item">
                      <img src={foto.url} alt="" />
                      <button
                        type="button"
                        className="address-card__action address-card__action--danger"
                        onClick={() => handleRemoverFoto(foto.id)}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  {(!produtoDetalhe.fotos || produtoDetalhe.fotos.length === 0) && (
                    <p>Nenhuma foto cadastrada.</p>
                  )}
                </div>
                <form className="admin-inline-form" onSubmit={handleAdicionarFoto}>
                  <input
                    placeholder="URL da foto"
                    value={novaFotoUrl}
                    onChange={(e) => setNovaFotoUrl(e.target.value)}
                  />
                  <button className="btn btn-secondary" type="submit">
                    Adicionar foto
                  </button>
                </form>
              </div>

              <div className="admin-product-extra__block">
                <h3>Variações</h3>
                <div className="admin-variant-list">
                  {produtoDetalhe.variacoes?.map((v) => (
                    <span key={v.id} className="stock-variant-chip">
                      {[v.tamanho, v.cor].filter(Boolean).join(" / ") || "Padrão"}:{" "}
                      {v.estoque}
                    </span>
                  ))}
                  {(!produtoDetalhe.variacoes ||
                    produtoDetalhe.variacoes.length === 0) && (
                    <p>Nenhuma variação cadastrada.</p>
                  )}
                </div>
                <form
                  className="admin-inline-form"
                  onSubmit={handleAdicionarVariante}
                >
                  <input
                    placeholder="Tamanho"
                    value={novaVariante.tamanho}
                    onChange={(e) =>
                      setNovaVariante({ ...novaVariante, tamanho: e.target.value })
                    }
                  />
                  <input
                    placeholder="Cor"
                    value={novaVariante.cor}
                    onChange={(e) =>
                      setNovaVariante({ ...novaVariante, cor: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Estoque"
                    value={novaVariante.estoque}
                    onChange={(e) =>
                      setNovaVariante({ ...novaVariante, estoque: e.target.value })
                    }
                  />
                  <button className="btn btn-secondary" type="submit">
                    Adicionar variação
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="admin-table card">
          <div className="admin-table__header">
            <span>Produto</span>
            <span>Categoria</span>
            <span>Marca</span>
            <span>Preço</span>
            <span>Estoque</span>
            <span>Status</span>
            <span></span>
          </div>

          {produtos.map((produto) => (
            <div key={produto.id} className="admin-table__row">
              <span>{produto.nome}</span>
              <span>{nomeCategoria(produto.categoriaId)}</span>
              <span>{nomeMarca(produto.marcaId)}</span>
              <span>{currency.format(Number(produto.preco))}</span>
              <span>{produto.estoque}</span>
              <span>
                {produto.ativo ? (
                  <span className="stock-badge stock-badge--ok">Ativo</span>
                ) : (
                  <span className="stock-badge stock-badge--low">Inativo</span>
                )}
              </span>
              <span className="admin-table__actions">
                <button
                  type="button"
                  className="address-card__action"
                  onClick={() => abrirEdicao(produto)}
                >
                  Editar
                </button>
                {produto.ativo ? (
                  <button
                    type="button"
                    className="address-card__action address-card__action--danger"
                    onClick={() => handleDesativar(produto)}
                  >
                    Desativar
                  </button>
                ) : (
                  <button
                    type="button"
                    className="address-card__action"
                    onClick={() => handleAtivar(produto)}
                  >
                    Ativar
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}