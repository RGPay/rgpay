import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Usuario } from './usuario.model';
import { Unidade } from '../unidades/unidade.model';
import * as bcrypt from 'bcryptjs';
import { CreateUsuarioDto, UpdateUsuarioDto } from './usuarios.dto';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario) private usuarioModel: typeof Usuario) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.findAll({
      include: [{ model: Unidade, attributes: ['id_unidade', 'nome'] }],
      attributes: { exclude: ['senha_hash'] },
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioModel.findByPk(id, {
      include: [{ model: Unidade, attributes: ['id_unidade', 'nome'] }],
      attributes: { exclude: ['senha_hash'] },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { senha, ...userData } = createUsuarioDto;

    // Check if email already exists
    const existingUser = await this.usuarioModel.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash password
    const senha_hash = await bcrypt.hash(senha, 10);

    const usuario = await this.usuarioModel.create({
      nome: userData.nome,
      email: userData.email,
      senha_hash,
      tipo_usuario: userData.tipo_usuario,
      id_unidade: userData.id_unidade,
    } as CreationAttributes<Usuario>);

    return this.findOne(usuario.id_usuario);
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuarioModel.findByPk(id);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { senha, ...updateData } = updateUsuarioDto;

    // If email is being changed, check if it's already in use
    if (updateData.email && updateData.email !== usuario.email) {
      const existingUser = await this.usuarioModel.findOne({
        where: { email: updateData.email },
      });

      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    // Hash new password if provided
    let senha_hash: string | undefined;
    if (senha) {
      senha_hash = await bcrypt.hash(senha, 10);
    }

    await usuario.update({
      ...(updateData.nome && { nome: updateData.nome }),
      ...(updateData.email && { email: updateData.email }),
      ...(updateData.tipo_usuario && { tipo_usuario: updateData.tipo_usuario }),
      ...(updateData.id_unidade && { id_unidade: updateData.id_unidade }),
      ...(senha_hash && { senha_hash }),
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.usuarioModel.findByPk(id);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await usuario.destroy();
  }
}
