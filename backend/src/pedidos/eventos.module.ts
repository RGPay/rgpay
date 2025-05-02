import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Evento } from './evento.model';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';

@Module({
  imports: [SequelizeModule.forFeature([Evento])],
  providers: [EventosService],
  controllers: [EventosController],
  exports: [EventosService],
})
export class EventosModule {} 