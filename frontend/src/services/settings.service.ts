import api from "./api";

export interface UserSettings {
  id_setting: number;
  id_usuario: number;
  theme_mode: "light" | "dark";
  primary_color: string;
  secondary_color: string;
  success_color: string;
  error_color: string;
}

export interface UpdateUserSettingsDto {
  theme_mode?: "light" | "dark";
  primary_color?: string;
  secondary_color?: string;
  success_color?: string;
  error_color?: string;
}

class SettingsService {
  async getUserSettings(): Promise<UserSettings> {
    const response = await api.get("/settings");
    return response.data;
  }

  async updateUserSettings(
    settings: UpdateUserSettingsDto
  ): Promise<UserSettings> {
    const response = await api.put("/settings", settings);
    return response.data;
  }

  async resetUserSettings(): Promise<UserSettings> {
    const response = await api.post("/settings/reset");
    return response.data;
  }
}

export default new SettingsService();
