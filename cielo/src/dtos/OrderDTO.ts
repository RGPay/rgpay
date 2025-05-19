export interface OrderItemDTO {
  id_produto: number;
  quantidade: number;
  preco_unitario: number;
  nome_produto?: string; // For display purposes
}

export interface OrderDTO {
  id_pedido?: number; // Optional when creating a new order
  data_hora?: string; // Optional when creating, server will set this
  valor_total: number;
  id_maquineta: number;
  id_unidade: number;
  items: OrderItemDTO[];
}
