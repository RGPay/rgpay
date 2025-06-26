import api from "./api";
import { store } from "../store/store";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
      params.id_unidade = selectedUnidade;
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
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'Relatório de Faturamento por Produtos',
      subject: 'Relatório de Vendas',
      author: 'RGPay',
      keywords: 'relatório, faturamento, produtos, vendas',
      creator: 'RGPay Sistema'
    });

    // Add title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Faturamento por Produtos', 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 14, 30);

    // Prepare data for the table
    const tableData: any[] = [];
    
    data.grupos.forEach(grupo => {
      // Add group header
      tableData.push([
        { content: grupo.grupo, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        '',
        '',
        '',
        '',
        '',
        { content: `R$ ${grupo.subtotal.toFixed(2).replace('.', ',')}`, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }
      ]);
      
      // Add products
      grupo.produtos.forEach(produto => {
        tableData.push([
          '',
          produto.produto,
          produto.vendas.toString(),
          produto.qtd.toString(),
          produto.qtd_estorno.toString(),
          `R$ ${produto.unitario.toFixed(2).replace('.', ',')}`,
          `R$ ${produto.total.toFixed(2).replace('.', ',')}`
        ]);
      });
    });

    // Add total row
    tableData.push([
      { content: 'TOTAL GERAL', styles: { fontStyle: 'bold', fillColor: [220, 220, 220] } },
      '',
      '',
      '',
      '',
      '',
      { content: `R$ ${data.total_geral.toFixed(2).replace('.', ',')}`, styles: { fontStyle: 'bold', fillColor: [220, 220, 220] } }
    ]);

    // Create table
    autoTable(doc, {
      head: [['Grupo', 'Produto', 'Vendas', 'QTD', 'QTD Estorno', 'Unitário', 'Total']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 25, halign: 'right' },
        6: { cellWidth: 25, halign: 'right' },
      }
    });

    // Save the PDF
    const fileName = `faturamento-produtos-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }
}

export default new RelatoriosService(); 