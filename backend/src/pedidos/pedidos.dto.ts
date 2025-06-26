import {
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoDto {
  @IsNumber()
  id_produto: number;

  @IsNumber()
  quantidade: number;

  @IsNumber()
  @IsOptional()
  preco_unitario?: number;
}

export class CreatePedidoDto {
  @IsNumber()
  id_unidade: number;

  @IsNumber()
  @IsOptional()
  id_maquineta?: number;

  @IsNumber()
  @IsOptional()
  id_evento?: number;

  @IsEnum(['dinheiro', 'credito', 'debito', 'pix'])
  forma_pagamento: 'dinheiro' | 'credito' | 'debito' | 'pix';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens: ItemPedidoDto[];
}

export class UpdatePedidoDto {
  @IsNumber()
  @IsOptional()
  id_unidade?: number;

  @IsNumber()
  @IsOptional()
  id_maquineta?: number;

  @IsNumber()
  @IsOptional()
  id_evento?: number;

  @IsEnum(['dinheiro', 'credito', 'debito', 'pix'])
  @IsOptional()
  forma_pagamento?: 'dinheiro' | 'credito' | 'debito' | 'pix';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  @IsOptional()
  itens?: ItemPedidoDto[];
}

export class PedidoFilterDto {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  data_inicio?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  data_fim?: Date;

  @IsNumber()
  @IsOptional()
  id_unidade?: number;
}
