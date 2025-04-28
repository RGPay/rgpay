import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataTable, ConfirmDialog, Toast } from "../../components";
import {
  pedidosService,
  Pedido,
  PedidosFilter,
} from "../../services/pedidos.service";

const PedidosListPage: React.FC = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PedidosFilter>({});
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

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
  }, [loadPedidos]);

  const handleCreatePedido = () => {
    navigate("/pedidos/novo");
  };

  const handleViewPedido = (pedido: Pedido) => {
    navigate(`/pedidos/detalhes/${pedido.id_pedido}`);
  };

  const handleDeleteConfirm = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setDialogOpen(true);
  };

  const handleDeletePedido = async () => {
    if (!selectedPedido) return;

    try {
      await pedidosService.delete(selectedPedido.id_pedido);
      setToast({
        open: true,
        message: "Pedido excluído com sucesso",
        severity: "success",
      });
      loadPedidos();
    } catch (error) {
      console.error("Error deleting order:", error);
      setToast({
        open: true,
        message: "Erro ao excluir pedido",
        severity: "error",
      });
    } finally {
      setDialogOpen(false);
      setSelectedPedido(null);
    }
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
    {
      icon: <DeleteIcon />,
      tooltip: "Excluir",
      onClick: handleDeleteConfirm,
      color: "error" as const,
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
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreatePedido}
          >
            Novo Pedido
          </Button>
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

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="unidade-filter-label">Unidade</InputLabel>
            <Select
              labelId="unidade-filter-label"
              id="unidade-filter"
              value={filter.id_unidade || ""}
              label="Unidade"
              onChange={(e) =>
                setFilter({
                  ...filter,
                  id_unidade: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value={1}>Unidade 1</MenuItem>
              <MenuItem value={2}>Unidade 2</MenuItem>
            </Select>
          </FormControl>

          <IconButton onClick={loadPedidos} color="primary">
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

        <ConfirmDialog
          open={dialogOpen}
          title="Excluir Pedido"
          message={`Tem certeza que deseja excluir o pedido #${selectedPedido?.id_pedido}? Esta ação não pode ser desfeita.`}
          confirmButtonText="Excluir"
          cancelButtonText="Cancelar"
          confirmButtonColor="error"
          onConfirm={handleDeletePedido}
          onCancel={() => setDialogOpen(false)}
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
