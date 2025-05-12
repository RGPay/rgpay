import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  nome: string;

  @IsNumber()
  preco: number;

  @IsNumber()
  categoryId: number;

  @IsBoolean()
  disponivel: boolean;

  @IsNumber()
  id_unidade: number;

  @IsNumber()
  estoque: number;
}

export class UpdateProdutoDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsNumber()
  @IsOptional()
  preco?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsBoolean()
  @IsOptional()
  disponivel?: boolean;

  @IsNumber()
  @IsOptional()
  id_unidade?: number;

  @IsNumber()
  @IsOptional()
  estoque?: number;
}
