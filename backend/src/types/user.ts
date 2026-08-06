export interface User {
  id: number;
  nome: string;
  email: string;
  role: 'CLIENTE' | 'FUNCIONARIO' | 'ADMIN';
  ativo: boolean;
  createdAt: Date;
}