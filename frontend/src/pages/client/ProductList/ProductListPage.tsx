import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as productsApi from "../../../api/products";
import * as categoriesApi from "../../../api/categories";
import * as brandsApi from "../../../api/brands";
import { ProductCard } from "../../../components/ProductCard";
import type { Categoria, Marca, Produto } from "../../../types";
import "./ProductListPage.css";

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [total, setTotal] = useState(0);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") ?? "";
  const categoriaId = searchParams.get("categoriaId") ?? "";
  const marcaId = searchParams.get("marcaId") ?? "";
  const precoMin = searchParams.get("precoMin") ?? "";
  const precoMax = searchParams.get("precoMax") ?? "";
  const sort = searchParams.get("sort") ?? "";

  useEffect(() => {
    Promise.all([categoriesApi.findAll(), brandsApi.findAll()]).then(
      ([cats, brs]) => {
        setCategorias(cats);
        setMarcas(brs);
      },
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    productsApi
      .findAll({
        q: q || undefined,
        categoriaId: categoriaId ? Number(categoriaId) : undefined,
        marcaId: marcaId ? Number(marcaId) : undefined,
        precoMin: precoMin ? Number(precoMin) : undefined,
        precoMax: precoMax ? Number(precoMax) : undefined,
        sort: (sort as "preco_asc" | "preco_desc") || undefined,
      })
      .then((response) => {
        setProdutos(response.data);
        setTotal(response.total);
      })
      .finally(() => setLoading(false));
  }, [q, categoriaId, marcaId, precoMin, precoMax, sort]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  }

  return (
    <div className="product-list">
      <aside className="product-list__filters card">
        <h2>Filtros</h2>

        <div className="field">
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            value={categoriaId}
            onChange={(e) => updateParam("categoriaId", e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="marca">Marca</label>
          <select
            id="marca"
            value={marcaId}
            onChange={(e) => updateParam("marcaId", e.target.value)}
          >
            <option value="">Todas</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Faixa de preço</label>
          <div className="product-list__price-range">
            <input
              type="number"
              placeholder="Mín."
              value={precoMin}
              onChange={(e) => updateParam("precoMin", e.target.value)}
            />
            <input
              type="number"
              placeholder="Máx."
              value={precoMax}
              onChange={(e) => updateParam("precoMax", e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="sort">Ordenar por</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
          >
            <option value="">Relevância</option>
            <option value="preco_asc">Menor preço</option>
            <option value="preco_desc">Maior preço</option>
          </select>
        </div>
      </aside>

      <div className="product-list__results">
        <p className="product-list__total">
          {loading ? "Buscando..." : `${total} produto(s) encontrado(s)`}
        </p>
        <div className="product-grid">
          {produtos.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
        {!loading && produtos.length === 0 && (
          <p>Nenhum produto encontrado com os filtros selecionados.</p>
        )}
      </div>
    </div>
  );
}
