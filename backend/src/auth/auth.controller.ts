import { Controller, Post, Body } from '@nestjs/common';
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
}
