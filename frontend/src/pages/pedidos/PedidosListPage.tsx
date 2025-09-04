import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import {
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataTable, Toast } from "../../components";
import {
  pedidosService,
  Pedido,
  PedidosFilter,
} from "../../services/pedidos.service";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const PedidosListPage: React.FC = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PedidosFilter>({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const selectedUnidade = useSelector(
    (state: RootState) => state.unidade.selectedUnidade
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadPedidos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await pedidosService.getAll(filter);
      setPedidos(response);
    } catch (error) {
      console.error("Error loading orders:", error);
      setToast({
        open: true,
        message: "Erro ao carregar pedidos. Tente novamente.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadPedidos();
  }, [loadPedidos, selectedUnidade]);

  // Unidade é controlada globalmente; sem dropdown local

  const handleViewPedido = (pedido: Pedido) => {
    navigate(`/pedidos/detalhes/${pedido.id_pedido}`);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const columns = [
    { id: "id_pedido", label: "ID", minWidth: 50, sortable: true },
    {
      id: "data_hora",
      label: "Data/Hora",
      minWidth: 180,
      sortable: true,
      format: (value: unknown) => formatDate(value as string),
    },
    {
      id: "valor_total",
      label: "Valor Total",
      minWidth: 120,
      align: "right" as const,
      sortable: true,
      format: (value: unknown) => formatCurrency(value as number),
    },
    {
      id: "unidade",
      label: "Unidade",
      minWidth: 120,
      sortable: true,
      format: (value: unknown) => {
        if (value && typeof value === "object" && "nome" in value) {
          return (value as { nome?: string }).nome || "-";
        }
        return "-";
      },
    },
    {
      id: "forma_pagamento",
      label: "Forma de Pagamento",
      minWidth: 120,
      sortable: true,
      format: (value: unknown) => {
        switch (value) {
          case "dinheiro":
            return "Dinheiro";
          case "credito":
            return "Cartão de Crédito";
          case "debito":
            return "Cartão de Débito";
          case "pix":
            return "Pix";
          default:
            return "-";
        }
      },
    },
    {
      id: "itensPedido",
      label: "Qtd. Itens",
      minWidth: 100,
      align: "center" as const,
      format: (value: unknown) => (Array.isArray(value) ? value.length : 0),
    },
  ];

  const actions = [
    {
      icon: <VisibilityIcon />,
      tooltip: "Visualizar",
      onClick: handleViewPedido,
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h1">
            Pedidos
          </Typography>
        </Box>

        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <DatePicker
            label="Data Início"
            value={filter.data_inicio || null}
            onChange={(date) =>
              setFilter({ ...filter, data_inicio: date || undefined })
            }
            slotProps={{ textField: { size: "small" } }}
          />

          <DatePicker
            label="Data Fim"
            value={filter.data_fim || null}
            onChange={(date) =>
              setFilter({ ...filter, data_fim: date || undefined })
            }
            slotProps={{ textField: { size: "small" } }}
          />

          {/* Dropdown de Unidade removido: filtro global controla a unidade */}

          <IconButton
            onClick={() => {
              setFilter({});
              loadPedidos();
            }}
            color="primary"
            title="Resetar filtros"
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        <DataTable
          columns={columns}
          data={pedidos}
          title="Lista de Pedidos"
          keyExtractor={(item) => item.id_pedido}
          actions={actions}
          onRowClick={handleViewPedido}
          isLoading={loading}
          searchable={false}
        />

        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={handleCloseToast}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default PedidosListPage;
