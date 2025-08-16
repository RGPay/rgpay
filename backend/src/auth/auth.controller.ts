import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        senha: { type: 'string', example: 'password123' },
        tipo_usuario: {
          type: 'string',
          enum: ['master', 'gerente'],
          example: 'gerente',
        },
        id_unidade: { type: 'number', example: 1 },
      },
      required: ['nome', 'email', 'senha', 'tipo_usuario', 'id_unidade'],
    },
  })
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
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john@example.com' },
        senha: { type: 'string', example: 'password123' },
      },
      required: ['email', 'senha'],
    },
  })
  async login(@Body() dto: { email: string; senha: string }) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: { type: 'string', example: 'uuid-refresh-token' },
      },
      required: ['refresh_token'],
    },
  })
  async refresh(@Body() dto: { refresh_token: string }) {
    if (!dto.refresh_token || typeof dto.refresh_token !== 'string') {
      throw new BadRequestException('Refresh token é obrigatório');
    }
    return this.authService.refreshToken(dto.refresh_token);
  }

  @Post('revoke-refresh-tokens')
  @ApiOperation({ summary: 'Revoke all refresh tokens for a user' })
  @ApiResponse({
    status: 200,
    description: 'Refresh tokens revoked successfully',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
      },
      required: ['userId'],
    },
  })
  async revokeRefreshTokens(@Body() dto: { userId: number }) {
    if (!dto.userId || typeof dto.userId !== 'number') {
      throw new BadRequestException('userId é obrigatório');
    }
    await this.authService.revokeAllRefreshTokensForUser(dto.userId);
    return { success: true };
  }
}
