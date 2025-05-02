import api from "./api";

export interface Evento {
  id_evento: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  id_unidade: number;
  unidade?: {
    id_unidade: number;
    nome: string;
  };
}

export interface CreateEventoDto {
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  id_unidade: number;
}

export interface UpdateEventoDto {
  nome?: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
  id_unidade?: number;
}

class EventosService {
  async getAll(): Promise<Evento[]> {
    const response = await api.get("/eventos");
    return response.data;
  }

  async getById(id: number): Promise<Evento> {
    const response = await api.get(`/eventos/${id}`);
    return response.data;
  }

  async create(evento: CreateEventoDto): Promise<Evento> {
    const response = await api.post("/eventos", evento);
    return response.data;
  }

  async update(id: number, evento: UpdateEventoDto): Promise<Evento> {
    const response = await api.put(`/eventos/${id}`, evento);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/eventos/${id}`);
  }
}

export default new EventosService(); 