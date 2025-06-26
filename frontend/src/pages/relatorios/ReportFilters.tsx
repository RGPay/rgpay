import React from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  useTheme,
  alpha,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale/pt-BR";
import {
  FilterAlt as FilterAltIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Evento } from "../../services/eventos.service";
import { RelatorioFilter } from "../../services/relatorios.service";

interface ReportFiltersProps {
  filter: RelatorioFilter;
  onFilterChange: (filter: RelatorioFilter) => void;
  eventos: Evento[];
  loading?: boolean;
}

type FilterMode = 'date' | 'event';

const ReportFilters: React.FC<ReportFiltersProps> = ({
  filter,
  onFilterChange,
  eventos,
  loading = false,
}) => {
  const theme = useTheme();
  const selectedUnidade = useSelector(
    (state: RootState) => state.unidade.selectedUnidade
  );

  // Filter eventos to show only those related to the selected unit
  const filteredEventos = React.useMemo(() => {
    if (!selectedUnidade) return eventos;
    return eventos.filter(evento => evento.id_unidade === selectedUnidade);
  }, [eventos, selectedUnidade]);

  // Track filter mode separately from filter values
  const [filterMode, setFilterMode] = React.useState<FilterMode>(() => {
    // Initialize based on current filter state
    return filter.id_evento ? 'event' : 'date';
  });

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: FilterMode | null,
  ) => {
    if (newMode === null) return;

    setFilterMode(newMode);

    if (newMode === 'date') {
      // Switch to date mode - clear event filter and search
      onFilterChange({
        search: undefined,
        periodoInicio: filter.periodoInicio,
        periodoFim: filter.periodoFim,
        id_evento: undefined,
      });
    } else {
      // Switch to event mode - clear date filters and search
      onFilterChange({
        search: undefined,
        id_evento: filter.id_evento,
        periodoInicio: undefined,
        periodoFim: undefined,
      });
    }
  };

  const handleDateChange = (field: 'periodoInicio' | 'periodoFim', date: Date | null) => {
    onFilterChange({
      ...filter,
      [field]: date || undefined,
    });
  };

  const handleEventChange = (eventId: number | '') => {
    onFilterChange({
      ...filter,
      id_evento: eventId === '' ? undefined : Number(eventId),
    });
  };

  const handleReset = () => {
    onFilterChange({
      search: undefined,
      periodoInicio: undefined,
      periodoFim: undefined,
      id_evento: undefined,
    });
    setFilterMode('date');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
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
            mb: 3,
          }}
        >
          <FilterAltIcon fontSize="small" />
          <Typography variant="body2" fontWeight={500}>
            Filtros:
          </Typography>
        </Box>

        {/* Filter Mode Toggle */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Tipo de Filtro:
          </Typography>
          <ToggleButtonGroup
            value={filterMode}
            exclusive
            onChange={handleModeChange}
            size="small"
            disabled={loading}
          >
            <ToggleButton value="date">
              Por Data
            </ToggleButton>
            <ToggleButton value="event">
              Por Evento
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          {filterMode === 'date' ? (
            <>
              <DatePicker
                label="Data Início"
                value={filter.periodoInicio || null}
                onChange={(date) => handleDateChange('periodoInicio', date)}
                disabled={loading}
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
                value={filter.periodoFim || null}
                onChange={(date) => handleDateChange('periodoFim', date)}
                disabled={loading}
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
            </>
          ) : (
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: { xs: "100%", sm: 200 },
                bgcolor: alpha(theme.palette.background.paper, 0.8),
              }}
              disabled={loading}
            >
              <InputLabel id="evento-filter-label">Evento</InputLabel>
              <Select
                labelId="evento-filter-label"
                id="evento-filter"
                value={filter.id_evento || ""}
                label="Evento"
                onChange={(e) => handleEventChange(e.target.value as number | '')}
              >
                <MenuItem value="">
                  {filteredEventos.length === 0 
                    ? "Nenhum evento disponível para esta unidade" 
                    : "Selecione um evento"}
                </MenuItem>
                {filteredEventos.map((evento) => (
                  <MenuItem key={evento.id_evento} value={evento.id_evento}>
                    {evento.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box sx={{ flex: "1 1 auto" }} />

          <Button
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            size="small"
            disabled={loading}
            sx={{ ml: "auto" }}
          >
            Resetar
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default ReportFilters; 