import {
  IsEmail,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  nome: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (min 6 characters)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiProperty({
    enum: ['master', 'gerente'],
    example: 'gerente',
    description: 'User type',
  })
  @IsEnum(['master', 'gerente'])
  tipo_usuario: 'master' | 'gerente';

  @ApiProperty({ example: 1, description: 'Unit ID where the user belongs' })
  @IsNumber()
  id_unidade: number;
}

export class UpdateUsuarioDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    required: false,
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'User password (min 6 characters)',
    minLength: 6,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;

  @ApiProperty({
    enum: ['master', 'gerente'],
    example: 'gerente',
    description: 'User type',
    required: false,
  })
  @IsOptional()
  @IsEnum(['master', 'gerente'])
  tipo_usuario?: 'master' | 'gerente';

  @ApiProperty({
    example: 1,
    description: 'Unit ID where the user belongs',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id_unidade?: number;
}
