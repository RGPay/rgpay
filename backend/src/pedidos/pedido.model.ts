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
import { Evento } from './evento.model';

@Table({ tableName: 'pedidos' })
export class Pedido extends Model<Pedido> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_pedido',
  })
  declare id_pedido: number;

  @Column(DataType.DATE)
  declare data_hora: Date;

  @Column(DataType.DECIMAL(10, 2))
  declare valor_total: number;

  @ForeignKey(() => Maquineta)
  @Column(DataType.INTEGER)
  declare id_maquineta: number;

  @BelongsTo(() => Maquineta)
  declare maquineta: Maquineta;

  @ForeignKey(() => Unidade)
  @Column(DataType.INTEGER)
  declare id_unidade: number;

  @BelongsTo(() => Unidade)
  declare unidade: Unidade;

  @HasMany(() => ItemPedido)
  declare itensPedido: ItemPedido[];

  @ForeignKey(() => Evento)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare id_evento: number | null;

  @BelongsTo(() => Evento)
  declare evento: Evento;

  @Column({
    type: DataType.ENUM('dinheiro', 'credito', 'debito', 'pix'),
    allowNull: false,
    field: 'forma_pagamento',
  })
  declare forma_pagamento: 'dinheiro' | 'credito' | 'debito' | 'pix';
}
