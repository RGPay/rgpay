import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  IconButton,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { Pedido, ItemPedido } from "../../services/pedidos.service";
import pedidosService from "../../services/pedidos.service";
import { Toast } from "../../components";

const PedidoDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchPedido = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await pedidosService.getById(parseInt(id, 10));
        setPedido(data);
      } catch (error) {
        console.error("Error loading order details:", error);
        setToast({
          open: true,
          message: "Erro ao carregar detalhes do pedido",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [id]);

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

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

  const handleBack = () => {
    navigate("/pedidos");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!pedido) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Pedido não encontrado
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Voltar para Pedidos
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} to="/">
            Dashboard
          </Link>
          <Link component={RouterLink} to="/pedidos">
            Pedidos
          </Link>
          <Typography color="text.primary">Detalhes do Pedido #{id}</Typography>
        </Breadcrumbs>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            Detalhes do Pedido #{id}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informações do Pedido
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Data/Hora
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(pedido.data_hora)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Unidade
                  </Typography>
                  <Typography variant="body1">
                    {pedido.unidade?.nome || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Maquineta
                  </Typography>
                  <Typography variant="body1">
                    {pedido.maquineta?.numero_serie || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Valor Total
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {formatCurrency(pedido.valor_total)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Itens do Pedido
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell align="center">Quantidade</TableCell>
                      <TableCell align="right">Preço Unitário</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedido.itensPedido && pedido.itensPedido.length > 0 ? (
                      pedido.itensPedido.map((item: ItemPedido) => (
                        <TableRow key={item.id_item_pedido}>
                          <TableCell>
                            {item.produto?.nome ||
                              `Produto #${item.id_produto}`}
                          </TableCell>
                          <TableCell align="center">
                            {item.quantidade}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.preco_unitario || 0)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(
                              (item.preco_unitario || 0) * item.quantidade
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Nenhum item encontrado para este pedido
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />
    </Box>
  );
};

export default PedidoDetailsPage;
