import { http } from "./http";
import type { RoleUsuario, Usuario } from "../types";

export interface AuthResponse {
  token: string;
  user: Usuario;
}

export async function register(nome: string, email: string, senha: string) {
  const { data } = await http.post<AuthResponse>("/auth/register", {
    nome,
    email,
    senha,
  });
  return data;
}

export async function login(email: string, senha: string) {
  const { data } = await http.post<AuthResponse>("/auth/login", {
    email,
    senha,
  });
  return data;
}

export async function me() {
  const { data } = await http.get<{ user: Usuario & { role: RoleUsuario } }>(
    "/me",
  );
  return data.user;
}
