import React, { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import DataTable from "../../components/DataTable/DataTable";
import CategoriesService, { Category } from "../../services/categories.service";
import Toast from "../../components/Feedback/Toast";
import ConfirmDialog from "../../components/Feedback/ConfirmDialog";
import MainLayout from "../../components/Layout/MainLayout";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Nome", flex: 1 },
  {
    field: "actions",
    headerName: "Ações",
    width: 180,
    renderCell: (params: any) => params.value,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
];

const CategoriesListPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await CategoriesService.getAll();
      setCategories(data);
    } catch (err) {
      setError("Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/categories/${id}/edit`);
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    try {
      await CategoriesService.delete(deleteId);
      setSuccess("Categoria excluída com sucesso.");
      fetchCategories();
    } catch {
      setError("Erro ao excluir categoria.");
    } finally {
      setDeleteId(null);
    }
  };

  const rows = categories.map((cat) => ({
    ...cat,
    actions: (
      <Box display="flex" gap={1}>
        <Button variant="outlined" size="small" onClick={() => handleEdit(cat.id)}>
          Editar
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => setDeleteId(cat.id)}
        >
          Excluir
        </Button>
      </Box>
    ),
  }));

  return (
    <MainLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Categorias</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/categories/new")}>Nova Categoria</Button>
      </Box>
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
      />
      <Toast open={!!error} severity="error" message={error || ""} onClose={() => setError(null)} />
      <Toast open={!!success} severity="success" message={success || ""} onClose={() => setSuccess(null)} />
      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir Categoria"
        content="Tem certeza que deseja excluir esta categoria?"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </MainLayout>
  );
};

export default CategoriesListPage; 