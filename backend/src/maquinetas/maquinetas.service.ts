import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Maquineta } from '../pedidos/maquineta.model';
import { Unidade } from '../unidades/unidade.model';
import { CreateMaquinetaDto, UpdateMaquinetaDto, MaquinetaResponseDto } from './maquinetas.dto';

@Injectable()
export class MaquinetasService {
  constructor(
    @InjectModel(Maquineta)
    private maquinetaModel: typeof Maquineta,
  ) {}

  async create(createMaquinetaDto: CreateMaquinetaDto): Promise<MaquinetaResponseDto> {
    const maquineta = await this.maquinetaModel.create({
      numero_serie: createMaquinetaDto.numero_serie,
      status: createMaquinetaDto.status,
      id_unidade: createMaquinetaDto.id_unidade,
    } as any);
    return this.formatMaquinetaResponse(await this.findByIdWithUnidade(maquineta.id_maquineta));
  }

  async findAll(id_unidade?: number): Promise<MaquinetaResponseDto[]> {
    const whereClause = id_unidade ? { id_unidade } : {};
    
    const maquinetas = await this.maquinetaModel.findAll({
      where: whereClause,
      include: [
        {
          model: Unidade,
          attributes: ['id_unidade', 'nome', 'cidade', 'estado'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return maquinetas.map(maquineta => this.formatMaquinetaResponse(maquineta));
  }

  async findOne(id: number): Promise<MaquinetaResponseDto> {
    const maquineta = await this.findByIdWithUnidade(id);
    return this.formatMaquinetaResponse(maquineta);
  }

  async update(id: number, updateMaquinetaDto: UpdateMaquinetaDto): Promise<MaquinetaResponseDto> {
    const maquineta = await this.maquinetaModel.findByPk(id);
    if (!maquineta) {
      throw new NotFoundException(`Maquineta com ID ${id} não encontrada`);
    }

    await maquineta.update(updateMaquinetaDto);
    return this.formatMaquinetaResponse(await this.findByIdWithUnidade(id));
  }

  async remove(id: number): Promise<void> {
    const maquineta = await this.maquinetaModel.findByPk(id);
    if (!maquineta) {
      throw new NotFoundException(`Maquineta com ID ${id} não encontrada`);
    }

    await maquineta.destroy();
  }

  private async findByIdWithUnidade(id: number): Promise<Maquineta> {
    const maquineta = await this.maquinetaModel.findByPk(id, {
      include: [
        {
          model: Unidade,
          attributes: ['id_unidade', 'nome', 'cidade', 'estado'],
        },
      ],
    });

    if (!maquineta) {
      throw new NotFoundException(`Maquineta com ID ${id} não encontrada`);
    }

    return maquineta;
  }

  private formatMaquinetaResponse(maquineta: Maquineta): MaquinetaResponseDto {
    return {
      id_maquineta: maquineta.id_maquineta,
      numero_serie: maquineta.numero_serie,
      status: maquineta.status,
      id_unidade: maquineta.id_unidade,
      unidade: maquineta.unidade ? {
        id_unidade: maquineta.unidade.id_unidade,
        nome: maquineta.unidade.nome,
        cidade: maquineta.unidade.cidade,
        estado: maquineta.unidade.estado,
      } : undefined,
      createdAt: maquineta.createdAt,
      updatedAt: maquineta.updatedAt,
    };
  }
} 