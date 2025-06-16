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
import { Pedido } from './pedido.model';

@Table({ tableName: 'maquinetas' })
export class Maquineta extends Model<Maquineta> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_maquineta',
  })
  declare id_maquineta: number;

  @Column(DataType.STRING)
  declare numero_serie: string;

  @Column(DataType.ENUM('ativa', 'inativa'))
  declare status: 'ativa' | 'inativa';

  @ForeignKey(() => Unidade)
  @Column(DataType.INTEGER)
  declare id_unidade: number;

  @BelongsTo(() => Unidade)
  declare unidade: Unidade;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare logo?: string;

  @HasMany(() => Pedido)
  pedidos: Pedido[];
}
