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
export class ItemPedido extends Model<ItemPedido> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_item',
  })
  declare id_item: number;

  @ForeignKey(() => Pedido)
  @Column(DataType.INTEGER)
  declare id_pedido: number;

  @ForeignKey(() => Produto)
  @Column(DataType.INTEGER)
  declare id_produto: number;

  @Column(DataType.INTEGER)
  declare quantidade: number;

  @Column(DataType.DECIMAL(10, 2))
  declare preco_unitario: number;

  @BelongsTo(() => Pedido)
  declare pedido: Pedido;

  @BelongsTo(() => Produto)
  declare produto: Produto;
}
