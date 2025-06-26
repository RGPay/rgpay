import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pedido } from '../pedidos/pedido.model';
import { ItemPedido } from '../pedidos/item-pedido.model';
import { Produto } from '../produtos/produto.model';
import { Category } from '../categorias/category.model';
import { Evento } from '../eventos/evento.model';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Pedido,
      ItemPedido,
      Produto,
      Category,
      Evento,
    ]),
  ],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
  exports: [RelatoriosService],
})
export class RelatoriosModule {} 