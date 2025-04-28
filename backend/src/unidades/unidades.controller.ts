import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UnidadesService } from './unidades.service';
import { Unidade } from './unidade.model';

@Controller('unidades')
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Get()
  async findAll(): Promise<Unidade[]> {
    return this.unidadesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Unidade> {
    return this.unidadesService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<Unidade>): Promise<Unidade> {
    return this.unidadesService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<Unidade>,
  ): Promise<Unidade> {
    return this.unidadesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.unidadesService.remove(id);
  }
}
