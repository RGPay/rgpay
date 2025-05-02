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

export interface FaturamentoPorHora {
  hour: number;
  value: number;
}

export interface Evento {
  id: number;
  name: string;
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

  async getEventos(unidadeId?: number): Promise<Evento[]> {
    const params: Record<string, unknown> = {};
    if (unidadeId) params.id_unidade = unidadeId;
    const response = await api.get("/eventos", { params });
    return response.data;
  }

  async getFaturamentoPorHora(
    eventId?: number,
    id_unidade?: number,
    filter?: DashboardFilter
  ): Promise<FaturamentoPorHora[]> {
    const params: Record<string, unknown> = {};
    if (eventId) params.eventId = eventId;
    if (id_unidade) params.id_unidade = id_unidade;
    if (filter?.periodoInicio) params.periodoInicio = filter.periodoInicio;
    if (filter?.periodoFim) params.periodoFim = filter.periodoFim;
    const response = await api.get("/dashboard/faturamento-por-hora", {
      params,
    });
    return response.data;
  }
}

export default new DashboardService();
