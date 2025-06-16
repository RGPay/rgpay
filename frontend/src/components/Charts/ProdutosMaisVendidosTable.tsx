import * as React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  useTheme,
} from "@mui/material";
import dashboardService, {
  DashboardFilter,
} from "../../services/dashboard.service";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface ProdutoMaisVendido {
  id_produto: number;
  nome: string;
  imagem?: string;
  quantidade: number;
  valor_total: number;
}

interface ProdutosMaisVendidosTableProps {
  filter: DashboardFilter;
}

const ProdutosMaisVendidosTable: React.FC<ProdutosMaisVendidosTableProps> = ({
  filter,
}) => {
  const theme = useTheme();
  const selectedUnidade = useSelector(
    (state: RootState) => state.unidade.selectedUnidade
  );
  const [eventos, setEventos] = React.useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedEvento, setSelectedEvento] = React.useState<number | null>(
    null
  );
  const [produtos, setProdutos] = React.useState<ProdutoMaisVendido[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Reset selectedEvento when unidade changes
  React.useEffect(() => {
    setSelectedEvento(null);
  }, [selectedUnidade]);

  // Fetch eventos
  React.useEffect(() => {
    dashboardService
      .getEventos(selectedUnidade || undefined)
      .then((rawEventos) => {
        setEventos(
          rawEventos.map(
            (e: {
              id_evento?: number;
              id?: number;
              nome?: string;
              name?: string;
            }) => ({
              id: e.id_evento ?? e.id!,
              name: e.nome ?? e.name!,
            })
          )
        );
      });
  }, [selectedUnidade, filter.periodoInicio, filter.periodoFim]);

  // Fetch produtos mais vendidos
  React.useEffect(() => {
    setLoading(true);
    dashboardService
      .getMetrics({
        ...filter,
        id_evento: selectedEvento || undefined,
      } as Partial<DashboardFilter & { id_evento?: number }>)
      .then((data) => setProdutos(data.produtosMaisVendidos || []))
      .finally(() => setLoading(false));
  }, [
    selectedEvento,
    selectedUnidade,
    filter.periodoInicio,
    filter.periodoFim,
  ]);

  const totalVendas = produtos.reduce(
    (sum: number, p: ProdutoMaisVendido) => sum + p.quantidade,
    0
  );
  const totalFaturamento = produtos.reduce(
    (sum: number, p: ProdutoMaisVendido) => sum + p.valor_total,
    0
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <Box sx={{ width: "100%", height: "100%", p: 0, m: 0 }}>
      <Box sx={{ display: "flex", gap: 1, overflowX: "auto", mb: 2 }}>
        <Chip
          label="Todos"
          clickable
          color={selectedEvento === null ? "primary" : "default"}
          onClick={() => setSelectedEvento(null)}
        />
        {eventos.map((evento) => (
          <Chip
            key={evento.id}
            label={evento.name}
            clickable
            color={selectedEvento === evento.id ? "primary" : "default"}
            onClick={() => setSelectedEvento(evento.id)}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 6, mb: 2, alignItems: "center", px: 0 }}>
        <Box>
          <Typography variant="subtitle2" color={theme.palette.text.secondary}>
            Vendas
          </Typography>
          <Typography
            variant="h6"
            color={theme.palette.primary.main}
            fontWeight={700}
          >
            {totalVendas}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color={theme.palette.text.secondary}>
            Faturamento (R$)
          </Typography>
          <Typography
            variant="h6"
            color={theme.palette.primary.main}
            fontWeight={700}
          >
            {formatCurrency(totalFaturamento)}
          </Typography>
        </Box>
      </Box>
      <Divider
        sx={{ mb: 1, borderColor: theme.palette.divider, opacity: 0.15 }}
      />
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 120,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Table
          size="small"
          sx={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            background: "none",
            "& thead th": {
              border: 0,
              background: "none",
              color: theme.palette.text.secondary,
              fontWeight: 700,
              fontSize: 13,
              paddingY: 1,
            },
            "& td, & th": {
              border: 0,
              background: "none",
              paddingY: 1.2,
              paddingX: 0,
            },
            "& tbody tr": {
              transition: "background 0.2s",
              "&:hover": {
                background: theme.palette.action.hover,
              },
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>PRODUTO</TableCell>
              <TableCell align="right">QTD</TableCell>
              <TableCell align="right">VALOR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos.map((produto: ProdutoMaisVendido) => (
              <TableRow
                key={produto.id_produto}
                hover
                sx={{ boxShadow: "none", border: 0 }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      variant="rounded"
                      src={produto.imagem || undefined}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor:
                          !produto.imagem && theme.palette.mode === "dark"
                            ? theme.palette.primary.dark + "22"
                            : !produto.imagem
                            ? theme.palette.primary.light + "22"
                            : undefined,
                        color: theme.palette.text.secondary,
                        fontWeight: 700,
                        fontSize: 16,
                        mr: 1,
                      }}
                    >
                      {!produto.imagem && produto.nome.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="body2"
                      color={theme.palette.primary.main}
                      fontWeight={700}
                      sx={{ textTransform: "uppercase", letterSpacing: 0.2 }}
                    >
                      {produto.nome}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600}>
                    {produto.quantidade}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(produto.valor_total)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default ProdutosMaisVendidosTable;
