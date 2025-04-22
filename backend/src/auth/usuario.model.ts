import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Unidade } from '../unidades/unidade.model';

@Table({ tableName: 'usuarios' })
export class Usuario extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_usuario',
  })
  id_usuario: number;

  @Column(DataType.STRING)
  nome: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  senha_hash: string;

  @Column(DataType.ENUM('master', 'gerente'))
  tipo_usuario: 'master' | 'gerente';

  @ForeignKey(() => Unidade)
  @Column(DataType.INTEGER)
  id_unidade: number;
}
