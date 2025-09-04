import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Usuario } from '../auth/usuario.model';
import { Produto } from '../produtos/produto.model';
import { Pedido } from '../pedidos/pedido.model';
import { Maquineta } from '../pedidos/maquineta.model';
import { Evento } from '../eventos/evento.model';

@Table({ tableName: 'unidades' })
export class Unidade extends Model<Unidade> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_unidade',
  })
  declare id_unidade: number;

  @Column(DataType.STRING)
  declare nome: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare cnpj?: string;

  @Column({
    type: DataType.ENUM('casa_show', 'bar', 'restaurante'),
    allowNull: false,
    defaultValue: 'bar',
  })
  declare tipo: 'casa_show' | 'bar' | 'restaurante';

  @Column(DataType.STRING)
  declare cidade: string;

  @Column(DataType.STRING)
  declare estado: string;

  @Column(DataType.STRING)
  declare endereco: string;

  @HasMany(() => Usuario)
  declare usuarios: Usuario[];

  @HasMany(() => Produto)
  declare produtos: Produto[];

  @HasMany(() => Pedido)
  declare pedidos: Pedido[];

  @HasMany(() => Maquineta)
  declare maquinetas: Maquineta[];

  @HasMany(() => Evento)
  declare eventos: Evento[];

  // Relationships (to be filled after all models are created)
}
