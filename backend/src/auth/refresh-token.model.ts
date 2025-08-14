import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Usuario } from './usuario.model';

@Table({ tableName: 'refresh_tokens' })
export class RefreshToken extends Model<RefreshToken> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_refresh_token',
  })
  declare id_refresh_token: number;

  @ForeignKey(() => Usuario)
  @Column(DataType.INTEGER)
  declare id_usuario: number;

  @BelongsTo(() => Usuario)
  declare usuario: Usuario;

  @Column(DataType.STRING)
  declare token: string;

  @Column(DataType.DATE)
  declare expires_at: Date;
}
