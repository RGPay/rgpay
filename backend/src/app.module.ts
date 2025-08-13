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
import { HealthController } from './health.controller';

dotenv.config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
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
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
