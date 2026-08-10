import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./LoginPage.css";

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
      const usuario = await login(email, senha);
      const from = (location.state as { from?: string } | null)?.from;
      const destino =
        from ?? (usuario.role === "FUNCIONARIO" ? "/painel-funcionario/estoque" : "/");
      navigate(destino, { replace: true });
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
      <Link to="/" className="auth-close" aria-label="Voltar para a loja">
        ×
      </Link>

      <div className="auth-card">
        <div className="auth-brand">
          <div>
            <div className="auth-brand__logo">BuildBox</div>
            <div className="auth-brand__tagline">
              Ferragens, elétrica, hidráulica &amp; tintas
            </div>
          </div>
          <div className="auth-brand__text">
            Entre na sua conta para acompanhar pedidos, gerenciar endereços e
            finalizar suas compras mais rápido.
          </div>
          <Link to="/" className="auth-back-link">
            &larr; Voltar para a loja
          </Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          <p className="auth-form__subtitle">Acesse sua conta BuildBox</p>

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
          <p className="auth-form__footer">
            Não tem conta? <Link to="/cadastrar">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
