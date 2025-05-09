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
import { ProdutosService } from './produtos.service';
import { Produto } from './produto.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProdutoDto, UpdateProdutoDto } from './produtos.dto';

@Controller('produtos')
@UseGuards(JwtAuthGuard)
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Get()
  async findAll(
    @Query('categoryId') categoryId?: number,
    @Query('disponivel') disponivel?: boolean,
    @Query('id_unidade') id_unidade?: number,
  ): Promise<Produto[]> {
    const filters: Record<string, any> = {};

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (disponivel !== undefined) {
      filters.disponivel = disponivel;
    }

    if (id_unidade) {
      filters.id_unidade = id_unidade;
    }

    return this.produtosService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Produto> {
    return this.produtosService.findOne(id);
  }

  @Post()
  async create(@Body() createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return this.produtosService.create(createProdutoDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    return this.produtosService.update(id, updateProdutoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.produtosService.remove(id);
  }

  @Put(':id/toggle-status')
  async toggleStatus(@Param('id') id: number): Promise<Produto> {
    return this.produtosService.toggleStatus(id);
  }
}
