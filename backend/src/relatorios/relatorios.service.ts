import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pedido } from '../pedidos/pedido.model';
import { ItemPedido } from '../pedidos/item-pedido.model';
import { Produto } from '../produtos/produto.model';
import { Category } from '../categorias/category.model';
import { Evento } from '../eventos/evento.model';
import { fn, col, literal } from 'sequelize';
import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';
import {
  RelatorioFilterDto,
  FaturamentoProdutoResponse,
  FaturamentoProdutoGroup,
  FaturamentoProdutoItem,
} from './relatorios.dto';

@Injectable()
export class RelatoriosService {
  constructor(
    @InjectModel(Pedido)
    private readonly pedidoModel: typeof Pedido,
    @InjectModel(ItemPedido)
    private readonly itemPedidoModel: typeof ItemPedido,
    @InjectModel(Produto)
    private readonly produtoModel: typeof Produto,
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
    @InjectModel(Evento)
    private readonly eventoModel: typeof Evento,
  ) {}

  async getFaturamentoProdutos(
    filters: RelatorioFilterDto = {},
  ): Promise<FaturamentoProdutoResponse> {
    // Build where clause for pedidos
    const whereClause: Record<string, any> = {};

    // Apply unidade filter
    if (filters.id_unidade) {
      whereClause.id_unidade = filters.id_unidade;
    }

    // Apply date filters or event filter (mutually exclusive)
    if (filters.id_evento) {
      // Filter by event - use event's date range
      const evento = await this.eventoModel.findByPk(filters.id_evento);
      if (evento) {
        whereClause.data_hora = {
          [Op.between]: [
            startOfDay(new Date(evento.data_inicio)),
            endOfDay(new Date(evento.data_fim)),
          ],
        };
        whereClause.id_evento = filters.id_evento;
      }
    } else if (filters.periodoInicio && filters.periodoFim) {
      // Filter by date range
      whereClause.data_hora = {
        [Op.between]: [
          startOfDay(new Date(filters.periodoInicio)),
          endOfDay(new Date(filters.periodoFim)),
        ],
      };
    } else if (filters.periodoInicio) {
      whereClause.data_hora = {
        [Op.gte]: startOfDay(new Date(filters.periodoInicio)),
      };
    } else if (filters.periodoFim) {
      whereClause.data_hora = {
        [Op.lte]: endOfDay(new Date(filters.periodoFim)),
      };
    }

    // Build produto where clause for search
    const produtoWhere: Record<string, any> = {};
    if (filters.search) {
      produtoWhere.nome = {
        [Op.like]: `%${filters.search}%`,
      };
    }

    // Query to get aggregated data by product and category
    const results = await this.pedidoModel.findAll({
      attributes: [],
      include: [
        {
          model: this.itemPedidoModel,
          as: 'itensPedido',
          attributes: [
            [fn('COUNT', col('itensPedido.id_item_pedido')), 'vendas'],
            [fn('SUM', col('itensPedido.quantidade')), 'qtd'],
            [fn('AVG', col('itensPedido.preco_unitario')), 'unitario'],
            [
              fn(
                'SUM',
                literal(
                  '\"itensPedido\".\"quantidade\" * \"itensPedido\".\"preco_unitario\"',
                ),
              ),
              'total',
            ],
          ],
          include: [
            {
              model: this.produtoModel,
              as: 'produto',
              attributes: ['nome'],
              where: produtoWhere,
              include: [
                {
                  model: this.categoryModel,
                  as: 'category',
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
      where: whereClause,
      group: [
        col('itensPedido->produto->category.id'),
        col('itensPedido->produto->category.name'),
        col('itensPedido->produto.id_produto'),
        col('itensPedido->produto.nome'),
      ],
      order: [
        [
          { model: this.itemPedidoModel, as: 'itensPedido' },
          { model: this.produtoModel, as: 'produto' },
          { model: this.categoryModel, as: 'category' },
          'name',
          'ASC',
        ],
        [
          { model: this.itemPedidoModel, as: 'itensPedido' },
          { model: this.produtoModel, as: 'produto' },
          'nome',
          'ASC',
        ],
      ],
      raw: true,
      nest: true,
    });

    // Process results to group by category
    const groupedData = new Map<string, FaturamentoProdutoItem[]>();
    let totalGeral = 0;

    for (const result of results as any[]) {
      const categoryName = result.itensPedido.produto.category.name;
      const productName = result.itensPedido.produto.nome;
      const vendas = Number(result.itensPedido.vendas);
      const qtd = Number(result.itensPedido.qtd);
      const unitario = Number(result.itensPedido.unitario);
      const total = Number(result.itensPedido.total);

      const item: FaturamentoProdutoItem = {
        grupo: categoryName,
        produto: productName,
        vendas,
        qtd,
        qtd_estorno: 0, // TODO: Implement returns logic
        unitario,
        total,
      };

      if (!groupedData.has(categoryName)) {
        groupedData.set(categoryName, []);
      }
      groupedData.get(categoryName)!.push(item);
      totalGeral += total;
    }

    // Convert to response format
    const grupos: FaturamentoProdutoGroup[] = [];
    for (const [groupName, items] of groupedData.entries()) {
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      grupos.push({
        grupo: groupName,
        produtos: items,
        subtotal,
      });
    }

    return {
      grupos,
      total_geral: totalGeral,
    };
  }
}
