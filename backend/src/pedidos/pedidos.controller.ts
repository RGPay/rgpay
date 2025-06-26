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
import { PedidosService } from './pedidos.service';
import { Pedido } from './pedido.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreatePedidoDto,
  UpdatePedidoDto,
  PedidoFilterDto,
} from './pedidos.dto';

@Controller('pedidos')
@UseGuards(JwtAuthGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  async findAll(@Query() filterDto: PedidoFilterDto): Promise<Pedido[]> {
    return this.pedidosService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pedido> {
    return this.pedidosService.findOne(parseInt(id, 10));
  }

  @Post()
  async create(@Body() createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    return this.pedidosService.create(createPedidoDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ): Promise<Pedido> {
    return this.pedidosService.update(parseInt(id, 10), updatePedidoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.pedidosService.remove(parseInt(id, 10));
  }
}
