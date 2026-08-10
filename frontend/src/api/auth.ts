import { http } from "./http";
import type { RoleUsuario, Usuario } from "../types";

export interface AuthResponse {
  token: string;
  user: Usuario;
}

export interface RegisterResponse {
  id: number;
  nome: string;
  email: string;
  role: RoleUsuario;
}

export async function register(nome: string, email: string, senha: string) {
  const { data } = await http.post<RegisterResponse>("/auth/register", {
    name: nome,
    email,
    password: senha,
  });
  return data;
}

export async function login(email: string, senha: string) {
  const { data } = await http.post<AuthResponse>("/auth/login", {
    email,
    password: senha,
  });
  return data;
}

export async function me() {
  const { data } = await http.get<{ user: Usuario & { role: RoleUsuario } }>(
    "/me",
  );
  return data.user;
}
