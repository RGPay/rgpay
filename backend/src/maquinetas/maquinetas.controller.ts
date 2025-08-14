import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { MaquinetasService } from './maquinetas.service';
import {
  CreateMaquinetaDto,
  UpdateMaquinetaDto,
  MaquinetaResponseDto,
} from './maquinetas.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('maquinetas')
@UseGuards(JwtAuthGuard)
export class MaquinetasController {
  constructor(private readonly maquinetasService: MaquinetasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createMaquinetaDto: CreateMaquinetaDto,
  ): Promise<MaquinetaResponseDto> {
    return this.maquinetasService.create(createMaquinetaDto);
  }

  @Get()
  findAll(
    @Query('id_unidade') id_unidade?: string,
  ): Promise<MaquinetaResponseDto[]> {
    const unidadeId = id_unidade ? parseInt(id_unidade, 10) : undefined;
    return this.maquinetasService.findAll(unidadeId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MaquinetaResponseDto> {
    return this.maquinetasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaquinetaDto: UpdateMaquinetaDto,
  ): Promise<MaquinetaResponseDto> {
    return this.maquinetasService.update(id, updateMaquinetaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.maquinetasService.remove(id);
  }
}
