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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ProdutosService } from './produtos.service';
import { Produto } from './produto.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProdutoDto, UpdateProdutoDto } from './produtos.dto';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@Controller('produtos')
@UseGuards(JwtAuthGuard)
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with optional filters' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'disponivel',
    required: false,
    description: 'Filter by availability',
  })
  @ApiQuery({
    name: 'id_unidade',
    required: false,
    description: 'Filter by unit ID',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search term (nome contains, case-insensitive)',
  })
  @ApiResponse({ status: 200, description: 'List of products' })
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('disponivel') disponivel?: string,
    @Query('id_unidade') id_unidade?: string,
    @Query('q') q?: string,
  ): Promise<Produto[]> {
    const filters: Record<string, any> = {};

    if (categoryId !== undefined && categoryId !== '') {
      filters.categoryId = Number(categoryId);
    }

    if (disponivel !== undefined && disponivel !== '') {
      filters.disponivel = disponivel === 'true';
    }

    if (id_unidade !== undefined && id_unidade !== '') {
      filters.id_unidade = Number(id_unidade);
    }

    if (q && q.trim() !== '') {
      filters.q = q.trim();
    }

    return this.produtosService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: number): Promise<Produto> {
    return this.produtosService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiBody({ type: CreateProdutoDto })
  async create(@Body() createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return this.produtosService.create(createProdutoDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiBody({ type: UpdateProdutoDto })
  async update(
    @Param('id') id: number,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    return this.produtosService.update(id, updateProdutoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.produtosService.remove(id);
  }

  @Put(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle product availability status' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product status toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async toggleStatus(@Param('id') id: number): Promise<Produto> {
    return this.produtosService.toggleStatus(id);
  }
}
