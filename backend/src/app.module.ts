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
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const databaseUrl = process.env.DATABASE_URL || process.env.DB_URL;

const databaseHost = process.env.DB_HOST || (isProduction ? 'db' : 'localhost');
const databasePort = Number(
  process.env.DB_PORT || (isProduction ? 5432 : 55432),
);
const databaseUsername = process.env.DB_USERNAME || process.env.DB_USER || 'rgpay';
const databasePassword = process.env.DB_PASSWORD || process.env.DB_PASS || 'rgpaypwd';
const databaseName = process.env.DB_DATABASE || process.env.DB_NAME || 'rgpay';

const sslEnabled = (() => {
  const url = process.env.DATABASE_URL || process.env.DB_URL || '';
  const urlIndicatesSsl = /sslmode=require/i.test(url);
  return (
    urlIndicatesSsl ||
    process.env.DB_SSL === 'true' ||
    process.env.PGSSLMODE === 'require' ||
    (isProduction && process.env.DB_SSL !== 'false')
  );
})();

const sequelizeDialectOptions = {
  ssl: sslEnabled ? { require: true, rejectUnauthorized: false } : false,
};

// Database connection is configured via environment variables.
// Fallbacks are provided primarily for local development.

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      ...(databaseUrl
        ? { uri: databaseUrl }
        : {
            host: databaseHost,
            port: databasePort,
            username: databaseUsername,
            password: databasePassword,
            database: databaseName,
          }),
      dialectOptions: sequelizeDialectOptions,
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
