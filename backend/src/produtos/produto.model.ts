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
export class Produto extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_produto',
  })
  id_produto: number;

  @Column(DataType.STRING)
  nome: string;

  @Column(DataType.DECIMAL(10, 2))
  preco: number;

  @Column(DataType.STRING)
  categoria: string;

  @Column(DataType.BOOLEAN)
  disponivel: boolean;

  @ForeignKey(() => Unidade)
  @Column(DataType.INTEGER)
  id_unidade: number;

  @BelongsTo(() => Unidade)
  unidade: Unidade;

  @HasMany(() => ItemPedido)
  itensPedido: ItemPedido[];
}
