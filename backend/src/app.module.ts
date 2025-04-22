import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProdutosModule } from './produtos/produtos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { UnidadesModule } from './unidades/unidades.module';

@Module({
  imports: [AuthModule, ProdutosModule, PedidosModule, UnidadesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
