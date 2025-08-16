import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProdutosModule } from './produtos/produtos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { UnidadesModule } from './unidades/unidades.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import * as dotenv from 'dotenv';
import { Unidade } from './unidades/unidade.model';
import { Usuario } from './auth/usuario.model';
import { Produto } from './produtos/produto.model';
import { Pedido } from './pedidos/pedido.model';
import { ItemPedido } from './pedidos/item-pedido.model';
import { Maquineta } from './pedidos/maquineta.model';
import { Evento } from './eventos/evento.model';
import { EventosModule } from './eventos/eventos.module';
import { Category } from './categorias/category.model';
import { CategoryModule } from './categorias/category.module';
import { SettingsModule } from './settings/settings.module';
import { UserSettings } from './settings/user-settings.model';
import { MaquinetasModule } from './maquinetas/maquinetas.module';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql';
  dialectOptions: {
    ssl: boolean | { require: boolean; rejectUnauthorized: boolean };
  };
}

interface Config {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
}

const configPath = path.join(__dirname, '../config/config.json');
const config: Config = JSON.parse(
  fs.readFileSync(configPath, 'utf8'),
) as Config;

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...config[(process.env.NODE_ENV || 'development') as keyof Config],
      dialect: 'postgres',
      autoLoadModels: true,
      synchronize: process.env.NODE_ENV !== 'production',
      models: [
        Unidade,
        Usuario,
        Produto,
        Pedido,
        ItemPedido,
        Maquineta,
        Evento,
        Category,
        UserSettings,
      ],
    }),
    AuthModule,
    ProdutosModule,
    PedidosModule,
    UnidadesModule,
    DashboardModule,
    RelatoriosModule,
    EventosModule,
    CategoryModule,
    SettingsModule,
    MaquinetasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
