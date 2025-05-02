import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op, fn, col, literal } from 'sequelize';
import { Pedido } from '../pedidos/pedido.model';
import { ItemPedido } from '../pedidos/item-pedido.model';
import { Unidade } from '../unidades/unidade.model';
import { Produto } from '../produtos/produto.model';
import { startOfDay, endOfDay } from 'date-fns';

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
  id_evento?: number;
}

// Define interfaces for raw query results
interface ProdutoVendidoResult {
  id_produto: number;
  quantidade: string | number;
  valor_total: string | number;
  produto: {
    nome: string;
  };
}

interface VendaPorPeriodoResult {
  data: string;
  total: string | number;
}

interface VendaPorUnidadeResult {
  id_unidade: number;
  total: string | number;
  unidade: {
    nome: string;
  };
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Pedido)
    private readonly pedidoModel: typeof Pedido,
    @InjectModel(ItemPedido)
    private readonly itemPedidoModel: typeof ItemPedido,
    @InjectModel(Unidade)
    private readonly unidadeModel: typeof Unidade,
    @InjectModel(Produto)
    private readonly produtoModel: typeof Produto,
    private readonly sequelize: Sequelize,
  ) {}

  async getMetrics(filter: DashboardFilter = {}): Promise<DashboardMetrics> {
    // Base query filters
    const whereClause: Record<string, any> = {};

    // Apply date filters
    if (filter.periodoInicio && filter.periodoFim) {
      whereClause.data_hora = {
        [Op.between]: [
          startOfDay(new Date(filter.periodoInicio)),
          endOfDay(new Date(filter.periodoFim)),
        ],
      };
    } else if (filter.periodoInicio) {
      whereClause.data_hora = {
        [Op.gte]: startOfDay(new Date(filter.periodoInicio)),
      };
    } else if (filter.periodoFim) {
      whereClause.data_hora = {
        [Op.lte]: endOfDay(new Date(filter.periodoFim)),
      };
    }

    // Apply unidade filter
    if (filter.id_unidade) {
      whereClause.id_unidade = filter.id_unidade;
    }

    // Apply event filter
    if (filter.id_evento) {
      whereClause.id_evento = filter.id_evento;
    }

    // Get total pedidos and faturamento total
    const totalPedidos = await this.pedidoModel.count({ where: whereClause });
    let faturamentoTotal = 0;
    const faturamento = await this.pedidoModel.sum('valor_total', {
      where: whereClause,
    });
    if (faturamento) {
      faturamentoTotal = Number(faturamento);
    }

    // Calculate ticket médio
    const ticketMedio = totalPedidos > 0 ? faturamentoTotal / totalPedidos : 0;

    // Get today's pedidos
    const today = new Date();
    const pedidosHoje = await this.pedidoModel.count({
      where: {
        ...whereClause,
        data_hora: {
          [Op.between]: [startOfDay(today), endOfDay(today)],
        },
      },
    });

    // Get total unidades
    const totalUnidades = await this.unidadeModel.count();

    // Get total itens vendidos
    const pedidosIds = (
      await this.pedidoModel.findAll({
        attributes: ['id_pedido'],
        where: whereClause,
        raw: true,
      })
    ).map((pedido) => pedido.id_pedido);

    let totalItensVendidos = 0;
    if (pedidosIds.length > 0) {
      const totalItens = await this.itemPedidoModel.sum('quantidade', {
        where: {
          id_pedido: {
            [Op.in]: pedidosIds,
          },
        },
      });
      if (totalItens) {
        totalItensVendidos = Number(totalItens);
      }
    }

    // Get produtos mais vendidos
    const produtosMaisVendidos: {
      id_produto: number;
      nome: string;
      quantidade: number;
      valor_total: number;
    }[] = [];

    if (pedidosIds.length > 0) {
      const result = (await this.itemPedidoModel.findAll({
        attributes: [
          'id_produto',
          [fn('SUM', col('quantidade')), 'quantidade'],
          [fn('SUM', literal('quantidade * preco_unitario')), 'valor_total'],
        ],
        include: [
          {
            model: Produto,
            attributes: ['nome'],
            required: true,
          },
        ],
        where: {
          id_pedido: {
            [Op.in]: pedidosIds,
          },
        },
        group: ['id_produto', 'produto.nome'],
        order: [[literal('quantidade'), 'DESC']],
        limit: 10,
        raw: true,
        nest: true,
      })) as unknown as ProdutoVendidoResult[];

      for (const item of result) {
        produtosMaisVendidos.push({
          id_produto: item.id_produto,
          nome: item.produto.nome,
          quantidade: Number(item.quantidade),
          valor_total: Number(item.valor_total),
        });
      }
    }

    // Get vendas por periodo
    const vendasPorPeriodo: { data: string; total: number }[] = [];

    if (totalPedidos > 0) {
      const pedidosPorData = (await this.pedidoModel.findAll({
        attributes: [
          [fn('DATE_FORMAT', col('data_hora'), '%d/%m'), 'data'],
          [fn('SUM', col('valor_total')), 'total'],
        ],
        where: whereClause,
        group: [fn('DATE_FORMAT', col('data_hora'), '%d/%m')],
        order: [[col('data'), 'ASC']],
        raw: true,
      })) as unknown as VendaPorPeriodoResult[];

      for (const item of pedidosPorData) {
        vendasPorPeriodo.push({
          data: item.data,
          total: Number(item.total),
        });
      }
    }

    // Get vendas por unidade
    const vendasPorUnidade: {
      id_unidade: number;
      nome: string;
      total: number;
    }[] = [];

    if (totalPedidos > 0) {
      const vendasUnidade = (await this.pedidoModel.findAll({
        attributes: ['id_unidade', [fn('SUM', col('valor_total')), 'total']],
        include: [
          {
            model: Unidade,
            attributes: ['nome'],
            required: true,
          },
        ],
        where: whereClause,
        group: ['id_unidade', 'unidade.nome'],
        order: [[literal('total'), 'DESC']],
        limit: 10,
        raw: true,
        nest: true,
      })) as unknown as VendaPorUnidadeResult[];

      for (const item of vendasUnidade) {
        vendasPorUnidade.push({
          id_unidade: item.id_unidade,
          nome: item.unidade.nome,
          total: Number(item.total),
        });
      }
    }

    // Get faturamento por forma de pagamento
    const faturamentoPorFormaPagamento: {
      forma_pagamento: string;
      total: number;
    }[] = [];
    const pagamentos = await this.pedidoModel.findAll({
      attributes: ['forma_pagamento', [fn('SUM', col('valor_total')), 'total']],
      where: whereClause,
      group: ['forma_pagamento'],
      raw: true,
    });
    for (const item of pagamentos as unknown as {
      forma_pagamento: string;
      total: number;
    }[]) {
      faturamentoPorFormaPagamento.push({
        forma_pagamento: item.forma_pagamento,
        total: Number(item.total),
      });
    }

    return {
      totalVendas: totalPedidos,
      faturamentoTotal,
      ticketMedio,
      totalPedidos,
      pedidosHoje,
      totalUnidades,
      totalItensVendidos,
      produtosMaisVendidos,
      vendasPorPeriodo,
      vendasPorUnidade,
      faturamentoPorFormaPagamento,
    };
  }

  async getFaturamentoPorHora(
    eventId?: number,
    id_unidade?: number,
    periodoInicio?: string | Date,
    periodoFim?: string | Date,
  ): Promise<{ hour: number; value: number }[]> {
    const whereClause: Record<string, any> = {};
    if (eventId) {
      whereClause.id_evento = eventId;
    }
    if (id_unidade) {
      whereClause.id_unidade = id_unidade;
    }
    if (periodoInicio && periodoFim) {
      whereClause.data_hora = {
        [Op.between]: [
          startOfDay(new Date(periodoInicio)),
          endOfDay(new Date(periodoFim)),
        ],
      };
    } else if (periodoInicio) {
      whereClause.data_hora = {
        [Op.gte]: startOfDay(new Date(periodoInicio)),
      };
    } else if (periodoFim) {
      whereClause.data_hora = {
        [Op.lte]: endOfDay(new Date(periodoFim)),
      };
    }
    // Group by hour and sum valor_total
    const hourFn = this.sequelize.fn(
      'EXTRACT',
      this.sequelize.literal('HOUR FROM data_hora'),
    );
    const results = await this.pedidoModel.findAll({
      attributes: [
        [hourFn, 'hour'],
        [this.sequelize.fn('SUM', this.sequelize.col('valor_total')), 'value'],
      ],
      where: whereClause,
      group: [hourFn],
      order: [[this.sequelize.literal('hour'), 'ASC']],
      raw: true,
    });
    // Map results to correct types
    return (
      results as unknown as { hour: string | number; value: string | number }[]
    ).map((row) => ({
      hour: Number(row.hour),
      value: Number(row.value),
    }));
  }

  async getTicketMedioPorHora(
    eventId?: number,
    id_unidade?: number,
    periodoInicio?: string | Date,
    periodoFim?: string | Date,
  ): Promise<{ hour: number; value: number }[]> {
    const whereClause: Record<string, any> = {};
    if (eventId) {
      whereClause.id_evento = eventId;
    }
    if (id_unidade) {
      whereClause.id_unidade = id_unidade;
    }
    if (periodoInicio && periodoFim) {
      whereClause.data_hora = {
        [Op.between]: [
          startOfDay(new Date(periodoInicio)),
          endOfDay(new Date(periodoFim)),
        ],
      };
    } else if (periodoInicio) {
      whereClause.data_hora = {
        [Op.gte]: startOfDay(new Date(periodoInicio)),
      };
    } else if (periodoFim) {
      whereClause.data_hora = {
        [Op.lte]: endOfDay(new Date(periodoFim)),
      };
    }
    // Group by hour and calculate average ticket (sum(valor_total)/count)
    const hourFn = this.sequelize.fn(
      'EXTRACT',
      this.sequelize.literal('HOUR FROM data_hora'),
    );
    const results = await this.pedidoModel.findAll({
      attributes: [
        [hourFn, 'hour'],
        [this.sequelize.literal('SUM(valor_total) / COUNT(*)'), 'value'],
      ],
      where: whereClause,
      group: [hourFn],
      order: [[this.sequelize.literal('hour'), 'ASC']],
      raw: true,
    });
    // Map results to correct types
    return (
      results as unknown as { hour: string | number; value: string | number }[]
    ).map((row) => ({
      hour: Number(row.hour),
      value: Number(row.value),
    }));
  }
}
