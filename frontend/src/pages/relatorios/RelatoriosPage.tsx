import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import { startOfMonth } from "date-fns";
import relatoriosService, {
  RelatorioFilter,
  FaturamentoProdutoResponse,
} from "../../services/relatorios.service";
import eventosService, { Evento } from "../../services/eventos.service";
import { Toast } from "../../components";
import ReportFilters from "./ReportFilters";
import ExportButtons from "./ExportButtons";
import ReportTable from "./ReportTable";

const RelatoriosPage: React.FC = () => {
  const [filter, setFilter] = useState<RelatorioFilter>({
    periodoInicio: startOfMonth(new Date()),
    periodoFim: new Date(),
  });
  const [reportData, setReportData] = useState<FaturamentoProdutoResponse | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error" as "success" | "error",
  });

  // Load eventos on mount
  useEffect(() => {
    const loadEventos = async () => {
      try {
        const data = await eventosService.getAll();
        setEventos(data);
      } catch (error) {
        console.error("Error loading eventos:", error);
        setToast({
          open: true,
          message: "Erro ao carregar eventos",
          severity: "error",
        });
      }
    };

    loadEventos();
  }, []);

  // Load report data when filter changes
  useEffect(() => {
    loadReportData();
  }, [filter]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const data = await relatoriosService.getFaturamentoProdutos(filter);
      setReportData(data);
    } catch (error) {
      console.error("Error loading report data:", error);
      setToast({
        open: true,
        message: "Erro ao carregar dados do relatório",
        severity: "error",
      });
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter: RelatorioFilter) => {
    setFilter(newFilter);
  };

  const handleExportCSV = async () => {
    if (!reportData) {
      setToast({
        open: true,
        message: "Nenhum dado para exportar",
        severity: "error",
      });
      return;
    }

    try {
      await relatoriosService.exportToCSV(reportData);
      setToast({
        open: true,
        message: "Relatório exportado com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setToast({
        open: true,
        message: "Erro ao exportar CSV",
        severity: "error",
      });
    }
  };

  const handleExportPDF = async () => {
    if (!reportData) {
      setToast({
        open: true,
        message: "Nenhum dado para exportar",
        severity: "error",
      });
      return;
    }

    try {
      await relatoriosService.exportToPDF(reportData);
      setToast({
        open: true,
        message: "Relatório exportado com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      setToast({
        open: true,
        message: "Erro ao exportar PDF",
        severity: "error",
      });
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, mb: 1 }}
        >
          Relatórios
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Faturamento de Produtos por Grupo
        </Typography>
      </Box>

      <ReportFilters
        filter={filter}
        onFilterChange={handleFilterChange}
        eventos={eventos}
        loading={loading}
      />

      <ExportButtons
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        loading={loading}
        disabled={!reportData || reportData.grupos.length === 0}
      />

      <ReportTable
        data={reportData}
        loading={loading}
        searchTerm={filter.search}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
};

export default RelatoriosPage; 