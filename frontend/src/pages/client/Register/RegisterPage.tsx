import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./RegisterPage.css";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (senha.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await register(nome, email, senha);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Não foi possível concluir o cadastro.",
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
            Crie sua conta gratuita e tenha acesso ao histórico de pedidos,
            endereços salvos e um checkout mais rápido.
          </div>
          <Link to="/" className="auth-back-link">
            &larr; Voltar para a loja
          </Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Criar conta</h1>
          <p className="auth-form__subtitle">Cadastre-se como cliente BuildBox</p>

          <div className="field">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
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
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Cadastrar"}
          </button>
          <p className="auth-form__footer">
            Já tem conta? <Link to="/entrar">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
