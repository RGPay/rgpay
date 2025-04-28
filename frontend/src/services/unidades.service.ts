import api from "./api";

export interface Unidade {
  id_unidade: number;
  nome: string;
  endereco: string;
  telefone: string;
  responsavel: string;
  ativo: boolean;
}

export interface CreateUnidadeDto {
  nome: string;
  endereco: string;
  telefone: string;
  responsavel: string;
  ativo?: boolean;
}

export interface UpdateUnidadeDto {
  nome?: string;
  endereco?: string;
  telefone?: string;
  responsavel?: string;
  ativo?: boolean;
}

class UnidadesService {
  async getAll(): Promise<Unidade[]> {
    const response = await api.get("/unidades");
    return response.data;
  }

  async getById(id: number): Promise<Unidade> {
    const response = await api.get(`/unidades/${id}`);
    return response.data;
  }

  async create(unidade: CreateUnidadeDto): Promise<Unidade> {
    const response = await api.post("/unidades", unidade);
    return response.data;
  }

  async update(id: number, unidade: UpdateUnidadeDto): Promise<Unidade> {
    const response = await api.put(`/unidades/${id}`, unidade);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/unidades/${id}`);
  }
}

export default new UnidadesService();
