import api from "./api";

export interface ItemPedido {
  id_item_pedido?: number;
  id_pedido?: number;
  id_produto: number;
  quantidade: number;
  preco_unitario?: number;
  produto?: {
    id_produto: number;
    nome: string;
    categoria: string;
  };
}

export interface Pedido {
  id_pedido: number;
  data_hora: string;
  valor_total: number;
  id_unidade: number;
  id_maquineta?: number;
  unidade?: {
    id_unidade: number;
    nome: string;
  };
  maquineta?: {
    id_maquineta: number;
    numero_serie: string;
    status?: "ativa" | "inativa";
  };
  itensPedido?: ItemPedido[];
}

export interface PedidosFilter {
  data_inicio?: Date;
  data_fim?: Date;
  id_unidade?: number;
}

class PedidosService {
  async getAll(filters: PedidosFilter = {}): Promise<Pedido[]> {
    const response = await api.get("/pedidos", { params: filters });
    return response.data;
  }

  async getById(id: number): Promise<Pedido> {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  }
}

export default new PedidosService();

export { default as pedidosService } from "./pedidos.service";
