import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./AdminLayout.css";

export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">BuildBox</div>
        <span className="admin-sidebar__role">Painel Admin</span>

        <nav className="admin-sidebar__nav">
          <NavLink
            to="/painel-admin/produtos"
            className={({ isActive }) => (isActive ? "is-active" : "")}
          >
            Produtos
          </NavLink>
          <NavLink
            to="/painel-admin/categorias-marcas"
            className={({ isActive }) => (isActive ? "is-active" : "")}
          >
            Categorias e Marcas
          </NavLink>
          <NavLink
            to="/painel-admin/estoque"
            className={({ isActive }) => (isActive ? "is-active" : "")}
          >
            Estoque
          </NavLink>
          <NavLink
            to="/painel-admin/pedidos"
            className={({ isActive }) => (isActive ? "is-active" : "")}
          >
            Pedidos
          </NavLink>
          <NavLink
            to="/painel-admin/usuarios"
            className={({ isActive }) => (isActive ? "is-active" : "")}
          >
            Usuários
          </NavLink>
          <NavLink
            to="/painel-admin/relatorios"
            className={({ isActive }) => (isActive ? "is-active" : "")}
          >
            Relatórios
          </NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <span>{user?.nome}</span>
          <button className="btn btn-secondary" onClick={logout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}