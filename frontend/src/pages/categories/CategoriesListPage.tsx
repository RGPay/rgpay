import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataTable, ConfirmDialog, Toast } from "../../components";
import CategoriesService, { Category } from "../../services/categories.service";

const CategoriesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await CategoriesService.getAll();
      setCategories(data);
    } catch (error) {
      setToast({
        open: true,
        message: "Erro ao carregar categorias.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = () => {
    navigate("/categories/new");
  };

  const handleEditCategory = (category: Category) => {
    navigate(`/categories/${category.id}/edit`);
  };

  const handleDeleteConfirm = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await CategoriesService.delete(selectedCategory.id);
      setToast({
        open: true,
        message: "Categoria excluída com sucesso.",
        severity: "success",
      });
      loadCategories();
    } catch (error) {
      setToast({
        open: true,
        message: "Erro ao excluir categoria.",
        severity: "error",
      });
    } finally {
      setDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const columns = [
    { id: "id", label: "ID", minWidth: 50, sortable: true },
    { id: "name", label: "Nome", minWidth: 180, sortable: true },
  ];

  const actions = [
    {
      icon: <EditIcon />,
      tooltip: "Editar",
      onClick: handleEditCategory,
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
          Categorias
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateCategory}
        >
          Nova Categoria
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Buscar categorias..."
          variant="outlined"
          size="small"
          sx={{ minWidth: 300 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EditIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") loadCategories();
          }}
        />
        <IconButton onClick={loadCategories} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      <DataTable
        columns={columns}
        data={categories}
        title="Lista de Categorias"
        keyExtractor={(item) => item.id}
        actions={actions}
        isLoading={loading}
        searchable={false}
      />

      <ConfirmDialog
        open={dialogOpen}
        title="Excluir Categoria"
        message={`Tem certeza que deseja excluir a categoria "${selectedCategory?.name}"? Esta ação não pode ser desfeita.`}
        confirmButtonText="Excluir"
        cancelButtonText="Cancelar"
        confirmButtonColor="error"
        onConfirm={handleDeleteCategory}
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

export default CategoriesListPage;
