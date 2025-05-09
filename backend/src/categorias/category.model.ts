import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Produto } from '../produtos/produto.model';

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

  @HasMany(() => Produto)
  declare produtos: Produto[];
}
