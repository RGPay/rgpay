import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Usuario } from '../auth/usuario.model';
import { Produto } from '../produtos/produto.model';
import { Pedido } from '../pedidos/pedido.model';
import { Maquineta } from '../pedidos/maquineta.model';
import { Evento } from '../pedidos/evento.model';

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

  @HasMany(() => Usuario)
  usuarios: Usuario[];

  @HasMany(() => Produto)
  produtos: Produto[];

  @HasMany(() => Pedido)
  pedidos: Pedido[];

  @HasMany(() => Maquineta)
  maquinetas: Maquineta[];

  @HasMany(() => Evento)
  eventos: Evento[];

  // Relationships (to be filled after all models are created)
}
