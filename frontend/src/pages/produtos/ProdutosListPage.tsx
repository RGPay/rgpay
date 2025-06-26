import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataTable, ConfirmDialog, Toast } from "../../components";
import {
  produtosService,
  Produto,
  ProdutosFilter,
} from "../../services/produtos.service";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import categoriesService, { Category } from "../../services/categories.service";

const ProdutosListPage: React.FC = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProdutosFilter>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const selectedUnidade = useSelector(
    (state: RootState) => state.unidade.selectedUnidade
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const loadProdutos = async () => {
    setLoading(true);
    try {
      const response = await produtosService.getAll(filter);
      setProdutos(response);
    } catch (error) {
      console.error("Error loading products:", error);
      setToast({
        open: true,
        message: "Erro ao carregar produtos. Tente novamente.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProdutos();
  }, [filter, selectedUnidade]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesService.getAll();
        setCategories(categoriesData);
      } catch (error) {
        setCategoriesError("Erro ao carregar categorias");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = () => {
    // In a real app, you might want to search on the server side
    // For now, we'll just filter the products client-side
    loadProdutos();
  };

  const handleCreateProduto = () => {
    navigate("/produtos/novo");
  };

  const handleEditProduto = (produto: Produto) => {
    navigate(`/produtos/editar/${produto.id_produto}`);
  };

  const handleDeleteConfirm = (produto: Produto) => {
    setSelectedProduto(produto);
    setDialogOpen(true);
  };

  const handleDeleteProduto = async () => {
    if (!selectedProduto) return;

    try {
      await produtosService.delete(selectedProduto.id_produto);
      setToast({
        open: true,
        message: "Produto excluído com sucesso",
        severity: "success",
      });
      loadProdutos();
    } catch (error) {
      console.error("Error deleting product:", error);
      setToast({
        open: true,
        message: "Erro ao excluir produto",
        severity: "error",
      });
    } finally {
      setDialogOpen(false);
      setSelectedProduto(null);
    }
  };

  const handleToggleStatus = async (produto: Produto) => {
    try {
      await produtosService.toggleStatus(produto.id_produto);
      setToast({
        open: true,
        message: `Produto ${
          produto.disponivel ? "desativado" : "ativado"
        } com sucesso`,
        severity: "success",
      });
      loadProdutos();
    } catch (error) {
      console.error("Error toggling product status:", error);
      setToast({
        open: true,
        message: "Erro ao alterar status do produto",
        severity: "error",
      });
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const columns = [
    {
      id: "imagem",
      label: "Imagem",
      minWidth: 60,
      align: "center",
      format: (value: string) =>
        value ? (
          <img
            src={value}
            alt="Produto"
            style={{
              width: 40,
              height: 40,
              objectFit: "cover",
              borderRadius: 4,
              border: "1px solid #eee",
            }}
          />
        ) : (
          <span style={{ color: "#bbb" }}>-</span>
        ),
    },
    { id: "id_produto", label: "ID", minWidth: 50, sortable: true },
    { id: "nome", label: "Nome", minWidth: 180, sortable: true },
    {
      id: "category",
      label: "Categoria",
      minWidth: 120,
      sortable: true,
      format: (value: Produto["category"]) => (
        <Chip
          label={value?.name || "-"}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      id: "preco_compra",
      label: "Preço de Compra",
      minWidth: 120,
      align: "right",
      sortable: true,
      format: (value: number) => formatCurrency(value),
    },
    {
      id: "preco_venda",
      label: "Preço de Venda",
      minWidth: 120,
      align: "right",
      sortable: true,
      format: (value: number) => formatCurrency(value),
    },
    {
      id: "estoque",
      label: "Estoque",
      minWidth: 100,
      align: "right",
      sortable: true,
      format: (value: number) => value,
    },
    {
      id: "disponivel",
      label: "Disponível",
      minWidth: 120,
      sortable: true,
      format: (value: boolean) => (
        <Chip
          label={value ? "Sim" : "Não"}
          color={value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      id: "unidade",
      label: "Unidade",
      minWidth: 120,
      sortable: true,
      format: (value: Produto["unidade"]) => value?.nome || "-",
    },
  ];

  const actions = [
    {
      icon: <EditIcon />,
      tooltip: "Editar",
      onClick: handleEditProduto,
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
          Produtos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateProduto}
        >
          Novo Produto
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Buscar produtos..."
          variant="outlined"
          size="small"
          sx={{ minWidth: 300 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
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
            if (e.key === "Enter") handleSearch();
          }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="category-filter-label">Categoria</InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter"
            value={filter.category_id || ""}
            label="Categoria"
            onChange={(e) =>
              setFilter({
                ...filter,
                category_id: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
          >
            <MenuItem value="">Todas</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="disponivel-filter-label">Status</InputLabel>
          <Select
            labelId="disponivel-filter-label"
            id="disponivel-filter"
            value={
              filter.disponivel === undefined
                ? ""
                : filter.disponivel
                ? "true"
                : "false"
            }
            label="Status"
            onChange={(e) => {
              const value = e.target.value;
              setFilter({
                ...filter,
                disponivel: value === "" ? undefined : value === "true",
              });
            }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="true">Disponíveis</MenuItem>
            <MenuItem value="false">Indisponíveis</MenuItem>
          </Select>
        </FormControl>

        <IconButton onClick={loadProdutos} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      <DataTable
        columns={columns}
        data={produtos}
        title="Lista de Produtos"
        keyExtractor={(item) => item.id_produto}
        actions={actions}
        onRowClick={(produto) => handleToggleStatus(produto)}
        isLoading={loading}
        searchable={false}
      />

      <ConfirmDialog
        open={dialogOpen}
        title="Excluir Produto"
        message={`Tem certeza que deseja excluir o produto "${selectedProduto?.nome}"? Esta ação não pode ser desfeita.`}
        confirmButtonText="Excluir"
        cancelButtonText="Cancelar"
        confirmButtonColor="error"
        onConfirm={handleDeleteProduto}
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

export default ProdutosListPage;
