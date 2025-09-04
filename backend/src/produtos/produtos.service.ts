import { Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Produto } from './produto.model';
import { CreateProdutoDto, UpdateProdutoDto } from './produtos.dto';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectModel(Produto)
    private readonly produtoModel: typeof Produto,
  ) {}

  async findAll(filters: Record<string, any> = {}): Promise<Produto[]> {
    const where: Record<string, any> = {};

    if (typeof filters.categoryId === 'number') {
      where.categoryId = filters.categoryId;
    }

    if (typeof filters.disponivel === 'boolean') {
      where.disponivel = filters.disponivel;
    }

    if (typeof filters.id_unidade === 'number') {
      where.id_unidade = filters.id_unidade;
    }

    if (typeof filters.q === 'string' && filters.q.trim() !== '') {
      where.nome = { [Op.iLike]: `%${filters.q.trim()}%` };
    }

    return this.produtoModel.findAll({
      where,
      include: ['unidade', 'category'],
      order: [['id_produto', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoModel.findByPk(id, {
      include: ['unidade', 'category'],
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return produto;
  }

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const {
      category_id,
      nome,
      preco_compra,
      preco_venda,
      disponivel,
      id_unidade,
      estoque,
    } = createProdutoDto as unknown as Record<string, unknown>;
    let categoryId: number | undefined = undefined;
    if (typeof category_id === 'number') {
      categoryId = category_id;
    } else if (
      typeof (createProdutoDto as { categoryId?: unknown }).categoryId ===
      'number'
    ) {
      categoryId = (createProdutoDto as { categoryId?: number }).categoryId;
    }
    const data = {
      nome: nome as string,
      preco_compra: preco_compra as number,
      preco_venda: preco_venda as number,
      disponivel: disponivel as boolean,
      id_unidade: id_unidade as number,
      categoryId: categoryId as number,
      estoque: typeof estoque === 'number' ? estoque : 0,
      imagem: createProdutoDto.imagem ?? undefined,
    };
    return this.produtoModel.create(data as any);
  }

  async update(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    const produto = await this.findOne(id);

    await produto.update({
      ...updateProdutoDto,
      imagem: updateProdutoDto.imagem,
    });

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
