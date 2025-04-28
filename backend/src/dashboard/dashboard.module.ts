import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pedido } from '../pedidos/pedido.model';
import { ItemPedido } from '../pedidos/item-pedido.model';
import { Unidade } from '../unidades/unidade.model';
import { Produto } from '../produtos/produto.model';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [SequelizeModule.forFeature([Pedido, ItemPedido, Unidade, Produto])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
