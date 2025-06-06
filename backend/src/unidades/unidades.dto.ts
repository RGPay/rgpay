import { IsString, IsOptional } from 'class-validator';

export class CreateUnidadeDto {
  @IsString()
  nome: string;

  @IsString()
  @IsOptional()
  cnpj?: string;

  @IsString()
  cidade: string;

  @IsString()
  estado: string;

  @IsString()
  endereco: string;
}

export class UpdateUnidadeDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  cnpj?: string;

  @IsString()
  @IsOptional()
  cidade?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  endereco?: string;
}
