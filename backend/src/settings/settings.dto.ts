import { IsIn, IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSettingsDto {
  @ApiProperty({ 
    enum: ['light', 'dark'],
    example: 'dark', 
    description: 'Theme mode preference',
    required: false
  })
  @IsOptional()
  @IsIn(['light', 'dark'])
  theme_mode?: 'light' | 'dark';

  @ApiProperty({ 
    example: '#1976d2', 
    description: 'Primary color in hex format',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Primary color must be a valid hex color',
  })
  primary_color?: string;

  @ApiProperty({ 
    example: '#dc004e', 
    description: 'Secondary color in hex format',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Secondary color must be a valid hex color',
  })
  secondary_color?: string;

  @ApiProperty({ 
    example: '#4caf50', 
    description: 'Success color in hex format',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Success color must be a valid hex color',
  })
  success_color?: string;

  @ApiProperty({ 
    example: '#f44336', 
    description: 'Error color in hex format',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Error color must be a valid hex color',
  })
  error_color?: string;
}

export class UserSettingsResponseDto {
  @ApiProperty({ example: 1, description: 'Settings ID' })
  id_setting: number;

  @ApiProperty({ example: 1, description: 'User ID' })
  id_usuario: number;

  @ApiProperty({ 
    enum: ['light', 'dark'],
    example: 'dark', 
    description: 'Theme mode preference' 
  })
  theme_mode: 'light' | 'dark';

  @ApiProperty({ example: '#1976d2', description: 'Primary color in hex format' })
  primary_color: string;

  @ApiProperty({ example: '#dc004e', description: 'Secondary color in hex format' })
  secondary_color: string;

  @ApiProperty({ example: '#4caf50', description: 'Success color in hex format' })
  success_color: string;

  @ApiProperty({ example: '#f44336', description: 'Error color in hex format' })
  error_color: string;
}
