import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as productsApi from "../../../api/products";
import * as categoriesApi from "../../../api/categories";
import { ProductCard } from "../../../components/ProductCard";
import { Section } from "../../../components/Section";
import type { Categoria, Produto } from "../../../types";

export function HomePage() {
  const [destaques, setDestaques] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productsApi.findAll({ pageSize: 8 }), categoriesApi.findAll()])
      .then(([produtos, cats]) => {
        setDestaques(produtos.data);
        setCategorias(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="hero card">
        <h1>Tudo para sua obra e reforma</h1>
        <p>Elétrica, hidráulica, ferramentas e tintas em um só lugar.</p>
        <Link to="/produtos" className="btn btn-primary">
          Ver todos os produtos
        </Link>
      </div>

      <Section title="Categorias">
        <div className="category-grid">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              to={`/produtos?categoriaId=${categoria.id}`}
              className="category-chip card"
            >
              {categoria.nome}
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Produtos em destaque">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="product-grid">
            {destaques.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
