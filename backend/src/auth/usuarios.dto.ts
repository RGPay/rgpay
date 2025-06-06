import {
  IsEmail,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsEnum(['master', 'gerente'])
  tipo_usuario: 'master' | 'gerente';

  @IsNumber()
  id_unidade: number;
}

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;

  @IsOptional()
  @IsEnum(['master', 'gerente'])
  tipo_usuario?: 'master' | 'gerente';

  @IsOptional()
  @IsNumber()
  id_unidade?: number;
}
