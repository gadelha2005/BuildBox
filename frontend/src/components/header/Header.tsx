import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import "./Header.css";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    navigate(`/produtos?q=${encodeURIComponent(term)}`);
  }

  return (
    <header className="header">
      <div className="container header__content">
        <Link to="/" className="header__logo">
          BuildBox
        </Link>

        <nav className="header__nav">
          <Link to="/produtos">Produtos</Link>
          {user?.role === "FUNCIONARIO" && (
            <Link to="/painel-funcionario">Painel</Link>
          )}
          {user?.role === "ADMIN" && (
            <Link to="/painel-admin">Painel Admin</Link>
          )}
        </nav>

        <form className="header__search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Buscar produtos..."
            value={term}
            onChange={(event) => setTerm(event.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Buscar
          </button>
        </form>

        <div className="header__actions">
          {isAuthenticated ? (
            <>
              <Link to="/pedidos">Meus pedidos</Link>
              <span className="header__user">Olá, {user?.nome}</span>
              <button className="btn btn-secondary" onClick={logout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/entrar">Entrar</Link>
              <Link to="/cadastrar" className="btn btn-secondary">
                Cadastrar
              </Link>
            </>
          )}
          <Link to="/carrinho" className="header__cart">
            Carrinho ({items.reduce((sum, item) => sum + item.quantidade, 0)})
          </Link>
        </div>
      </div>
    </header>
  );
}
