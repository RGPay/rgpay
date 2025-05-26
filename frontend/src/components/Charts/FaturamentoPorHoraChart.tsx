import * as React from "react";
import { useState } from "react";
import { Box, Chip, CircularProgress, useTheme, alpha } from "@mui/material";
import { ReactECharts } from ".";
import dashboardService, {
  FaturamentoPorHora,
  DashboardFilter,
} from "../../services/dashboard.service";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface FaturamentoPorHoraChartProps {
  height?: number;
  filter: DashboardFilter;
}

const FaturamentoPorHoraChart: React.FC<FaturamentoPorHoraChartProps> = ({
  height = 350,
  filter,
}) => {
  const [eventos, setEventos] = useState<{ id: number; name: string }[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<number | null>(null);
  const [faturamentoPorHora, setFaturamentoPorHora] = useState<
    FaturamentoPorHora[]
  >([]);
  const [loading, setLoading] = useState(false);

  const selectedUnidade = useSelector(
    (state: RootState) => state.unidade.selectedUnidade
  );

  const theme = useTheme();

  // Reset selectedEvento when unidade changes
  React.useEffect(() => {
    setSelectedEvento(null);
  }, [selectedUnidade]);

  React.useEffect(() => {
    dashboardService
      .getEventos(selectedUnidade ?? undefined)
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

  React.useEffect(() => {
    setLoading(true);
    dashboardService
      .getFaturamentoPorHora(
        selectedEvento ?? undefined,
        selectedUnidade ?? undefined,
        filter
      )
      .then(setFaturamentoPorHora)
      .finally(() => setLoading(false));
  }, [
    selectedEvento,
    selectedUnidade,
    filter.periodoInicio,
    filter.periodoFim,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getOptions = () => {
    const maxValue = Math.max(...faturamentoPorHora.map((item) => item.value));

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: alpha(theme.palette.primary.main, 0.1),
          },
        },
        formatter: (params: any) => {
          const data = params[0];
          const percentage =
            maxValue > 0 ? ((data.value / maxValue) * 100).toFixed(1) : "0";
          return `<div style="padding: 12px;">
            <div style="font-weight: 600; margin-bottom: 8px; color: ${
              theme.palette.text.primary
            };">
              ${data.axisValue}:00
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 12px; height: 12px; background: ${
                theme.palette.primary.main
              }; border-radius: 3px;"></div>
              <span style="color: ${theme.palette.text.secondary};">
                Faturamento: <strong style="color: ${
                  theme.palette.text.primary
                };">${formatCurrency(data.value)}</strong>
              </span>
            </div>
            <div style="margin-top: 4px; font-size: 12px; color: ${
              theme.palette.text.secondary
            };">
              ${percentage}% do pico de vendas
            </div>
          </div>`;
        },
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        borderColor: alpha(theme.palette.divider, 0.2),
        textStyle: {
          color: theme.palette.text.primary,
        },
        extraCssText:
          "backdrop-filter: blur(12px); border-radius: 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15); border: none;",
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "15%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: faturamentoPorHora.map((item) => `${item.hour}h`),
        name: "Horário",
        nameLocation: "middle",
        nameGap: 30,
        nameTextStyle: {
          color: theme.palette.text.secondary,
          fontSize: 12,
          fontWeight: "bold",
        },
        axisLabel: {
          fontWeight: 600,
          color: theme.palette.text.secondary,
          fontSize: 11,
          rotate: 45,
          margin: 8,
        },
        axisLine: {
          lineStyle: {
            color: alpha(theme.palette.divider, 0.3),
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        name: "Faturamento",
        nameLocation: "middle",
        nameGap: 50,
        nameTextStyle: {
          color: theme.palette.text.secondary,
          fontSize: 12,
          fontWeight: "bold",
        },
        axisLabel: {
          formatter: (v: number) => {
            if (v >= 1000000) {
              return `${(v / 1000000).toFixed(1)}M`;
            } else if (v >= 1000) {
              return `${(v / 1000).toFixed(0)}K`;
            }
            return formatCurrency(v);
          },
          color: theme.palette.text.secondary,
          fontSize: 11,
        },
        axisLine: {
          lineStyle: {
            color: alpha(theme.palette.divider, 0.3),
          },
        },
        splitLine: {
          lineStyle: {
            color: alpha(theme.palette.divider, 0.08),
            type: "dashed",
          },
        },
      },
      series: [
        {
          data: faturamentoPorHora.map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [
                  { offset: 0, color: alpha(theme.palette.primary.main, 0.8) },
                  { offset: 0.5, color: theme.palette.primary.main },
                  { offset: 1, color: theme.palette.primary.light },
                ],
              },
              borderRadius: [4, 4, 0, 0],
              shadowColor: alpha(theme.palette.primary.main, 0.3),
              shadowBlur: 6,
              shadowOffsetY: 3,
            },
          })),
          type: "bar",
          barWidth: "60%",
          barMaxWidth: 40,
          label: {
            show: true,
            position: "top",
            formatter: (params: any) => {
              if (params.value >= 1000000) {
                return `${(params.value / 1000000).toFixed(1)}M`;
              } else if (params.value >= 1000) {
                return `${(params.value / 1000).toFixed(0)}K`;
              }
              return params.value > 0 ? formatCurrency(params.value) : "";
            },
            fontSize: 10,
            color: theme.palette.text.secondary,
            fontWeight: "bold",
          },
          emphasis: {
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [
                  { offset: 0, color: theme.palette.primary.dark },
                  { offset: 0.5, color: theme.palette.primary.main },
                  { offset: 1, color: theme.palette.primary.light },
                ],
              },
              shadowBlur: 10,
              shadowColor: alpha(theme.palette.primary.main, 0.4),
            },
            scale: true,
          },
          animationDelay: (idx: number) => idx * 50,
          animationDuration: 600,
          animationEasing: "cubicOut",
        },
      ],
      animation: true,
      animationThreshold: 2000,
      animationDuration: 800,
      animationEasing: "cubicOut",
    };
  };

  return (
    <>
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
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <ReactECharts option={getOptions()} style={{ height, width: "100%" }} />
      )}
    </>
  );
};

export default FaturamentoPorHoraChart;
