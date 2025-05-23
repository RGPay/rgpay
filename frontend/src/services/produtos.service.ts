import api from "./api";
import { store } from "../store/store";

export interface Produto {
  id_produto: number;
  nome: string;
  preco_compra: number;
  preco_venda: number;
  category_id: number;
  category?: { id: number; name: string };
  disponivel: boolean;
  id_unidade: number;
  unidade?: {
    id_unidade: number;
    nome: string;
  };
  estoque: number;
  imagem?: string;
}

export interface CreateProdutoDto {
  nome: string;
  preco_compra: number;
  preco_venda: number;
  category_id: number;
  disponivel: boolean;
  id_unidade: number;
  estoque: number;
  imagem?: string;
}

export interface UpdateProdutoDto {
  nome?: string;
  preco_compra?: number;
  preco_venda?: number;
  category_id?: number;
  disponivel?: boolean;
  id_unidade?: number;
  estoque?: number;
  imagem?: string;
}

export interface ProdutosFilter {
  category_id?: number;
  disponivel?: boolean;
  id_unidade?: number;
}

class ProdutosService {
  async getAll(filters: ProdutosFilter = {}): Promise<Produto[]> {
    const selectedUnidade = store.getState().unidade.selectedUnidade;
    const mergedFilters = {
      ...filters,
      id_unidade: selectedUnidade ? Number(selectedUnidade) : undefined,
    };
    const response = await api.get("/produtos", { params: mergedFilters });
    return response.data;
  }

  async getById(id: number): Promise<Produto> {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  }

  async create(produto: CreateProdutoDto): Promise<Produto> {
    const response = await api.post("/produtos", produto);
    return response.data;
  }

  async update(id: number, produto: UpdateProdutoDto): Promise<Produto> {
    const response = await api.put(`/produtos/${id}`, produto);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`);
  }

  async toggleStatus(id: number): Promise<Produto> {
    const response = await api.put(`/produtos/${id}/toggle-status`);
    return response.data;
  }
}

export default new ProdutosService();

export { default as produtosService } from "./produtos.service";
