import api from './api';

export interface Maquineta {
  id_maquineta: number;
  numero_serie: string;
  status: 'ativa' | 'inativa';
  id_unidade: number;
  logo?: string;
  unidade?: {
    id_unidade: number;
    nome: string;
    cidade: string;
    estado: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaquinetaData {
  numero_serie: string;
  status: 'ativa' | 'inativa';
  id_unidade: number;
  logo?: string;
}

export interface UpdateMaquinetaData {
  numero_serie?: string;
  status?: 'ativa' | 'inativa';
  id_unidade?: number;
  logo?: string;
}

class MaquinetasService {
  async getAll(id_unidade?: number): Promise<Maquineta[]> {
    const params = id_unidade ? { id_unidade } : {};
    const response = await api.get('/maquinetas', { params });
    return response.data;
  }

  async getById(id: number): Promise<Maquineta> {
    const response = await api.get(`/maquinetas/${id}`);
    return response.data;
  }

  async create(data: CreateMaquinetaData): Promise<Maquineta> {
    const response = await api.post('/maquinetas', data);
    return response.data;
  }

  async update(id: number, data: UpdateMaquinetaData): Promise<Maquineta> {
    const response = await api.patch(`/maquinetas/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/maquinetas/${id}`);
  }
}

export default new MaquinetasService(); 