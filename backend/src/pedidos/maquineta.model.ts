import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Unidade } from '../unidades/unidade.model';

@Table({ tableName: 'maquinetas' })
export class Maquineta extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_maquineta',
  })
  id_maquineta: number;

  @Column(DataType.STRING)
  numero_serie: string;

  @Column(DataType.ENUM('ativa', 'inativa'))
  status: 'ativa' | 'inativa';

  @ForeignKey(() => Unidade)
  @Column(DataType.INTEGER)
  id_unidade: number;
}
