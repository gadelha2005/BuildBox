import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./StaffLayout.css";

export function StaffLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="staff-layout">
      <aside className="staff-sidebar">
        <div className="staff-sidebar__brand">BuildBox</div>
        <span className="staff-sidebar__role">Painel do Funcionário</span>

        <nav className="staff-sidebar__nav">
          <NavLink
            to="/painel-funcionario/estoque"
            className={({ isActive }) => (isActive ? "is-active" : "")}
          >
            Estoque
          </NavLink>
          <NavLink
            to="/painel-funcionario/pedidos"
            className={({ isActive }) => (isActive ? "is-active" : "")}
          >
            Pedidos
          </NavLink>
        </nav>

        <div className="staff-sidebar__footer">
          <span>{user?.nome}</span>
          <button className="btn btn-secondary" onClick={logout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="staff-content">
        <Outlet />
      </main>
    </div>
  );
}