import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventoDto {
  @ApiProperty({ 
    example: 'Festa de Aniversário', 
    description: 'Event name' 
  })
  @IsString()
  nome: string;

  @ApiProperty({ 
    example: 'Celebração de aniversário com música ao vivo', 
    description: 'Event description' 
  })
  @IsString()
  descricao: string;

  @ApiProperty({ 
    example: '2024-12-25T18:00:00.000Z', 
    description: 'Event start date and time' 
  })
  @IsDate()
  @Type(() => Date)
  data_inicio: Date;

  @ApiProperty({ 
    example: '2024-12-25T23:00:00.000Z', 
    description: 'Event end date and time' 
  })
  @IsDate()
  @Type(() => Date)
  data_fim: Date;

  @ApiProperty({ 
    example: 1, 
    description: 'Unit ID where the event takes place' 
  })
  @IsNumber()
  id_unidade: number;
}

export class UpdateEventoDto {
  @ApiProperty({ 
    example: 'Festa de Aniversário', 
    description: 'Event name',
    required: false
  })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ 
    example: 'Celebração de aniversário com música ao vivo', 
    description: 'Event description',
    required: false
  })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ 
    example: '2024-12-25T18:00:00.000Z', 
    description: 'Event start date and time',
    required: false
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  data_inicio?: Date;

  @ApiProperty({ 
    example: '2024-12-25T23:00:00.000Z', 
    description: 'Event end date and time',
    required: false
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  data_fim?: Date;

  @ApiProperty({ 
    example: 1, 
    description: 'Unit ID where the event takes place',
    required: false
  })
  @IsNumber()
  @IsOptional()
  id_unidade?: number;
}

export class EventoFilterDto {
  @ApiProperty({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filter events from this date',
    required: false
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  data_inicio?: Date;

  @ApiProperty({ 
    example: '2024-12-31T23:59:59.000Z', 
    description: 'Filter events until this date',
    required: false
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  data_fim?: Date;

  @ApiProperty({ 
    example: 1, 
    description: 'Filter events by unit ID',
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id_unidade?: number;
}
