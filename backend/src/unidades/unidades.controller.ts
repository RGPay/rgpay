import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UnidadesService } from './unidades.service';
import { Unidade } from './unidade.model';
import { CreateUnidadeDto, UpdateUnidadeDto } from './unidades.dto';

@ApiTags('Units')
@Controller('unidades')
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all units' })
  @ApiResponse({ status: 200, description: 'List of all units' })
  async findAll(): Promise<Unidade[]> {
    return this.unidadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get unit by ID' })
  @ApiParam({ name: 'id', description: 'Unit ID' })
  @ApiResponse({ status: 200, description: 'Unit found' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async findOne(@Param('id') id: number): Promise<Unidade> {
    return this.unidadesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new unit' })
  @ApiResponse({ status: 201, description: 'Unit created successfully' })
  @ApiBody({ type: CreateUnidadeDto })
  async create(@Body() data: CreateUnidadeDto): Promise<Unidade> {
    return this.unidadesService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update unit' })
  @ApiParam({ name: 'id', description: 'Unit ID' })
  @ApiResponse({ status: 200, description: 'Unit updated successfully' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  @ApiBody({ type: UpdateUnidadeDto })
  async update(
    @Param('id') id: number,
    @Body() data: UpdateUnidadeDto,
  ): Promise<Unidade> {
    return this.unidadesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete unit' })
  @ApiParam({ name: 'id', description: 'Unit ID' })
  @ApiResponse({ status: 200, description: 'Unit deleted successfully' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.unidadesService.remove(id);
  }
}
