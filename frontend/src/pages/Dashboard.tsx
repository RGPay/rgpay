import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { subDays, startOfMonth } from "date-fns";
import {
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
  Storefront as StorefrontIcon,
} from "@mui/icons-material";
import { ReactECharts } from "../components";
import dashboardService, {
  DashboardMetrics,
  DashboardFilter,
} from "../services/dashboard.service";
import unidadesService, { Unidade } from "../services/unidades.service";
import { Toast, InfoCard } from "../components";

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [filter, setFilter] = useState<DashboardFilter>({
    periodoInicio: startOfMonth(new Date()),
    periodoFim: new Date(),
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error" as "success" | "error",
  });

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const data = await unidadesService.getAll();
        setUnidades(data);
      } catch (error) {
        console.error("Error loading units:", error);
      }
    };

    fetchUnidades();
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getMetrics(filter);
        setMetrics(data);
      } catch (error) {
        console.error("Error loading dashboard metrics:", error);
        setToast({
          open: true,
          message: "Erro ao carregar métricas do dashboard",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [filter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getVendasChartOptions = () => {
    if (!metrics?.vendasPorPeriodo) return {};

    const dates = metrics.vendasPorPeriodo.map((item) => item.data);
    const values = metrics.vendasPorPeriodo.map((item) => item.total);

    return {
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          const value = params[0].value;
          return `${params[0].name}: ${formatCurrency(value)}`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: dates,
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => formatCurrency(value),
        },
      },
      series: [
        {
          name: "Vendas",
          type: "line",
          smooth: true,
          data: values,
          itemStyle: {
            color: "#0a56a5",
          },
          lineStyle: {
            width: 3,
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(10, 86, 165, 0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(10, 86, 165, 0.1)",
                },
              ],
            },
          },
        },
      ],
    };
  };

  const getProdutosChartOptions = () => {
    if (!metrics?.produtosMaisVendidos) return {};

    const produtos = metrics.produtosMaisVendidos
      .slice(0, 5)
      .map((item) => item.nome);
    const valores = metrics.produtosMaisVendidos
      .slice(0, 5)
      .map((item) => item.valor_total);

    return {
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          return `${params.name}: ${formatCurrency(params.value)} (${
            params.percent
          }%)`;
        },
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        data: produtos,
      },
      series: [
        {
          name: "Produtos",
          type: "pie",
          radius: ["45%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: produtos.map((nome, index) => ({
            value: valores[index],
            name: nome,
          })),
        },
      ],
    };
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box>
        <Typography variant="h5" component="h1" gutterBottom>
          Dashboard
        </Typography>

        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <DatePicker
            label="Data Início"
            value={filter.periodoInicio}
            onChange={(date) =>
              setFilter({ ...filter, periodoInicio: date || undefined })
            }
            slotProps={{ textField: { size: "small" } }}
          />

          <DatePicker
            label="Data Fim"
            value={filter.periodoFim}
            onChange={(date) =>
              setFilter({ ...filter, periodoFim: date || undefined })
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
              {unidades.map((unidade) => (
                <MenuItem key={unidade.id_unidade} value={unidade.id_unidade}>
                  {unidade.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 5,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Total de Vendas"
                  value={formatCurrency(metrics?.totalVendas || 0)}
                  icon={<AttachMoneyIcon />}
                  color="#0a56a5"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Ticket Médio"
                  value={formatCurrency(metrics?.ticketMedio || 0)}
                  icon={<ReceiptIcon />}
                  color="#f57c00"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Total de Pedidos"
                  value={String(metrics?.totalPedidos || 0)}
                  icon={<ShoppingCartIcon />}
                  color="#43a047"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Pedidos Hoje"
                  value={String(metrics?.pedidosHoje || 0)}
                  icon={<StorefrontIcon />}
                  color="#e53935"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, height: "100%", borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Vendas por Período
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ReactECharts
                      option={getVendasChartOptions()}
                      style={{ height: "100%", width: "100%" }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: "100%", borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Produtos Mais Vendidos
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ReactECharts
                      option={getProdutosChartOptions()}
                      style={{ height: "100%", width: "100%" }}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default Dashboard;
