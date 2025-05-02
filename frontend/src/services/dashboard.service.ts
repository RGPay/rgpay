import api from "./api";

export interface DashboardMetrics {
  totalVendas: number;
  faturamentoTotal: number;
  ticketMedio: number;
  totalPedidos: number;
  pedidosHoje: number;
  totalUnidades: number;
  totalItensVendidos: number;
  produtosMaisVendidos: {
    id_produto: number;
    nome: string;
    quantidade: number;
    valor_total: number;
  }[];
  vendasPorPeriodo: {
    data: string;
    total: number;
  }[];
  vendasPorUnidade: {
    id_unidade: number;
    nome: string;
    total: number;
  }[];
  faturamentoPorFormaPagamento: {
    forma_pagamento: string;
    total: number;
  }[];
}

export interface DashboardFilter {
  periodoInicio?: Date;
  periodoFim?: Date;
  id_unidade?: number;
}

class DashboardService {
  async getMetrics(filters: DashboardFilter = {}): Promise<DashboardMetrics> {
    const response = await api.get("/dashboard/metrics", { params: filters });
    return response.data;
  }
}

export default new DashboardService();
