import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as productsApi from "../../api/products";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import type { Produto, VariacaoProduto } from "../../types";
import "./ProductDetailPage.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [variacaoSelecionada, setVariacaoSelecionada] =
    useState<VariacaoProduto | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsApi
      .findById(Number(id))
      .then((data) => {
        setProduto(data);
        setFotoAtiva(0);
        setVariacaoSelecionada(null);
        setQuantidade(1);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (!produto) return <p>Produto não encontrado.</p>;

  const temVariacoes = (produto.variacoes?.length ?? 0) > 0;
  const estoqueDisponivel = temVariacoes
    ? (variacaoSelecionada?.estoque ?? 0)
    : produto.estoque;
  const podeComprar = !temVariacoes || !!variacaoSelecionada;

  async function handleAddToCart() {
    setMensagem("");

    if (!isAuthenticated) {
      navigate("/entrar", { state: { from: `/produtos/${id}` } });
      return;
    }

    if (temVariacoes && !variacaoSelecionada) {
      setMensagem("Selecione uma variação antes de adicionar ao carrinho.");
      return;
    }

    if (quantidade > estoqueDisponivel) {
      setMensagem("Quantidade solicitada maior que o estoque disponível.");
      return;
    }

    await addItem(produto!.id, quantidade, variacaoSelecionada?.id);
    setMensagem("Produto adicionado ao carrinho!");
  }

  return (
    <div className="product-detail">
      <div className="product-detail__gallery">
        <div className="product-detail__main-image card">
          {produto.fotos?.[fotoAtiva] ? (
            <img src={produto.fotos[fotoAtiva].url} alt={produto.nome} />
          ) : (
            <div className="product-card__placeholder">Sem foto</div>
          )}
        </div>
        {produto.fotos && produto.fotos.length > 1 && (
          <div className="product-detail__thumbs">
            {produto.fotos.map((foto, index) => (
              <button
                key={foto.id}
                type="button"
                className={`product-detail__thumb ${index === fotoAtiva ? "is-active" : ""}`}
                onClick={() => setFotoAtiva(index)}
              >
                <img src={foto.url} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-detail__info">
        {produto.marca && (
          <span className="product-card__brand">{produto.marca.nome}</span>
        )}
        <h1>{produto.nome}</h1>
        <span className="product-detail__price">
          {currency.format(Number(produto.preco))}
        </span>
        <p className="product-detail__description">{produto.descricao}</p>

        {temVariacoes && (
          <div className="field">
            <label>Variação</label>
            <div className="product-detail__variants">
              {produto.variacoes!.map((variacao) => (
                <button
                  key={variacao.id}
                  type="button"
                  className={`product-detail__variant ${variacaoSelecionada?.id === variacao.id ? "is-active" : ""}`}
                  disabled={variacao.estoque <= 0}
                  onClick={() => setVariacaoSelecionada(variacao)}
                >
                  {[variacao.tamanho, variacao.cor]
                    .filter(Boolean)
                    .join(" / ") || "Padrão"}
                  {variacao.estoque <= 0 ? " (indisponível)" : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="product-detail__stock">
          {estoqueDisponivel > 0
            ? `${estoqueDisponivel} em estoque`
            : "Produto indisponível"}
        </p>

        <div className="field product-detail__quantity">
          <label htmlFor="quantidade">Quantidade</label>
          <input
            id="quantidade"
            type="number"
            min={1}
            max={Math.max(estoqueDisponivel, 1)}
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleAddToCart}
          disabled={!podeComprar || estoqueDisponivel <= 0}
        >
          Adicionar ao carrinho
        </button>

        {mensagem && <p className="product-detail__message">{mensagem}</p>}
      </div>
    </div>
  );
}
