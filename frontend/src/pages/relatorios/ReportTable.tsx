import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  useTheme,
  alpha,
  CircularProgress,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { 
  FaturamentoProdutoResponse, 
  FaturamentoProdutoGroup,
  FaturamentoProdutoItem 
} from "../../services/relatorios.service";

interface ReportTableProps {
  data: FaturamentoProdutoResponse | null;
  loading?: boolean;
  searchTerm?: string;
  onSearchChange?: (searchTerm: string) => void;
}

interface GroupRowProps {
  group: FaturamentoProdutoGroup;
  searchTerm?: string;
}

const GroupRow: React.FC<GroupRowProps> = ({ group, searchTerm = "" }) => {
  const [expanded, setExpanded] = React.useState(true);
  const theme = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => (
      regex.test(part) ? (
        <Box
          key={index}
          component="span"
          sx={{
            backgroundColor: theme.palette.warning.light,
            color: theme.palette.warning.contrastText,
            padding: '2px 4px',
            borderRadius: '4px',
          }}
        >
          {part}
        </Box>
      ) : (
        part
      )
    ));
  };

  return (
    <>
      {/* Group Header Row */}
      <TableRow
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
          },
        }}
      >
        <TableCell
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ mr: 1 }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          {group.grupo}
        </TableCell>
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell sx={{ fontWeight: 600 }}>
          {formatCurrency(group.subtotal)}
        </TableCell>
      </TableRow>

      {/* Group Products Rows */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableBody>
                {group.produtos.map((produto, index) => (
                  <TableRow
                    key={`${group.grupo}-${produto.produto}-${index}`}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.action.hover, 0.04),
                      },
                    }}
                  >
                    <TableCell sx={{ pl: 4, width: '20%' }}>
                      {/* Empty - grupo is in parent */}
                    </TableCell>
                    <TableCell sx={{ width: '25%' }}>
                      {highlightText(produto.produto, searchTerm)}
                    </TableCell>
                    <TableCell align="center" sx={{ width: '10%' }}>
                      {produto.vendas}
                    </TableCell>
                    <TableCell align="center" sx={{ width: '10%' }}>
                      {produto.qtd}
                    </TableCell>
                    <TableCell align="center" sx={{ width: '10%' }}>
                      {produto.qtd_estorno}
                    </TableCell>
                    <TableCell align="right" sx={{ width: '10%' }}>
                      {formatCurrency(produto.unitario)}
                    </TableCell>
                    <TableCell align="right" sx={{ width: '15%', fontWeight: 500 }}>
                      {formatCurrency(produto.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ReportTable: React.FC<ReportTableProps> = ({
  data,
  loading = false,
  searchTerm = "",
  onSearchChange,
}) => {
  const theme = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.grupos.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Nenhum dado encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Tente ajustar os filtros para ver os resultados
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          overflow: 'auto',
        }}
      >
        {/* Search field inside table */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
          }}
        >
          <TextField
            label="Procurar Produto"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            size="small"
            fullWidth
            disabled={loading}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{
              maxWidth: 300,
            }}
          />
        </Box>

        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: alpha(theme.palette.grey[500], 0.1),
              }}
            >
              <TableCell sx={{ fontWeight: 600, width: '20%' }}>
                Grupo
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '25%' }}>
                Produto
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: '10%' }}>
                Vendas
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: '10%' }}>
                QTD
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: '10%' }}>
                QTD Estorno
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, width: '10%' }}>
                Unitário
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, width: '15%' }}>
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.grupos.map((group, index) => (
              <GroupRow
                key={`${group.grupo}-${index}`}
                group={group}
                searchTerm={searchTerm}
              />
            ))}

            {/* Total Row */}
            <TableRow
              sx={{
                backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                borderTop: `2px solid ${theme.palette.secondary.main}`,
              }}
            >
              <TableCell
                colSpan={6}
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: theme.palette.secondary.main,
                }}
              >
                Total Geral
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: theme.palette.secondary.main,
                }}
              >
                {formatCurrency(data.total_geral)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportTable; 