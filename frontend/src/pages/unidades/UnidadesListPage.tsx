import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataTable, Toast, ConfirmDialog } from "../../components";
import unidadesService, { Unidade } from "../../services/unidades.service";

const UnidadesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnidade, setSelectedUnidade] = useState<Unidade | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const loadUnidades = async () => {
    setLoading(true);
    try {
      const response = await unidadesService.getAll();
      setUnidades(response);
    } catch (error) {
      console.error("Error loading units:", error);
      setToast({
        open: true,
        message: "Erro ao carregar unidades. Tente novamente.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnidades();
  }, []);

  const handleCreateUnidade = () => {
    navigate("/unidades/nova");
  };

  const handleEditUnidade = (unidade: Unidade) => {
    navigate(`/unidades/editar/${unidade.id_unidade}`);
  };

  const handleDeleteConfirm = (unidade: Unidade) => {
    setSelectedUnidade(unidade);
    setDialogOpen(true);
  };

  const handleDeleteUnidade = async () => {
    if (!selectedUnidade) return;

    try {
      await unidadesService.delete(selectedUnidade.id_unidade);
      setToast({
        open: true,
        message: "Unidade excluída com sucesso",
        severity: "success",
      });
      loadUnidades();
    } catch (error) {
      console.error("Error deleting unit:", error);
      setToast({
        open: true,
        message: "Erro ao excluir unidade",
        severity: "error",
      });
    } finally {
      setDialogOpen(false);
      setSelectedUnidade(null);
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const columns = [
    { id: "id_unidade", label: "ID", minWidth: 50, sortable: true },
    {
      id: "nome",
      label: "Nome",
      minWidth: 200,
      sortable: true,
    },
    {
      id: "endereco",
      label: "Endereço",
      minWidth: 300,
      sortable: false,
    },
    {
      id: "telefone",
      label: "Telefone",
      minWidth: 150,
      sortable: false,
    },
    {
      id: "responsavel",
      label: "Responsável",
      minWidth: 200,
      sortable: true,
    },
  ];

  const actions = [
    {
      icon: <EditIcon />,
      tooltip: "Editar",
      onClick: handleEditUnidade,
    },
    {
      icon: <DeleteIcon />,
      tooltip: "Excluir",
      onClick: handleDeleteConfirm,
      color: "error" as const,
    },
  ];

  return (
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
          Unidades
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateUnidade}
        >
          Nova Unidade
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <DataTable
        columns={columns}
        data={unidades}
        title="Lista de Unidades"
        keyExtractor={(item) => item.id_unidade}
        actions={actions}
        onRowClick={handleEditUnidade}
        isLoading={loading}
        onRefresh={loadUnidades}
      />

      <ConfirmDialog
        open={dialogOpen}
        title="Excluir Unidade"
        message={`Tem certeza que deseja excluir a unidade "${selectedUnidade?.nome}"? Esta ação não poderá ser desfeita.`}
        onConfirm={handleDeleteUnidade}
        onCancel={() => setDialogOpen(false)}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />
    </Box>
  );
};

export default UnidadesListPage;
