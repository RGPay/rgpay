import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProdutoDto {
  @ApiProperty({ example: 'Coca-Cola 350ml', description: 'Product name' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 2.5, description: 'Purchase price' })
  @IsNumber()
  preco_compra: number;

  @ApiProperty({ example: 5.0, description: 'Sale price' })
  @IsNumber()
  preco_venda: number;

  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsNumber()
  category_id: number;

  @ApiProperty({ example: true, description: 'Product availability' })
  @IsBoolean()
  disponivel: boolean;

  @ApiProperty({ example: 1, description: 'Unit ID where the product belongs' })
  @IsNumber()
  id_unidade: number;

  @ApiProperty({ example: 100, description: 'Stock quantity' })
  @IsNumber()
  estoque: number;

  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    description: 'Product image (base64)',
    required: false,
  })
  @IsString()
  @IsOptional()
  imagem?: string;
}

export class UpdateProdutoDto {
  @ApiProperty({
    example: 'Coca-Cola 350ml',
    description: 'Product name',
    required: false,
  })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ example: 2.5, description: 'Purchase price', required: false })
  @IsNumber()
  @IsOptional()
  preco_compra?: number;

  @ApiProperty({ example: 5.0, description: 'Sale price', required: false })
  @IsNumber()
  @IsOptional()
  preco_venda?: number;

  @ApiProperty({ example: 1, description: 'Category ID', required: false })
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @ApiProperty({
    example: true,
    description: 'Product availability',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  disponivel?: boolean;

  @ApiProperty({
    example: 1,
    description: 'Unit ID where the product belongs',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id_unidade?: number;

  @ApiProperty({ example: 100, description: 'Stock quantity', required: false })
  @IsNumber()
  @IsOptional()
  estoque?: number;

  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    description: 'Product image (base64)',
    required: false,
  })
  @IsString()
  @IsOptional()
  imagem?: string;
}
