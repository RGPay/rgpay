import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Unidade } from '../unidades/unidade.model';

@Table({ tableName: 'eventos' })
export class Evento extends Model<Evento> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_evento',
  })
  declare id_evento: number;

  @Column(DataType.STRING)
  declare nome: string;

  @Column(DataType.STRING)
  declare descricao: string;

  @Column(DataType.DATE)
  declare data_inicio: Date;

  @Column(DataType.DATE)
  declare data_fim: Date;

  @ForeignKey(() => Unidade)
  @Column(DataType.INTEGER)
  declare id_unidade: number;

  @BelongsTo(() => Unidade)
  declare unidade: Unidade;
}
