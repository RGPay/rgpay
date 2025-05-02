import * as React from "react";
import { useState } from "react";
import { Box, Chip, CircularProgress } from "@mui/material";
import { ReactECharts } from ".";
import dashboardService, {
  TicketMedioPorHora,
  DashboardFilter,
} from "../../services/dashboard.service";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface TicketMedioPorHoraChartProps {
  height?: number;
  filter: DashboardFilter;
}

const TicketMedioPorHoraChart: React.FC<TicketMedioPorHoraChartProps> = ({
  height = 350,
  filter,
}) => {
  const [eventos, setEventos] = useState<{ id: number; name: string }[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<number | null>(null);
  const [ticketMedioPorHora, setTicketMedioPorHora] = useState<
    TicketMedioPorHora[]
  >([]);
  const [loading, setLoading] = useState(false);

  const selectedUnidade = useSelector(
    (state: RootState) => state.unidade.selectedUnidade
  );

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
      .getTicketMedioPorHora(
        selectedEvento ?? undefined,
        selectedUnidade ?? undefined,
        filter
      )
      .then(setTicketMedioPorHora)
      .finally(() => setLoading(false));
  }, [
    selectedEvento,
    selectedUnidade,
    filter.periodoInicio,
    filter.periodoFim,
  ]);

  const getOptions = () => ({
    tooltip: {
      trigger: "axis",
      formatter: (params: { name: string; value: number }[]) => {
        const value = params[0].value;
        return `${params[0].name}: R$ ${value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`;
      },
    },
    xAxis: {
      type: "category",
      data: ticketMedioPorHora.map((item) => item.hour),
      name: "Hora",
      axisLabel: { fontWeight: 600 },
    },
    yAxis: {
      type: "value",
      name: "Ticket Médio",
      axisLabel: {
        formatter: (v: number) => `R$ ${v.toLocaleString("pt-BR")}`,
      },
    },
    series: [
      {
        data: ticketMedioPorHora.map((item) => item.value),
        type: "bar",
        itemStyle: { color: "#ff7043" },
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

export default TicketMedioPorHoraChart;
