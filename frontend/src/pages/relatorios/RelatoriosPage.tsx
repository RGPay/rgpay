import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import { startOfMonth } from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
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
  const selectedUnidade = useSelector(
    (state: RootState) => state.unidade.selectedUnidade
  );

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
  // Separate state for search term to allow local typing without triggering API calls
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use ref to track if we're currently debouncing to avoid conflicts
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load eventos when selectedUnidade changes
  useEffect(() => {
    const loadEventos = async () => {
      try {
        const data = await eventosService.getAll();
        setEventos(data);
        
        // Clear event filter if the current selected event is not available for the new unit
        if (filter.id_evento && selectedUnidade) {
          const eventBelongsToUnit = data.some(evento => 
            evento.id_evento === filter.id_evento && 
            evento.id_unidade === Number(selectedUnidade)
          );
          if (!eventBelongsToUnit) {
            setFilter(prevFilter => ({
              ...prevFilter,
              id_evento: undefined,
            }));
          }
        }
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
  }, [selectedUnidade, filter.id_evento]);

  // Debounced effect for search term - only update filter after user stops typing
  useEffect(() => {
    // Clear any existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      setFilter(prevFilter => ({
        ...prevFilter,
        search: searchTerm || undefined,
      }));
      debounceRef.current = null;
    }, 500); // 500ms delay

    // Cleanup function
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [searchTerm]);

  // Load report data when filter changes or selectedUnidade changes
  useEffect(() => {
    loadReportData();
  }, [filter.periodoInicio, filter.periodoFim, filter.id_evento, filter.search, selectedUnidade]);

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
    // Clear any pending debounced search to avoid conflicts
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    
    // Update filter immediately
    setFilter(newFilter);
    
    // Always sync the search term with the filter's search value
    // This ensures the UI stays in sync when the filter is changed externally
    setSearchTerm(newFilter.search || "");
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
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
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
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