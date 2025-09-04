import {
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ItemPedidoDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsNumber()
  id_produto: number;

  @ApiProperty({ example: 2, description: 'Quantity' })
  @IsNumber()
  quantidade: number;

  @ApiProperty({ example: 5.0, description: 'Unit price', required: false })
  @IsNumber()
  @IsOptional()
  preco_unitario?: number;
}

export class CreatePedidoDto {
  @ApiProperty({ example: 1, description: 'Unit ID' })
  @IsNumber()
  id_unidade: number;

  @ApiProperty({
    example: 1,
    description: 'Payment terminal ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id_maquineta?: number;

  @ApiProperty({ example: 1, description: 'Event ID', required: false })
  @IsNumber()
  @IsOptional()
  id_evento?: number;

  @ApiProperty({
    enum: ['dinheiro', 'credito', 'debito', 'pix'],
    example: 'pix',
    description: 'Payment method',
  })
  @IsEnum(['dinheiro', 'credito', 'debito', 'pix'])
  forma_pagamento: 'dinheiro' | 'credito' | 'debito' | 'pix';

  @ApiProperty({ type: [ItemPedidoDto], description: 'Order items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens: ItemPedidoDto[];
}

export class UpdatePedidoDto {
  @ApiProperty({ example: 1, description: 'Unit ID', required: false })
  @IsNumber()
  @IsOptional()
  id_unidade?: number;

  @ApiProperty({
    example: 1,
    description: 'Payment terminal ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id_maquineta?: number;

  @ApiProperty({ example: 1, description: 'Event ID', required: false })
  @IsNumber()
  @IsOptional()
  id_evento?: number;

  @ApiProperty({
    enum: ['dinheiro', 'credito', 'debito', 'pix'],
    example: 'pix',
    description: 'Payment method',
    required: false,
  })
  @IsEnum(['dinheiro', 'credito', 'debito', 'pix'])
  @IsOptional()
  forma_pagamento?: 'dinheiro' | 'credito' | 'debito' | 'pix';

  @ApiProperty({
    type: [ItemPedidoDto],
    description: 'Order items',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  @IsOptional()
  itens?: ItemPedidoDto[];
}

export class PedidoFilterDto {
  @ApiProperty({
    example: '2024-01-01',
    description: 'Start date',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  data_inicio?: Date;

  @ApiProperty({
    example: '2024-12-31',
    description: 'End date',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  data_fim?: Date;

  @ApiProperty({ example: 1, description: 'Unit ID filter', required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id_unidade?: number;
}
