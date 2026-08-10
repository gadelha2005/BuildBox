import { http } from "./http";
import type { Endereco } from "../types";

interface AddressApiResponse {
  id: number;
  userId: number;
  street: string;
  number: string;
  complement: string | null;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
}

interface AddressPayload {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
}

function toEndereco(item: AddressApiResponse): Endereco {
  return {
    id: item.id,
    rua: item.street,
    numero: item.number,
    complemento: item.complement,
    cidade: item.city,
    estado: item.state,
    cep: item.zipCode,
  };
}

function toPayload(endereco: Omit<Endereco, "id">): AddressPayload {
  return {
    street: endereco.rua,
    number: endereco.numero,
    complement: endereco.complemento ?? undefined,
    city: endereco.cidade,
    state: endereco.estado,
    zipCode: endereco.cep,
  };
}

export async function findMine() {
  const { data } = await http.get<AddressApiResponse[]>("/addresses");
  return data.map(toEndereco);
}

export async function create(payload: Omit<Endereco, "id">) {
  const { data } = await http.post<AddressApiResponse>("/addresses", toPayload(payload));
  return toEndereco(data);
}

export async function update(id: number, payload: Omit<Endereco, "id">) {
  const { data } = await http.put<AddressApiResponse>(`/addresses/${id}`, toPayload(payload));
  return toEndereco(data);
}

export async function remove(id: number) {
  await http.delete(`/addresses/${id}`);
}