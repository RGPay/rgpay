import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Pedido } from './pedido.model';
import { Produto } from '../produtos/produto.model';

@Table({ tableName: 'itens_pedido' })
export class ItemPedido extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_item_pedido',
  })
  id_item_pedido: number;

  @Column(DataType.INTEGER)
  quantidade: number;

  @Column(DataType.DECIMAL(10, 2))
  preco_unitario: number;

  @ForeignKey(() => Pedido)
  @Column(DataType.INTEGER)
  id_pedido: number;

  @BelongsTo(() => Pedido)
  pedido: Pedido;

  @ForeignKey(() => Produto)
  @Column(DataType.INTEGER)
  id_produto: number;

  @BelongsTo(() => Produto)
  produto: Produto;
}
