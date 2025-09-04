import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnidadeDto {
  @ApiProperty({ example: 'Shopping Center Norte', description: 'Unit name' })
  @IsString()
  nome: string;

  @ApiProperty({
    example: '12.345.678/0001-90',
    description: 'CNPJ (Brazilian company registration)',
    required: false,
  })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @ApiProperty({ example: 'São Paulo', description: 'City' })
  @IsString()
  cidade: string;

  @ApiProperty({
    example: 'bar',
    description: 'Establishment type',
    enum: ['casa_show', 'bar', 'restaurante'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['casa_show', 'bar', 'restaurante'])
  tipo?: 'casa_show' | 'bar' | 'restaurante';

  @ApiProperty({ example: 'SP', description: 'State' })
  @IsString()
  estado: string;

  @ApiProperty({ example: 'Av. Cásper Líbero, 150', description: 'Address' })
  @IsString()
  endereco: string;
}

export class UpdateUnidadeDto {
  @ApiProperty({
    example: 'Shopping Center Norte',
    description: 'Unit name',
    required: false,
  })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({
    example: '12.345.678/0001-90',
    description: 'CNPJ (Brazilian company registration)',
    required: false,
  })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @ApiProperty({ example: 'São Paulo', description: 'City', required: false })
  @IsString()
  @IsOptional()
  cidade?: string;

  @ApiProperty({
    example: 'bar',
    description: 'Establishment type',
    enum: ['casa_show', 'bar', 'restaurante'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['casa_show', 'bar', 'restaurante'])
  tipo?: 'casa_show' | 'bar' | 'restaurante';

  @ApiProperty({ example: 'SP', description: 'State', required: false })
  @IsString()
  @IsOptional()
  estado?: string;

  @ApiProperty({
    example: 'Av. Cásper Líbero, 150',
    description: 'Address',
    required: false,
  })
  @IsString()
  @IsOptional()
  endereco?: string;
}
