import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProdutosModule } from './produtos/produtos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { UnidadesModule } from './unidades/unidades.module';
import * as dotenv from 'dotenv';

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
    }),
    AuthModule,
    ProdutosModule,
    PedidosModule,
    UnidadesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
