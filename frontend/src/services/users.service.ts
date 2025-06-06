import api from "./api";

export interface User {
  id_usuario: number;
  nome: string;
  email: string;
  tipo_usuario: "master" | "gerente";
  id_unidade: number;
  unidade?: {
    id_unidade: number;
    nome: string;
  };
}

export interface CreateUserDto {
  nome: string;
  email: string;
  senha: string;
  tipo_usuario: "master" | "gerente";
  id_unidade: number;
}

export interface UpdateUserDto {
  nome?: string;
  email?: string;
  senha?: string;
  tipo_usuario?: "master" | "gerente";
  id_unidade?: number;
}

class UsersService {
  async getUsers(): Promise<User[]> {
    const response = await api.get("/usuarios");
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const response = await api.post("/usuarios", userData);
    return response.data;
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  }
}

export default new UsersService();
