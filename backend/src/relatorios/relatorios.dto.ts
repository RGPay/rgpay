import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class RelatorioFilterDto {
  @IsString()
  @IsOptional()
  periodoInicio?: string;

  @IsString()
  @IsOptional()
  periodoFim?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id_evento?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id_unidade?: number;

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