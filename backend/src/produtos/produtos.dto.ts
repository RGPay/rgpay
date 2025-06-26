import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  nome: string;

  @IsNumber()
  preco_compra: number;

  @IsNumber()
  preco_venda: number;

  @IsNumber()
  category_id: number;

  @IsBoolean()
  disponivel: boolean;

  @IsNumber()
  id_unidade: number;

  @IsNumber()
  estoque: number;

  @IsString()
  @IsOptional()
  imagem?: string;
}

export class UpdateProdutoDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsNumber()
  @IsOptional()
  preco_compra?: number;

  @IsNumber()
  @IsOptional()
  preco_venda?: number;

  @IsNumber()
  @IsOptional()
  category_id?: number;

  @IsBoolean()
  @IsOptional()
  disponivel?: boolean;

  @IsNumber()
  @IsOptional()
  id_unidade?: number;

  @IsNumber()
  @IsOptional()
  estoque?: number;

  @IsString()
  @IsOptional()
  imagem?: string;
}
