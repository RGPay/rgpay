import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateMaquinetaDto {
  @IsNotEmpty()
  @IsString()
  numero_serie: string;

  @IsNotEmpty()
  @IsEnum(['ativa', 'inativa'])
  status: 'ativa' | 'inativa';

  @IsNotEmpty()
  @IsInt()
  id_unidade: number;

  @IsOptional()
  @IsString()
  logo?: string;
}

export class UpdateMaquinetaDto {
  @IsOptional()
  @IsString()
  numero_serie?: string;

  @IsOptional()
  @IsEnum(['ativa', 'inativa'])
  status?: 'ativa' | 'inativa';

  @IsOptional()
  @IsInt()
  id_unidade?: number;

  @IsOptional()
  @IsString()
  logo?: string;
}

export class MaquinetaResponseDto {
  id_maquineta: number;
  numero_serie: string;
  status: 'ativa' | 'inativa';
  id_unidade: number;
  logo?: string;
  unidade?: {
    id_unidade: number;
    nome: string;
    cidade: string;
    estado: string;
  };
  createdAt: Date;
  updatedAt: Date;
} 