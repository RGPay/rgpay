import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  useTheme,
  alpha,
  LinearProgress,
  Avatar,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { startOfMonth } from "date-fns";
import {
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
  Storefront as StorefrontIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  NavigateNext as NavigateNextIcon,
  Refresh as RefreshIcon,
  FilterAlt as FilterAltIcon,
} from "@mui/icons-material";
import { ReactECharts } from "../components";
import dashboardService, {
  DashboardMetrics,
  DashboardFilter,
} from "../services/dashboard.service";
import unidadesService, { Unidade } from "../services/unidades.service";
import { Toast } from "../components";
import { useNavigate } from "react-router-dom";

// Custom styled components
const GradientCard = ({
  title,
  value,
  icon,
  color,
  secondaryValue,
  change,
  onClick,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  secondaryValue?: string;
  change?: number;
  onClick?: () => void;
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 8px 32px ${alpha(color, 0.2)}`,
        transition: "transform 0.3s ease",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? {
              transform: "translateY(-5px)",
            }
          : {},
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${alpha(color, 0.3)} 0%, ${alpha(
            color,
            0.1
          )} 100%)`,
          zIndex: 0,
        },
      }}
      onClick={onClick}
    >
      <CardContent
        sx={{ position: "relative", zIndex: 1, height: "100%", p: 3 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              {title}
            </Typography>
            <Avatar
              sx={{
                bgcolor: alpha(color, 0.15),
                color: color,
                width: 40,
                height: 40,
              }}
            >
              {icon}
            </Avatar>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: theme.palette.text.primary,
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
              }}
            >
              {value}
            </Typography>

            {secondaryValue && (
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 2,
                }}
              >
                {secondaryValue}
              </Typography>
            )}

            {change !== undefined && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: "auto",
                  pt: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color:
                      change >= 0
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                    bgcolor:
                      change >= 0
                        ? alpha(theme.palette.success.main, 0.1)
                        : alpha(theme.palette.error.main, 0.1),
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                  }}
                >
                  {change >= 0 ? (
                    <ArrowUpwardIcon fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" />
                  )}
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, ml: 0.5 }}
                  >
                    {Math.abs(change)}%
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ ml: 1, color: theme.palette.text.secondary }}
                >
                  em relação ao mês anterior
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const ChartCard = ({
  title,
  chart,
  isLoading = false,
  actions,
}: {
  title: string;
  chart: React.ReactNode;
  isLoading?: boolean;
  actions?: React.ReactNode;
}) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        }
        action={
          actions || (
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          )
        }
        sx={{
          px: 3,
          py: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      />
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: 3,
          pt: 2,
          position: "relative",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress size={40} />
          </Box>
        ) : (
          chart
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
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

  const navigate = useNavigate();

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
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        borderColor: alpha(theme.palette.divider, 0.2),
        textStyle: {
          color: theme.palette.text.primary,
        },
        extraCssText:
          "backdrop-filter: blur(8px); border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);",
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
        axisLine: {
          lineStyle: {
            color: alpha(theme.palette.divider, 0.3),
          },
        },
        axisLabel: {
          color: theme.palette.text.secondary,
          formatter: (value: string) => {
            return value.slice(0, 5);
          },
        },
        axisTick: {
          alignWithLabel: true,
          lineStyle: {
            color: alpha(theme.palette.divider, 0.3),
          },
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: theme.palette.text.secondary,
          formatter: (value: number) => formatCurrency(value),
        },
        splitLine: {
          lineStyle: {
            color: alpha(theme.palette.divider, 0.1),
            type: "dashed",
          },
        },
      },
      series: [
        {
          name: "Vendas",
          type: "line",
          smooth: true,
          data: values,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: {
            color: theme.palette.primary.main,
            borderColor: theme.palette.background.paper,
            borderWidth: 2,
          },
          lineStyle: {
            width: 3,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: theme.palette.primary.main,
                },
                {
                  offset: 1,
                  color: theme.palette.secondary.main,
                },
              ],
            },
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
                  color: alpha(theme.palette.primary.main, 0.3),
                },
                {
                  offset: 1,
                  color: alpha(theme.palette.primary.main, 0.05),
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
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        borderColor: alpha(theme.palette.divider, 0.2),
        textStyle: {
          color: theme.palette.text.primary,
        },
        extraCssText:
          "backdrop-filter: blur(8px); border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);",
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        data: produtos,
        textStyle: {
          color: theme.palette.text.secondary,
        },
        itemGap: 12,
        icon: "circle",
        itemWidth: 10,
        itemHeight: 10,
        formatter: (name: string) => {
          if (name.length > 15) {
            return name.substring(0, 15) + "...";
          }
          return name;
        },
      },
      series: [
        {
          name: "Produtos",
          type: "pie",
          radius: ["45%", "75%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: theme.palette.background.paper,
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
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.2)",
            },
          },
          labelLine: {
            show: false,
          },
          data: produtos.map((nome, index) => ({
            value: valores[index],
            name: nome,
            itemStyle: {
              color: [
                theme.palette.primary.main,
                theme.palette.secondary.main,
                theme.palette.success.main,
                "#9C27B0",
                "#FF9800",
              ][index % 5],
            },
          })),
        },
      ],
    };
  };

  const getUnidadesChartOptions = () => {
    if (!metrics?.vendasPorUnidade) return {};

    const unidades = metrics.vendasPorUnidade.map((item) => item.nome);
    const valores = metrics.vendasPorUnidade.map((item) => item.total);

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          return `${params[0].name}: ${formatCurrency(params[0].value)}`;
        },
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        borderColor: alpha(theme.palette.divider, 0.2),
        textStyle: {
          color: theme.palette.text.primary,
        },
        extraCssText:
          "backdrop-filter: blur(8px); border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: alpha(theme.palette.divider, 0.3),
          },
        },
        axisLabel: {
          color: theme.palette.text.secondary,
          formatter: (value: number) => formatCurrency(value),
        },
        splitLine: {
          lineStyle: {
            color: alpha(theme.palette.divider, 0.1),
            type: "dashed",
          },
        },
      },
      yAxis: {
        type: "category",
        data: unidades,
        axisLine: {
          lineStyle: {
            color: alpha(theme.palette.divider, 0.3),
          },
        },
        axisLabel: {
          color: theme.palette.text.secondary,
          formatter: (value: string) => {
            if (value.length > 15) {
              return value.substring(0, 15) + "...";
            }
            return value;
          },
        },
        axisTick: {
          alignWithLabel: true,
          lineStyle: {
            color: alpha(theme.palette.divider, 0.3),
          },
        },
      },
      series: [
        {
          name: "Vendas",
          type: "bar",
          data: valores,
          barWidth: "40%",
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: theme.palette.primary.main,
                },
                {
                  offset: 1,
                  color: theme.palette.primary.light,
                },
              ],
            },
          },
          emphasis: {
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: theme.palette.primary.dark,
                  },
                  {
                    offset: 1,
                    color: theme.palette.primary.main,
                  },
                ],
              },
            },
          },
        },
      ],
    };
  };

  const MetricCards = () => {
    if (!metrics || loading) {
      return (
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%", p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <LinearProgress />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <GradientCard
            title="Faturamento Total"
            value={formatCurrency(metrics.faturamentoTotal || 0)}
            icon={<AttachMoneyIcon />}
            color={theme.palette.primary.main}
            secondaryValue={`${metrics.totalPedidos || 0} pedidos no período`}
            change={12.8}
            onClick={() => navigate("/pedidos")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <GradientCard
            title="Ticket Médio"
            value={formatCurrency(metrics.ticketMedio || 0)}
            icon={<ReceiptIcon />}
            color={theme.palette.secondary.main}
            secondaryValue="Por pedido"
            change={5.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <GradientCard
            title="Produtos Vendidos"
            value={`${metrics.totalItensVendidos || 0}`}
            icon={<ShoppingCartIcon />}
            color={theme.palette.success.main}
            secondaryValue={`${
              metrics.produtosMaisVendidos?.length || 0
            } produtos diferentes`}
            change={-3.5}
            onClick={() => navigate("/produtos")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <GradientCard
            title="Unidades Ativas"
            value={`${metrics.totalUnidades || 0}`}
            icon={<StorefrontIcon />}
            color="#9C27B0"
            secondaryValue={`${unidades.length || 0} unidades cadastradas`}
            change={0}
            onClick={() => navigate("/unidades")}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box sx={{ mb: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, mb: 1 }}
          >
            Dashboard
          </Typography>
        </Box>

        <Paper
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            background: alpha(theme.palette.background.paper, 0.6),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
          elevation={0}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
              mr: 1,
            }}
          >
            <FilterAltIcon fontSize="small" />
            <Typography variant="body2" fontWeight={500}>
              Filtros:
            </Typography>
          </Box>

          <DatePicker
            label="Data Início"
            value={filter.periodoInicio}
            onChange={(date) =>
              setFilter({ ...filter, periodoInicio: date || undefined })
            }
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  minWidth: { xs: "100%", sm: 170 },
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                },
              },
            }}
          />

          <DatePicker
            label="Data Fim"
            value={filter.periodoFim}
            onChange={(date) =>
              setFilter({ ...filter, periodoFim: date || undefined })
            }
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  minWidth: { xs: "100%", sm: 170 },
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                },
              },
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 200 },
              bgcolor: alpha(theme.palette.background.paper, 0.8),
            }}
          >
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
              <MenuItem value="">Todas as unidades</MenuItem>
              {unidades.map((unidade) => (
                <MenuItem key={unidade.id_unidade} value={unidade.id_unidade}>
                  {unidade.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ flex: "1 1 auto" }} />

          <Button
            startIcon={<RefreshIcon />}
            onClick={() => {
              setFilter({
                periodoInicio: startOfMonth(new Date()),
                periodoFim: new Date(),
              });
            }}
            size="small"
            sx={{ ml: "auto" }}
          >
            Resetar
          </Button>
        </Paper>

        <MetricCards />

        <Grid container spacing={5}>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid xs={12} md={6} item>
              <ChartCard
                title="Faturamento no Período"
                isLoading={loading}
                chart={
                  <ReactECharts
                    option={getVendasChartOptions()}
                    style={{ height: 350, width: "100%" }}
                  />
                }
              />
            </Grid>
            <Grid xs={12} md={6} item>
              <ChartCard
                title="Produtos Mais Vendidos"
                isLoading={loading}
                chart={
                  <ReactECharts
                    option={getProdutosChartOptions()}
                    style={{ height: 350, width: "100%" }}
                  />
                }
              />
            </Grid>
            <Grid xs={12} item>
              <ChartCard
                title="Faturamento por Unidade"
                isLoading={loading}
                chart={
                  <ReactECharts
                    option={getUnidadesChartOptions()}
                    style={{ height: 350, width: "100%" }}
                  />
                }
              />
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            endIcon={<NavigateNextIcon />}
            onClick={() => navigate("/pedidos")}
          >
            Ver todos os pedidos
          </Button>
        </Box>
      </Box>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </LocalizationProvider>
  );
};

export default Dashboard;
