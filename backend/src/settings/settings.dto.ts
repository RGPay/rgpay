import { IsIn, IsString, IsOptional, Matches } from 'class-validator';

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsIn(['light', 'dark'])
  theme_mode?: 'light' | 'dark';

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Primary color must be a valid hex color',
  })
  primary_color?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Secondary color must be a valid hex color',
  })
  secondary_color?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Success color must be a valid hex color',
  })
  success_color?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Error color must be a valid hex color',
  })
  error_color?: string;
}

export class UserSettingsResponseDto {
  id_setting: number;
  id_usuario: number;
  theme_mode: 'light' | 'dark';
  primary_color: string;
  secondary_color: string;
  success_color: string;
  error_color: string;
}
