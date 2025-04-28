import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Produto } from './produto.model';
import { CreateProdutoDto, UpdateProdutoDto } from './produtos.dto';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectModel(Produto)
    private readonly produtoModel: typeof Produto,
  ) {}

  async findAll(filters = {}): Promise<Produto[]> {
    return this.produtoModel.findAll({
      where: filters,
      include: ['unidade'],
    });
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoModel.findByPk(id, {
      include: ['unidade'],
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return produto;
  }

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return this.produtoModel.create({
      ...createProdutoDto,
    } as any);
  }

  async update(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    const produto = await this.findOne(id);

    await produto.update(updateProdutoDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const produto = await this.findOne(id);
    await produto.destroy();
  }

  async toggleStatus(id: number): Promise<Produto> {
    const produto = await this.findOne(id);

    await produto.update({
      disponivel: !produto.disponivel,
    });

    return this.findOne(id);
  }
}
