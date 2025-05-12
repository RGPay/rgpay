import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pedido } from './pedido.model';
import { ItemPedido } from './item-pedido.model';
import { Produto } from '../produtos/produto.model';
import {
  CreatePedidoDto,
  UpdatePedidoDto,
  PedidoFilterDto,
} from './pedidos.dto';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Evento } from '../eventos/evento.model';

@Injectable()
export class PedidosService {
  constructor(
    @InjectModel(Pedido)
    private readonly pedidoModel: typeof Pedido,
    @InjectModel(ItemPedido)
    private readonly itemPedidoModel: typeof ItemPedido,
    @InjectModel(Produto)
    private readonly produtoModel: typeof Produto,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filters: PedidoFilterDto = {}): Promise<Pedido[]> {
    const whereClause: any = {};

    if (filters.id_unidade) {
      whereClause.id_unidade = filters.id_unidade;
    }

    if (filters.data_inicio && filters.data_fim) {
      whereClause.data_hora = {
        [Op.between]: [filters.data_inicio, filters.data_fim],
      };
    } else if (filters.data_inicio) {
      whereClause.data_hora = {
        [Op.gte]: filters.data_inicio,
      };
    } else if (filters.data_fim) {
      whereClause.data_hora = {
        [Op.lte]: filters.data_fim,
      };
    }

    return this.pedidoModel.findAll({
      where: whereClause,
      include: [
        'unidade',
        'maquineta',
        {
          model: this.itemPedidoModel,
          as: 'itensPedido',
          include: ['produto'],
        },
      ],
      order: [['data_hora', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoModel.findByPk(id, {
      include: [
        'unidade',
        'maquineta',
        {
          model: this.itemPedidoModel,
          as: 'itensPedido',
          include: ['produto'],
        },
      ],
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    return pedido;
  }

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    // Use a transaction to ensure data consistency
    const result = await this.sequelize.transaction(async (t) => {
      // Calculate total value based on item prices
      let valorTotal = 0;

      // Fetch product prices and calculate total, and check/update estoque
      for (const item of createPedidoDto.itens) {
        const produto = await this.produtoModel.findByPk(item.id_produto, { transaction: t });
        if (!produto) {
          throw new NotFoundException(
            `Produto com ID ${item.id_produto} não encontrado`,
          );
        }
        if (produto.estoque < item.quantidade) {
          throw new Error(
            `Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.estoque}, solicitado: ${item.quantidade}`
          );
        }
        // Decrement estoque
        await produto.update({ estoque: produto.estoque - item.quantidade }, { transaction: t });
        // Use the price from the product
        item.preco_unitario = produto.preco;
        valorTotal += produto.preco * item.quantidade;
      }

      // Create the order
      const pedidoData: any = {
        data_hora: new Date(),
        valor_total: valorTotal,
        id_unidade: createPedidoDto.id_unidade,
        id_evento: createPedidoDto.id_evento ?? null,
        forma_pagamento: createPedidoDto.forma_pagamento,
      };
      if (typeof createPedidoDto.id_maquineta !== 'undefined') {
        pedidoData.id_maquineta = createPedidoDto.id_maquineta;
      }
      const pedido = await this.pedidoModel.create(pedidoData, {
        transaction: t,
      });

      // Create order items
      for (const item of createPedidoDto.itens) {
        await this.itemPedidoModel.create(
          {
            id_pedido: pedido.id_pedido,
            id_produto: item.id_produto,
            quantidade: item.quantidade,
            preco_unitario: item.preco_unitario ?? 0,
          } as any,
          { transaction: t },
        );
      }

      return pedido;
    });

    // Return complete order with items
    return this.findOne(result.id_pedido);
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);

    // Use a transaction to ensure data consistency
    await this.sequelize.transaction(async (t) => {
      // Update order basic info
      if (
        updatePedidoDto.id_unidade ||
        updatePedidoDto.id_maquineta ||
        updatePedidoDto.id_evento ||
        updatePedidoDto.forma_pagamento
      ) {
        await pedido.update(
          {
            id_unidade: updatePedidoDto.id_unidade || pedido.id_unidade,
            id_maquineta: updatePedidoDto.id_maquineta ?? pedido.id_maquineta,
            id_evento: updatePedidoDto.id_evento ?? pedido.id_evento,
            forma_pagamento:
              updatePedidoDto.forma_pagamento ?? pedido.forma_pagamento,
          },
          { transaction: t },
        );
      }

      // Update items if provided
      if (updatePedidoDto.itens && updatePedidoDto.itens.length > 0) {
        // Delete existing items
        await this.itemPedidoModel.destroy({
          where: { id_pedido: id },
          transaction: t,
        });

        // Calculate new total
        let valorTotal = 0;

        // Create new items
        for (const item of updatePedidoDto.itens) {
          const produto = await this.produtoModel.findByPk(item.id_produto);
          if (!produto) {
            throw new NotFoundException(
              `Produto com ID ${item.id_produto} não encontrado`,
            );
          }

          // Use the price from the product or the provided one
          const precoUnitario = item.preco_unitario || produto.preco;
          valorTotal += precoUnitario * item.quantidade;

          await this.itemPedidoModel.create(
            {
              id_pedido: id,
              id_produto: item.id_produto,
              quantidade: item.quantidade,
              preco_unitario: precoUnitario ?? 0,
            } as any,
            { transaction: t },
          );
        }

        // Update total value
        await pedido.update({ valor_total: valorTotal }, { transaction: t });
      }
    });

    // Return updated order
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);

    // Use a transaction to ensure data consistency
    await this.sequelize.transaction(async (t) => {
      // Delete order items first
      await this.itemPedidoModel.destroy({
        where: { id_pedido: id },
        transaction: t,
      });

      // Delete the order
      await pedido.destroy({ transaction: t });
    });
  }
}
