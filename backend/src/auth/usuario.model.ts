import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Unidade } from '../unidades/unidade.model';

@Table({ tableName: 'usuarios' })
export class Usuario extends Model<Usuario> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_usuario',
  })
  declare id_usuario: number;

  @Column(DataType.STRING)
  declare nome: string;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare senha_hash: string;

  @Column(DataType.ENUM('master', 'gerente'))
  declare tipo_usuario: 'master' | 'gerente';

  @ForeignKey(() => Unidade)
  @Column(DataType.INTEGER)
  declare id_unidade: number;

  @BelongsTo(() => Unidade)
  declare unidade: Unidade;
}
