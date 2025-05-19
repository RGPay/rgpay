import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    dto: {
      nome: string;
      email: string;
      senha: string;
      tipo_usuario: 'master' | 'gerente';
      id_unidade: number;
    },
  ) {
    const user = await this.authService.register(dto);
    return { user };
  }

  @Post('login')
  async login(@Body() dto: { email: string; senha: string }) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  async refresh(@Body() dto: { refresh_token: string }) {
    if (!dto.refresh_token || typeof dto.refresh_token !== 'string') {
      throw new BadRequestException('Refresh token é obrigatório');
    }
    return this.authService.refreshToken(dto.refresh_token);
  }

  @Post('revoke-refresh-tokens')
  async revokeRefreshTokens(@Body() dto: { userId: number }) {
    if (!dto.userId || typeof dto.userId !== 'number') {
      throw new BadRequestException('userId é obrigatório');
    }
    await this.authService.revokeAllRefreshTokensForUser(dto.userId);
    return { success: true };
  }
}
