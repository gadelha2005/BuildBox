import { http } from "./http";
import type { RoleUsuario, Usuario } from "../types";

export async function findAll() {
  const { data } = await http.get<Usuario[]>("/users");
  return data;
}

export async function updateRole(id: number, role: RoleUsuario) {
  const { data } = await http.patch<Usuario>(`/users/${id}/role`, { role });
  return data;
}

export async function updateStatus(id: number, ativo: boolean) {
  const { data } = await http.patch<Usuario>(`/users/${id}/status`, { active: ativo });
  return data;
}
