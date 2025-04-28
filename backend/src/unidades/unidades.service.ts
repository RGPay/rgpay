import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Unidade } from './unidade.model';

@Injectable()
export class UnidadesService {
  constructor(
    @InjectModel(Unidade)
    private readonly unidadeModel: typeof Unidade,
  ) {}

  async findAll(): Promise<Unidade[]> {
    return this.unidadeModel.findAll();
  }

  async findOne(id: number): Promise<Unidade> {
    const unidade = await this.unidadeModel.findByPk(id);
    if (!unidade) {
      throw new NotFoundException(`Unidade with id ${id} not found`);
    }
    return unidade;
  }

  async create(data: Partial<Unidade>): Promise<Unidade> {
    return this.unidadeModel.create(data as any);
  }

  async update(id: number, data: Partial<Unidade>): Promise<Unidade> {
    const unidade = await this.findOne(id);
    await unidade.update(data);
    return unidade;
  }

  async remove(id: number): Promise<void> {
    const unidade = await this.findOne(id);
    await unidade.destroy();
  }
}
