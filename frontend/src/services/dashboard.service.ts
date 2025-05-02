import api from "./api";
import { store } from "../store/store";

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
    const selectedUnidade = store.getState().unidade.selectedUnidade;
    const mergedFilters = {
      ...filters,
      id_unidade: selectedUnidade ? Number(selectedUnidade) : undefined,
    };
    const response = await api.get("/dashboard/metrics", {
      params: mergedFilters,
    });
    return response.data;
  }
}

export default new DashboardService();
