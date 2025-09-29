import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    return this.categoryModel.create(dto as any);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryModel.findByPk(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    await category.update(dto);
    return category;
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await category.destroy();
  }
}
