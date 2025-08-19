import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaquinetaDto {
  @ApiProperty({ 
    example: 'MQR123456789', 
    description: 'Payment terminal serial number' 
  })
  @IsNotEmpty()
  @IsString()
  numero_serie: string;

  @ApiProperty({ 
    enum: ['ativa', 'inativa'],
    example: 'ativa', 
    description: 'Payment terminal status' 
  })
  @IsNotEmpty()
  @IsEnum(['ativa', 'inativa'])
  status: 'ativa' | 'inativa';

  @ApiProperty({ 
    example: 1, 
    description: 'Unit ID where the payment terminal belongs' 
  })
  @IsNotEmpty()
  @IsInt()
  id_unidade: number;

  @ApiProperty({ 
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...', 
    description: 'Payment terminal logo (base64)',
    required: false
  })
  @IsOptional()
  @IsString()
  logo?: string;
}

export class UpdateMaquinetaDto {
  @ApiProperty({ 
    example: 'MQR123456789', 
    description: 'Payment terminal serial number',
    required: false
  })
  @IsOptional()
  @IsString()
  numero_serie?: string;

  @ApiProperty({ 
    enum: ['ativa', 'inativa'],
    example: 'ativa', 
    description: 'Payment terminal status',
    required: false
  })
  @IsOptional()
  @IsEnum(['ativa', 'inativa'])
  status?: 'ativa' | 'inativa';

  @ApiProperty({ 
    example: 1, 
    description: 'Unit ID where the payment terminal belongs',
    required: false
  })
  @IsOptional()
  @IsInt()
  id_unidade?: number;

  @ApiProperty({ 
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...', 
    description: 'Payment terminal logo (base64)',
    required: false
  })
  @IsOptional()
  @IsString()
  logo?: string;
}

export class MaquinetaResponseDto {
  @ApiProperty({ example: 1, description: 'Payment terminal ID' })
  id_maquineta: number;

  @ApiProperty({ example: 'MQR123456789', description: 'Payment terminal serial number' })
  numero_serie: string;

  @ApiProperty({ 
    enum: ['ativa', 'inativa'],
    example: 'ativa', 
    description: 'Payment terminal status' 
  })
  status: 'ativa' | 'inativa';

  @ApiProperty({ example: 1, description: 'Unit ID where the payment terminal belongs' })
  id_unidade: number;

  @ApiProperty({ 
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...', 
    description: 'Payment terminal logo (base64)',
    required: false
  })
  logo?: string;

  @ApiProperty({ 
    description: 'Unit information',
    required: false,
    example: {
      id_unidade: 1,
      nome: 'Shopping Center Norte',
      cidade: 'São Paulo',
      estado: 'SP'
    }
  })
  unidade?: {
    id_unidade: number;
    nome: string;
    cidade: string;
    estado: string;
  };

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update date' })
  updatedAt: Date;
}
