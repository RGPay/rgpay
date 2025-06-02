import api from "./api";
import { store } from "../store/store";

export interface RelatorioFilter {
  periodoInicio?: Date;
  periodoFim?: Date;
  id_evento?: number;
  id_unidade?: number;
  search?: string;
}

export interface FaturamentoProdutoItem {
  grupo: string;
  produto: string;
  vendas: number;
  qtd: number;
  qtd_estorno: number;
  unitario: number;
  total: number;
}

export interface FaturamentoProdutoGroup {
  grupo: string;
  produtos: FaturamentoProdutoItem[];
  subtotal: number;
}

export interface FaturamentoProdutoResponse {
  grupos: FaturamentoProdutoGroup[];
  total_geral: number;
}

class RelatoriosService {
  async getFaturamentoProdutos(filter: RelatorioFilter = {}): Promise<FaturamentoProdutoResponse> {
    const selectedUnidade = store.getState().unidade.selectedUnidade;
    const params: any = {};

    // Add unidade filter
    if (selectedUnidade) {
      params.id_unidade = Number(selectedUnidade);
    }

    // Add date filters
    if (filter.periodoInicio) {
      params.periodoInicio = filter.periodoInicio.toISOString();
    }
    if (filter.periodoFim) {
      params.periodoFim = filter.periodoFim.toISOString();
    }

    // Add event filter
    if (filter.id_evento) {
      params.id_evento = filter.id_evento;
    }

    // Add search filter
    if (filter.search) {
      params.search = filter.search;
    }

    const response = await api.get("/relatorios/faturamento-produtos", { params });
    return response.data;
  }

  async exportToCSV(data: FaturamentoProdutoResponse): Promise<void> {
    // Create CSV content
    const headers = ['Grupo', 'Produto', 'Vendas', 'QTD', 'QTD Estorno', 'Unitário', 'Total'];
    let csvContent = headers.join(',') + '\n';

    data.grupos.forEach(grupo => {
      grupo.produtos.forEach(produto => {
        const row = [
          produto.grupo,
          produto.produto,
          produto.vendas,
          produto.qtd,
          produto.qtd_estorno,
          produto.unitario.toFixed(2),
          produto.total.toFixed(2)
        ];
        csvContent += row.join(',') + '\n';
      });
      
      // Add subtotal row
      csvContent += `,"SubTotal ${grupo.grupo}",,,,,${grupo.subtotal.toFixed(2)}\n`;
    });

    // Add total row
    csvContent += `,"Total Geral",,,,,${data.total_geral.toFixed(2)}\n`;

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `faturamento-produtos-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async exportToPDF(data: FaturamentoProdutoResponse): Promise<void> {
    // This would require jsPDF - for now, we'll implement a simple solution
    // TODO: Implement proper PDF export with jsPDF
    console.log('PDF export not yet implemented', data);
    alert('Exportação PDF será implementada em breve');
  }
}

export default new RelatoriosService(); 