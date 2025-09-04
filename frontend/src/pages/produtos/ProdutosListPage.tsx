import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
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
  const [togglingIds, setTogglingIds] = useState<Record<number, boolean>>({});
  const togglingRef = useRef<Set<number>>(new Set());
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

  // Atualiza o filtro de busca com debounce enquanto digita
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter((prev) => ({ ...prev, q: (searchTerm || "").trim() || undefined }));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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
    const id = produto.id_produto;
    if (togglingRef.current.has(id)) return; // bloqueio síncrono
    togglingRef.current.add(id);
    setTogglingIds((prev) => ({ ...prev, [id]: true }));
    try {
      const desired = !produto.disponivel;
      const updated = await produtosService.update(id, { disponivel: desired });
      // atualização otimista do item na lista
      setProdutos((prev) =>
        prev.map((p) =>
          p.id_produto === id ? { ...p, disponivel: updated.disponivel } : p
        )
      );
      setToast({
        open: true,
        message: `Produto ${updated.disponivel ? "ativado" : "desativado"} com sucesso`,
        severity: "success",
      });
      // recarrega em background para garantir sincronização
      loadProdutos();
    } catch (error) {
      console.error("Error toggling product status:", error);
      setToast({
        open: true,
        message: "Erro ao alterar status do produto",
        severity: "error",
      });
    } finally {
      togglingRef.current.delete(id);
      setTogglingIds((prev) => ({ ...prev, [id]: false }));
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
      align: "center" as const,
      format: (value: unknown, _row: Produto) =>
        value ? (
          <img
            src={value as string}
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
      format: (value: unknown, _row: Produto) => (
        <Chip
          label={(value as Produto["category"])?.name || "-"}
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
      align: "right" as const,
      sortable: true,
      format: (value: unknown) => formatCurrency(value as number),
    },
    {
      id: "preco_venda",
      label: "Preço de Venda",
      minWidth: 120,
      align: "right" as const,
      sortable: true,
      format: (value: unknown) => formatCurrency(value as number),
    },
    {
      id: "estoque",
      label: "Estoque",
      minWidth: 100,
      align: "right" as const,
      sortable: true,
      format: (value: unknown) => value as number,
    },
    {
      id: "disponivel",
      label: "Disponível",
      minWidth: 120,
      sortable: true,
      format: (value: unknown, row: Produto) =>
        togglingIds[row.id_produto] ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={14} thickness={5} />
            <Typography variant="caption" color="text.secondary">
              Atualizando...
            </Typography>
          </Box>
        ) : (
          <Chip
            label={(value as boolean) ? "Sim" : "Não"}
            color={(value as boolean) ? "success" : "error"}
            size="small"
          />
        ),
    },
    {
      id: "unidade",
      label: "Unidade",
      minWidth: 120,
      sortable: true,
      format: (value: unknown) => (value as Produto["unidade"])?.nome || "-",
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
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchTerm("");
                    setFilter((prev) => ({ ...prev, q: undefined }));
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="category-filter-label">Categoria</InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter"
            value={filter.categoryId || ""}
            label="Categoria"
            onChange={(e) =>
              setFilter({
                ...filter,
                categoryId: e.target.value
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

        <IconButton
          onClick={() => {
            setSearchTerm("");
            setFilter({});
          }}
          color="primary"
          title="Resetar filtros"
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      <DataTable
        columns={columns}
        data={produtos}
        title="Lista de Produtos"
        keyExtractor={(item) => item.id_produto}
        actions={actions}
        onRowDoubleClick={(produto) => handleToggleStatus(produto)}
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
