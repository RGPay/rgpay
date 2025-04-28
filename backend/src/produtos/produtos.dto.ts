import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  nome: string;

  @IsNumber()
  preco: number;

  @IsString()
  categoria: string;

  @IsBoolean()
  disponivel: boolean;

  @IsNumber()
  id_unidade: number;
}

export class UpdateProdutoDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsNumber()
  @IsOptional()
  preco?: number;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsBoolean()
  @IsOptional()
  disponivel?: boolean;

  @IsNumber()
  @IsOptional()
  id_unidade?: number;
}
