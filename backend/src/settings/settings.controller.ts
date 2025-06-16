import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserSettingsDto, UserSettingsResponseDto } from './settings.dto';

interface AuthenticatedRequest {
  user: {
    userId: number;
    email: string;
    tipo_usuario: 'master' | 'gerente';
    id_unidade: number;
  };
}

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getUserSettings(
    @Request() req: AuthenticatedRequest,
  ): Promise<UserSettingsResponseDto> {
    return await this.settingsService.getUserSettings(req.user.userId);
  }

  @Put()
  async updateUserSettings(
    @Request() req: AuthenticatedRequest,
    @Body() updateDto: UpdateUserSettingsDto,
  ): Promise<UserSettingsResponseDto> {
    return await this.settingsService.updateUserSettings(
      req.user.userId,
      updateDto,
    );
  }

  @Post('reset')
  async resetUserSettings(
    @Request() req: AuthenticatedRequest,
  ): Promise<UserSettingsResponseDto> {
    return await this.settingsService.resetUserSettings(req.user.userId);
  }
}
