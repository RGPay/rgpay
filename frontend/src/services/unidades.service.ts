import api from "./api";

export interface Unidade {
  id_unidade: number;
  nome: string;
  tipo: 'casa_show' | 'bar' | 'restaurante';
  cnpj?: string;
  cidade: string;
  estado: string;
  endereco: string;
}

export interface CreateUnidadeDto {
  nome: string;
  tipo?: 'casa_show' | 'bar' | 'restaurante';
  cnpj?: string;
  cidade: string;
  estado: string;
  endereco: string;
}

export interface UpdateUnidadeDto {
  nome?: string;
  tipo?: 'casa_show' | 'bar' | 'restaurante';
  cnpj?: string;
  cidade?: string;
  estado?: string;
  endereco?: string;
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
