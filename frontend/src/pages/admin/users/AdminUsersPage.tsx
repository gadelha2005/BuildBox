import { useEffect, useState } from "react";
import * as usersApi from "../../../api/users";
import { useAuth } from "../../../contexts/AuthContext";
import type { RoleUsuario, Usuario } from "../../../types";
import "./AdminUsersPage.css";

const ROLES: RoleUsuario[] = ["CLIENTE", "FUNCIONARIO", "ADMIN"];

export function AdminUsersPage() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);

  function carregar() {
    setLoading(true);
    usersApi
      .findAll()
      .then(setUsuarios)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleRoleChange(usuario: Usuario, novaRole: RoleUsuario) {
    setError("");
    setAtualizandoId(usuario.id);
    try {
      await usersApi.updateRole(usuario.id, novaRole);
      carregar();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Não foi possível alterar a role.",
      );
    } finally {
      setAtualizandoId(null);
    }
  }

  async function handleToggleStatus(usuario: Usuario) {
    setError("");
    setAtualizandoId(usuario.id);
    try {
      await usersApi.updateStatus(usuario.id, !usuario.ativo);
      carregar();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Não foi possível alterar o status.",
      );
    } finally {
      setAtualizandoId(null);
    }
  }

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div className="admin-users">
      <h1>Usuários</h1>

      {error && <p className="error-text">{error}</p>}

      <div className="admin-table card">
        <div className="admin-table__header admin-users__header">
          <span>Nome</span>
          <span>E-mail</span>
          <span>Role</span>
          <span>Status</span>
          <span></span>
        </div>

        {usuarios.map((usuario) => {
          const isVocêMesmo = usuario.id === user?.id;
          return (
            <div key={usuario.id} className="admin-table__row admin-users__row">
              <span>{usuario.nome}</span>
              <span>{usuario.email}</span>
              <span>
                <select
                  value={usuario.role}
                  disabled={isVocêMesmo || atualizandoId === usuario.id}
                  onChange={(e) =>
                    handleRoleChange(usuario, e.target.value as RoleUsuario)
                  }
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </span>
              <span>
                {usuario.ativo ? (
                  <span className="stock-badge stock-badge--ok">Ativo</span>
                ) : (
                  <span className="stock-badge stock-badge--low">Bloqueado</span>
                )}
              </span>
              <span>
                <button
                  type="button"
                  className={
                    usuario.ativo
                      ? "address-card__action address-card__action--danger"
                      : "address-card__action"
                  }
                  disabled={isVocêMesmo || atualizandoId === usuario.id}
                  onClick={() => handleToggleStatus(usuario)}
                  title={isVocêMesmo ? "Você não pode alterar sua própria conta" : undefined}
                >
                  {usuario.ativo ? "Bloquear" : "Desbloquear"}
                </button>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}