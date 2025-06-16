import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Usuario } from '../auth/usuario.model';

@Table({ tableName: 'user_settings' })
export class UserSettings extends Model<UserSettings> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_setting',
  })
  declare id_setting: number;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  declare id_usuario: number;

  @Column({
    type: DataType.ENUM('light', 'dark'),
    allowNull: false,
    defaultValue: 'dark',
  })
  declare theme_mode: 'light' | 'dark';

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '#3070FF',
  })
  declare primary_color: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '#00E5E0',
  })
  declare secondary_color: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '#00D97E',
  })
  declare success_color: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '#f44336',
  })
  declare error_color: string;

  @BelongsTo(() => Usuario)
  declare usuario: Usuario;
}
