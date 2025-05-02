import * as React from "react";
import { useState } from "react";
import { Box, Chip, CircularProgress, useTheme } from "@mui/material";
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

  const getOptions = () => ({
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: faturamentoPorHora.map((item) => item.hour),
      name: "Hora",
      axisLabel: { fontWeight: 600 },
    },
    yAxis: {
      type: "value",
      name: "Faturamento",
      axisLabel: {
        formatter: (v: number) => `R$ ${v.toLocaleString("pt-BR")}`,
      },
    },
    series: [
      {
        data: faturamentoPorHora.map((item) => item.value),
        type: "bar",
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: theme.palette.primary.main },
              { offset: 1, color: theme.palette.primary.light },
            ],
          },
        },
        barWidth: "60%",
      },
    ],
  });

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
