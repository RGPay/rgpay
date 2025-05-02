import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventosService } from './eventos.service';
import { Evento } from './evento.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEventoDto, UpdateEventoDto } from './eventos.dto';

@Controller('eventos')
@UseGuards(JwtAuthGuard)
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Get()
  async findAll(): Promise<Evento[]> {
    return this.eventosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Evento> {
    return this.eventosService.findOne(parseInt(id, 10));
  }

  @Post()
  async create(@Body() createEventoDto: CreateEventoDto): Promise<Evento> {
    return this.eventosService.create(createEventoDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventoDto: UpdateEventoDto,
  ): Promise<Evento> {
    return this.eventosService.update(parseInt(id, 10), updateEventoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.eventosService.remove(parseInt(id, 10));
  }
} 