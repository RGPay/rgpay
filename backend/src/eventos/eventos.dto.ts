import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventoDto {
  @IsString()
  nome: string;

  @IsString()
  descricao: string;

  @IsDate()
  @Type(() => Date)
  data_inicio: Date;

  @IsDate()
  @Type(() => Date)
  data_fim: Date;

  @IsNumber()
  id_unidade: number;
}

export class UpdateEventoDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  data_inicio?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  data_fim?: Date;

  @IsNumber()
  @IsOptional()
  id_unidade?: number;
}

export class EventoFilterDto {
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
  @Type(() => Number)
  id_unidade?: number;
}
