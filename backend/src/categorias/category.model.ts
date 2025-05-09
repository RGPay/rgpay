import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'categories', timestamps: true })
export class Category extends Model<Category> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;
} 