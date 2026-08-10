import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "../api/auth";
import type { Usuario } from "../types";

interface AuthContextValue {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<Usuario>;
  register: (nome: string, email: string, senha: string) => Promise<Usuario>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredUser(): Usuario | null {
  const raw = localStorage.getItem("buildbox:user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Usuario;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(loadStoredUser);

  function persist(token: string, user: Usuario) {
    localStorage.setItem("buildbox:token", token);
    localStorage.setItem("buildbox:user", JSON.stringify(user));
    setUser(user);
  }

  async function login(email: string, senha: string) {
    const response = await authApi.login(email, senha);
    persist(response.token, response.user);
    return response.user;
  }

  async function register(nome: string, email: string, senha: string) {
    await authApi.register(nome, email, senha);
    const response = await authApi.login(email, senha);
    persist(response.token, response.user);
    return response.user;
  }

  function logout() {
    localStorage.removeItem("buildbox:token");
    localStorage.removeItem("buildbox:user");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
