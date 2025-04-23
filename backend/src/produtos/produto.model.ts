import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Unidade } from '../unidades/unidade.model';
import { ItemPedido } from '../pedidos/item-pedido.model';

@Table({ tableName: 'produtos' })
export class Produto extends Model<Produto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_produto',
  })
  declare id_produto: number;

  @Column(DataType.STRING)
  declare nome: string;

  @Column(DataType.DECIMAL(10, 2))
  declare preco: number;

  @Column(DataType.STRING)
  categoria: string;

  @Column(DataType.BOOLEAN)
  disponivel: boolean;

  @ForeignKey(() => Unidade)
  @Column(DataType.INTEGER)
  declare id_unidade: number;

  @BelongsTo(() => Unidade)
  declare unidade: Unidade;

  @HasMany(() => ItemPedido)
  itensPedido: ItemPedido[];
}
