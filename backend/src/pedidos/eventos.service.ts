import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Evento } from './evento.model';
import { CreateEventoDto, UpdateEventoDto } from './eventos.dto';

@Injectable()
export class EventosService {
  constructor(
    @InjectModel(Evento)
    private readonly eventoModel: typeof Evento,
  ) {}

  async findAll(): Promise<Evento[]> {
    return this.eventoModel.findAll();
  }

  async findOne(id: number): Promise<Evento> {
    const evento = await this.eventoModel.findByPk(id);
    if (!evento) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
    return evento;
  }

  async create(createEventoDto: CreateEventoDto): Promise<Evento> {
    return this.eventoModel.create(createEventoDto as any);
  }

  async update(id: number, updateEventoDto: UpdateEventoDto): Promise<Evento> {
    const evento = await this.findOne(id);
    await evento.update(updateEventoDto as any);
    return evento;
  }

  async remove(id: number): Promise<void> {
    const evento = await this.findOne(id);
    await evento.destroy();
  }
} 