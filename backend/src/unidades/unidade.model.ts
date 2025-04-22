import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'unidades' })
export class Unidade extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_unidade',
  })
  id_unidade: number;

  @Column(DataType.STRING)
  nome: string;

  @Column(DataType.STRING)
  cnpj: string;

  @Column(DataType.STRING)
  cidade: string;

  @Column(DataType.STRING)
  estado: string;

  @Column(DataType.STRING)
  endereco: string;

  // Relationships (to be filled after all models are created)
}
