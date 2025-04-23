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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario) private usuarioModel: typeof Usuario,
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
    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }
}
