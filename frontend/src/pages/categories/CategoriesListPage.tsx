import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
  TableRow,
  TableCell,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { ConfirmDialog, Toast } from "../../components";
import CategoriesService, { Category } from "../../services/categories.service";
import DataTable from "../../components/DataTable/DataTable";

const CategoriesListPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [adding, setAdding] = useState(false);
  const [addValue, setAddValue] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const addInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await CategoriesService.getAll();
      setCategories(data);
    } catch {
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

  useEffect(() => {
    if (adding && addInputRef.current) {
      addInputRef.current.focus();
    }
  }, [adding]);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleCreateCategory = () => {
    setAdding(true);
    setAddValue("");
    setEditingId(null);
  };

  const handleAddSave = async () => {
    const value = addValue.trim();
    if (!value) {
      setAdding(false);
      setAddValue("");
      return;
    }
    try {
      await CategoriesService.create({ name: value });
      setToast({
        open: true,
        message: "Categoria criada com sucesso.",
        severity: "success",
      });
      setAdding(false);
      setAddValue("");
      loadCategories();
    } catch {
      setToast({
        open: true,
        message: "Erro ao criar categoria.",
        severity: "error",
      });
    }
  };

  const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddSave();
    } else if (e.key === "Escape") {
      setAdding(false);
      setAddValue("");
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingId(category.id);
    setEditValue(category.name);
    setAdding(false);
  };

  const handleEditSave = async () => {
    if (editingId === null) return;
    const value = editValue.trim();
    if (!value) {
      setEditingId(null);
      setEditValue("");
      return;
    }
    try {
      await CategoriesService.update(editingId, { name: value });
      setToast({
        open: true,
        message: "Categoria atualizada com sucesso.",
        severity: "success",
      });
      setEditingId(null);
      setEditValue("");
      loadCategories();
    } catch {
      setToast({
        open: true,
        message: "Erro ao atualizar categoria.",
        severity: "error",
      });
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditValue("");
    }
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
    } catch {
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

  // Define columns for DataTable
  const columns = [
    {
      id: "id",
      label: "ID",
      minWidth: 50,
      sortable: true,
    },
    {
      id: "name",
      label: "Nome",
      minWidth: 180,
      sortable: true,
      format: ((value: unknown, row?: Category) =>
        editingId === row?.id ? (
          <TextField
            inputRef={editInputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleEditKeyDown}
            size="small"
            fullWidth
            autoFocus
          />
        ) : (
          (value as string)
        )) as (value: unknown) => React.ReactNode,
    },
  ];

  // Define actions for DataTable
  const actions = [
    {
      icon: <EditIcon />,
      tooltip: "Editar",
      onClick: handleEditCategory,
      visible: (cat: Category) => editingId !== cat.id,
      color: "primary" as const,
    },
    {
      icon: <DeleteIcon />,
      tooltip: "Excluir",
      onClick: handleDeleteConfirm,
      color: "error" as const,
      visible: (cat: Category) => editingId !== cat.id,
    },
    {
      icon: <SaveIcon />,
      tooltip: "Salvar",
      onClick: handleEditSave,
      color: "primary" as const,
      visible: (cat: Category) => editingId === cat.id,
    },
    {
      icon: <CancelIcon />,
      tooltip: "Cancelar",
      onClick: () => {
        setEditingId(null);
        setEditValue("");
      },
      color: "inherit" as const,
      visible: (cat: Category) => editingId === cat.id,
    },
  ];

  // DataTable expects extraRows as an array
  const extraRows = [];
  if (adding)
    extraRows.push(
      <TableRow key="add-row">
        <TableCell>-</TableCell>
        <TableCell colSpan={columns.length - 1}>
          <TextField
            inputRef={addInputRef}
            value={addValue}
            onChange={(e) => setAddValue(e.target.value)}
            onKeyDown={handleAddKeyDown}
            size="small"
            placeholder="Nome da nova categoria"
            fullWidth
            autoFocus
          />
        </TableCell>
        <TableCell align="right">
          <IconButton
            color="primary"
            onClick={handleAddSave}
            disabled={!addValue.trim()}
          >
            <SaveIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => {
              setAdding(false);
              setAddValue("");
            }}
          >
            <CancelIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );

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
        {!adding && editingId === null && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateCategory}
          >
            Nova Categoria
          </Button>
        )}
      </Box>
      <DataTable
        columns={columns}
        data={categories}
        title={undefined}
        actions={actions}
        keyExtractor={(cat) => cat.id}
        isLoading={loading}
        onRefresh={loadCategories}
        extraRows={extraRows}
        pagination={true}
        searchable={true}
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
