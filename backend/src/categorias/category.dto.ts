import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ 
    example: 'Bebidas', 
    description: 'Category name' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ 
    example: 'Bebidas', 
    description: 'Category name',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
