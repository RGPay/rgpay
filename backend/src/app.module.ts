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

dotenv.config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
