import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RelatorioFilterDto {
  @ApiProperty({ 
    example: '2024-01-01', 
    description: 'Report start date (YYYY-MM-DD)',
    required: false
  })
  @IsString()
  @IsOptional()
  periodoInicio?: string;

  @ApiProperty({ 
    example: '2024-12-31', 
    description: 'Report end date (YYYY-MM-DD)',
    required: false
  })
  @IsString()
  @IsOptional()
  periodoFim?: string;

  @ApiProperty({ 
    example: 1, 
    description: 'Filter by event ID',
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id_evento?: number;

  @ApiProperty({ 
    example: 1, 
    description: 'Filter by unit ID',
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id_unidade?: number;

  @ApiProperty({ 
    example: 'coca', 
    description: 'Search term for products or categories',
    required: false
  })
  @IsString()
  @IsOptional()
  search?: string;
}

export interface FaturamentoProdutoItem {
  grupo: string;
  produto: string;
  vendas: number;
  qtd: number;
  qtd_estorno: number;
  unitario: number;
  total: number;
}

export interface FaturamentoProdutoGroup {
  grupo: string;
  produtos: FaturamentoProdutoItem[];
  subtotal: number;
}

export interface FaturamentoProdutoResponse {
  grupos: FaturamentoProdutoGroup[];
  total_geral: number;
}
