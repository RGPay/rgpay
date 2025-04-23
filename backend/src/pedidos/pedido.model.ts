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
import { Maquineta } from './maquineta.model';
import { ItemPedido } from './item-pedido.model';

@Table({ tableName: 'pedidos' })
export class Pedido extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_pedido',
  })
  id_pedido?: number;

  @Column(DataType.DATE)
  data_hora: Date;

  @Column(DataType.DECIMAL(10, 2))
  valor_total: number;

  @ForeignKey(() => Maquineta)
  @Column(DataType.INTEGER)
  id_maquineta: number;

  @BelongsTo(() => Maquineta)
  maquineta: Maquineta;

  @ForeignKey(() => Unidade)
  @Column(DataType.INTEGER)
  id_unidade: number;

  @BelongsTo(() => Unidade)
  unidade: Unidade;

  @HasMany(() => ItemPedido)
  itensPedido: ItemPedido[];
}
