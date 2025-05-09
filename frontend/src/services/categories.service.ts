import api from "./api";

export interface Category {
  id: number;
  name: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name?: string;
}

class CategoriesService {
  async getAll(): Promise<Category[]> {
    const response = await api.get("/categories");
    return response.data;
  }

  async getById(id: number): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  }

  async create(category: CreateCategoryDto): Promise<Category> {
    const response = await api.post("/categories", category);
    return response.data;
  }

  async update(id: number, category: UpdateCategoryDto): Promise<Category> {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  }
}

export default new CategoriesService(); 