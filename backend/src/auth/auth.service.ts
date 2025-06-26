import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Usuario } from './usuario.model';
import * as bcrypt from 'bcryptjs';
import { CreationAttributes } from 'sequelize';
import { RefreshToken } from './refresh-token.model';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario) private usuarioModel: typeof Usuario,
    @InjectModel(RefreshToken) private refreshTokenModel: typeof RefreshToken,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Usuario | null> {
    const user = await this.usuarioModel.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.senha_hash))) {
      return user;
    }
    return null;
  }

  async register(dto: {
    nome: string;
    email: string;
    senha: string;
    tipo_usuario: 'master' | 'gerente';
    id_unidade: number;
  }) {
    const exists = await this.usuarioModel.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email já cadastrado');
    const senha_hash = await bcrypt.hash(dto.senha, 10);
    const user = await this.usuarioModel.create({
      nome: dto.nome,
      email: dto.email,
      senha_hash,
      tipo_usuario: dto.tipo_usuario,
      id_unidade: dto.id_unidade,
    } as CreationAttributes<Usuario>);
    return user;
  }

  async login(dto: { email: string; senha: string }) {
    const user = await this.usuarioModel.findOne({
      where: { email: dto.email },
    });
    if (!user || !(await bcrypt.compare(dto.senha, user.senha_hash))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const payload = {
      sub: user.id_usuario,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
      id_unidade: user.id_unidade,
    };
    const access_token = this.jwtService.sign(payload);

    // Generate refresh token
    const refresh_token = uuidv4();
    const expires_at = add(new Date(), { days: 7 }); // 7 days validity
    await this.refreshTokenModel.create({
      id_usuario: user.id_usuario,
      token: refresh_token,
      expires_at,
    } as import('./refresh-token.model').RefreshToken);

    // Return the full user object instead of just the payload
    const userResponse = {
      id_usuario: user.id_usuario,
      nome: user.nome,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
      id_unidade: user.id_unidade,
      sub: user.id_usuario, // JWT subject
      name: user.nome, // alias for nome
    };

    return {
      access_token,
      refresh_token,
      user: userResponse,
    };
  }

  async refreshToken(token: string) {
    const stored = await this.refreshTokenModel.findOne({ where: { token } });
    if (!stored || stored.expires_at < new Date()) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
    const user = await this.usuarioModel.findByPk(stored.id_usuario);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    const payload = {
      sub: user.id_usuario,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
      id_unidade: user.id_unidade,
    };
    const access_token = this.jwtService.sign(payload);
    // Optionally rotate refresh token
    const new_refresh_token = uuidv4();
    const expires_at = add(new Date(), { days: 7 });
    stored.token = new_refresh_token;
    stored.expires_at = expires_at;
    await stored.save();

    // Return the full user object instead of just the payload
    const userResponse = {
      id_usuario: user.id_usuario,
      nome: user.nome,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
      id_unidade: user.id_unidade,
      sub: user.id_usuario, // JWT subject
      name: user.nome, // alias for nome
    };

    return {
      access_token,
      refresh_token: new_refresh_token,
      user: userResponse,
    };
  }

  async revokeAllRefreshTokensForUser(userId: number) {
    await this.refreshTokenModel.destroy({ where: { id_usuario: userId } });
  }
}
