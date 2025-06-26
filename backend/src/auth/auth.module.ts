import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Usuario } from './usuario.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { JwtStrategy } from './jwt.strategy';
import * as dotenv from 'dotenv';
import { RefreshToken } from './refresh-token.model';

dotenv.config();

@Module({
  imports: [
    SequelizeModule.forFeature([Usuario, RefreshToken]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
  ],
  providers: [AuthService, UsuariosService, JwtStrategy],
  controllers: [AuthController, UsuariosController],
  exports: [AuthService],
})
export class AuthModule {}
