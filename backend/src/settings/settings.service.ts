import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserSettings } from './user-settings.model';
import { UpdateUserSettingsDto, UserSettingsResponseDto } from './settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(UserSettings)
    private userSettingsModel: typeof UserSettings,
  ) {}

  async getUserSettings(userId: number): Promise<UserSettingsResponseDto> {
    let settings = await this.userSettingsModel.findOne({
      where: { id_usuario: userId },
    });

    // If user doesn't have settings, create default ones
    if (!settings) {
      settings = await this.userSettingsModel.create({
        id_usuario: userId,
        theme_mode: 'dark',
        primary_color: '#3070FF',
        secondary_color: '#00E5E0',
        success_color: '#00D97E',
        error_color: '#f44336',
      } as any);
    }

    return {
      id_setting: settings.id_setting,
      id_usuario: settings.id_usuario,
      theme_mode: settings.theme_mode,
      primary_color: settings.primary_color,
      secondary_color: settings.secondary_color,
      success_color: settings.success_color,
      error_color: settings.error_color,
    };
  }

  async updateUserSettings(
    userId: number,
    updateDto: UpdateUserSettingsDto,
  ): Promise<UserSettingsResponseDto> {
    let settings = await this.userSettingsModel.findOne({
      where: { id_usuario: userId },
    });

    if (!settings) {
      // Create default settings first
      settings = await this.userSettingsModel.create({
        id_usuario: userId,
        theme_mode: 'dark',
        primary_color: '#3070FF',
        secondary_color: '#00E5E0',
        success_color: '#00D97E',
        error_color: '#f44336',
      } as any);
    }

    // Update settings
    await settings.update(updateDto);
    await settings.reload();

    return {
      id_setting: settings.id_setting,
      id_usuario: settings.id_usuario,
      theme_mode: settings.theme_mode,
      primary_color: settings.primary_color,
      secondary_color: settings.secondary_color,
      success_color: settings.success_color,
      error_color: settings.error_color,
    };
  }

  async resetUserSettings(userId: number): Promise<UserSettingsResponseDto> {
    const defaultSettings = {
      theme_mode: 'dark' as const,
      primary_color: '#3070FF',
      secondary_color: '#00E5E0',
      success_color: '#00D97E',
      error_color: '#f44336',
    };

    let settings = await this.userSettingsModel.findOne({
      where: { id_usuario: userId },
    });

    if (!settings) {
      settings = await this.userSettingsModel.create({
        id_usuario: userId,
        ...defaultSettings,
      } as any);
    } else {
      await settings.update(defaultSettings);
      await settings.reload();
    }

    return {
      id_setting: settings.id_setting,
      id_usuario: settings.id_usuario,
      theme_mode: settings.theme_mode,
      primary_color: settings.primary_color,
      secondary_color: settings.secondary_color,
      success_color: settings.success_color,
      error_color: settings.error_color,
    };
  }
}
