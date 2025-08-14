import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MaquinetasController } from './maquinetas.controller';
import { MaquinetasService } from './maquinetas.service';
import { Maquineta } from '../pedidos/maquineta.model';

@Module({
  imports: [SequelizeModule.forFeature([Maquineta])],
  controllers: [MaquinetasController],
  providers: [MaquinetasService],
  exports: [MaquinetasService],
})
export class MaquinetasModule {}
