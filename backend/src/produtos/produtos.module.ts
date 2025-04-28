import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Produto } from './produto.model';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';

@Module({
  imports: [SequelizeModule.forFeature([Produto])],
  controllers: [ProdutosController],
  providers: [ProdutosService],
  exports: [ProdutosService],
})
export class ProdutosModule {}
