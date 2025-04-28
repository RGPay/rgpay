import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pedido } from './pedido.model';
import { ItemPedido } from './item-pedido.model';
import { Maquineta } from './maquineta.model';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { ProdutosModule } from '../produtos/produtos.module';
import { Produto } from '../produtos/produto.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Pedido, ItemPedido, Maquineta, Produto]),
    ProdutosModule,
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService],
})
export class PedidosModule {}
