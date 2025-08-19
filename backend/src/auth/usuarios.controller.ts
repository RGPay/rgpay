import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.model';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUsuarioDto, UpdateUsuarioDto } from './usuarios.dto';

interface AuthenticatedRequest {
  user: {
    userId: number;
    email: string;
    tipo_usuario: 'master' | 'gerente';
    id_unidade: number;
  };
}

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (Master only)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 403, description: 'Access denied - Master only' })
  async findAll(@Request() req: AuthenticatedRequest): Promise<Usuario[]> {
    // Only master users can manage other users
    if (req.user.tipo_usuario !== 'master') {
      throw new ForbiddenException('Acesso negado');
    }
    return await this.usuariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<Usuario> {
    // Users can see their own profile, or master users can see any profile
    const userId = parseInt(id, 10);
    if (req.user.tipo_usuario !== 'master' && req.user.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }
    return await this.usuariosService.findOne(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user (Master only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 403, description: 'Access denied - Master only' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiBody({ type: CreateUsuarioDto })
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Usuario> {
    // Only master users can create other users
    if (req.user.tipo_usuario !== 'master') {
      throw new ForbiddenException('Acesso negado');
    }
    return await this.usuariosService.create(createUsuarioDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({ type: UpdateUsuarioDto })
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Usuario> {
    const userId = parseInt(id, 10);

    // Users can update their own profile, or master users can update any profile
    if (req.user.tipo_usuario !== 'master' && req.user.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    // Only master users can change user type or unit
    if (
      req.user.tipo_usuario !== 'master' &&
      (updateUsuarioDto.tipo_usuario || updateUsuarioDto.id_unidade)
    ) {
      throw new ForbiddenException(
        'Não é possível alterar tipo de usuário ou unidade',
      );
    }

    return await this.usuariosService.update(userId, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (Master only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Access denied - Master only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    // Only master users can delete other users
    if (req.user.tipo_usuario !== 'master') {
      throw new ForbiddenException('Acesso negado');
    }

    const userId = parseInt(id, 10);

    // Prevent master users from deleting themselves
    if (req.user.userId === userId) {
      throw new BadRequestException('Não é possível excluir sua própria conta');
    }

    return await this.usuariosService.remove(userId);
  }
}
