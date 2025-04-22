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
export class Evento extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_evento',
  })
  id_evento: number;

  @Column(DataType.STRING)
  nome: string;

  @Column(DataType.STRING)
  descricao: string;

  @Column(DataType.DATE)
  data_inicio: Date;

  @Column(DataType.DATE)
  data_fim: Date;

  @ForeignKey(() => Unidade)
  @Column(DataType.INTEGER)
  id_unidade: number;

  @BelongsTo(() => Unidade)
  unidade: Unidade;
}
