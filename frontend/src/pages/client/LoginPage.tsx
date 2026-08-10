import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./AuthPages.css";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, senha);
      const from = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "E-mail ou senha inválidos.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-form" onSubmit={handleSubmit}>
        <h1>Entrar</h1>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p>
          Não tem conta? <Link to="/cadastrar">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}
