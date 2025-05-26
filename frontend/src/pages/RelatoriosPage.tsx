import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Stack,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  InputAdornment,
  Chip,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import eventosService, { Evento } from "../services/eventos.service";
import produtosService, { Produto } from "../services/produtos.service";
import pedidosService, { Pedido, ItemPedido } from "../services/pedidos.service";
import { DataTable } from "../components/DataTable";

const FiltersBar: React.FC<{
  dateRange: [Date | null, Date | null];
  setDateRange: (range: [Date | null, Date | null]) => void;
  selectedEvent: number | null;
  setSelectedEvent: (id: number | null) => void;
  events: Evento[];
  onExportCSV: () => void;
  onExportPDF: () => void;
}> = ({
  dateRange,
  setDateRange,
  selectedEvent,
  setSelectedEvent,
  events,
  onExportCSV,
  onExportPDF,
}) => {
  const [startDate, endDate] = dateRange;
  // Disable date pickers if event is selected, and vice versa
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <DatePicker
          label="Data inicial"
          value={startDate}
          onChange={(date) => setDateRange([date, endDate])}
          disabled={!!selectedEvent}
          slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
        />
        <DatePicker
          label="Data final"
          value={endDate}
          onChange={(date) => setDateRange([startDate, date])}
          disabled={!!selectedEvent}
          slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
        />
      </LocalizationProvider>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="event-select-label">Evento</InputLabel>
        <Select
          labelId="event-select-label"
          value={selectedEvent ?? ""}
          label="Evento"
          onChange={(e) => setSelectedEvent(e.target.value ? Number(e.target.value) : null)}
          disabled={!!startDate || !!endDate}
        >
          <MenuItem value="">
            <em>Nenhum</em>
          </MenuItem>
          {events.map((event) => (
            <MenuItem key={event.id_evento} value={event.id_evento}>
              {event.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ flexGrow: 1 }} />
      <Button
        variant="contained"
        sx={{
          background: 'linear-gradient(45deg, #43a047 30%, #66bb6a 90%)',
          color: '#fff',
          ml: { sm: 2 },
          '&:hover': {
            background: 'linear-gradient(45deg, #388e3c 30%, #43a047 90%)',
          },
        }}
        startIcon={<DownloadIcon />}
        onClick={onExportCSV}
      >
        Excel
      </Button>
      <Button
        variant="contained"
        sx={{
          background: 'linear-gradient(45deg, #e53935 30%, #ff5252 90%)',
          color: '#fff',
          ml: 1,
          '&:hover': {
            background: 'linear-gradient(45deg, #b71c1c 30%, #e53935 90%)',
          },
        }}
        startIcon={<PictureAsPdfIcon />}
        onClick={onExportPDF}
      >
        PDF
      </Button>
    </Stack>
  );
};

const RelatoriosPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [events, setEvents] = useState<Evento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportRows, setReportRows] = useState<any[]>([]); // Aggregated sales rows

  useEffect(() => {
    eventosService.getAll().then(setEvents);
  }, []);

  // Ensure only one filter is active at a time
  useEffect(() => {
    if ((dateRange[0] || dateRange[1]) && selectedEvent) {
      setSelectedEvent(null);
    }
  }, [dateRange]);
  useEffect(() => {
    if (selectedEvent && (dateRange[0] || dateRange[1])) {
      setDateRange([null, null]);
    }
  }, [selectedEvent]);

  // Fetch products (for joining details)
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await produtosService.getAll();
        setProdutos(data);
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchProdutos();
  }, []);

  // Fetch and aggregate sales data when filters change
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        let data_inicio: Date | undefined = undefined;
        let data_fim: Date | undefined = undefined;
        if (selectedEvent) {
          const event = events.find(e => e.id_evento === selectedEvent);
          if (event) {
            data_inicio = new Date(event.data_inicio);
            data_fim = new Date(event.data_fim);
          }
        } else if (dateRange[0] && dateRange[1]) {
          data_inicio = dateRange[0];
          data_fim = dateRange[1];
        } else {
          setReportRows([]);
          setLoading(false);
          return;
        }
        const pedidos: Pedido[] = await pedidosService.getAll({ data_inicio, data_fim });
        // Aggregate sales by product
        const salesMap = new Map<number, { quantidade: number; valor_total: number }>();
        pedidos.forEach(pedido => {
          (pedido.itensPedido || []).forEach(item => {
            if (!item.id_produto) return;
            const prev = salesMap.get(item.id_produto) || { quantidade: 0, valor_total: 0 };
            salesMap.set(item.id_produto, {
              quantidade: prev.quantidade + (item.quantidade || 0),
              valor_total: prev.valor_total + ((item.quantidade || 0) * (item.preco_unitario || 0)),
            });
          });
        });
        // Join with product details
        const rows = Array.from(salesMap.entries()).map(([id_produto, sales]) => {
          const produto = produtos.find(p => p.id_produto === id_produto);
          return {
            ...produto,
            ...sales,
          };
        }).filter(row => row.nome); // Only products with details
        setReportRows(rows);
      } catch (error) {
        setReportRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [dateRange, selectedEvent, events, produtos]);

  // Filter logic for table (search by product name)
  const filteredRows = reportRows.filter((row) =>
    row.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table columns (add Qtd. Vendida and Valor Total)
  const columns = [
    { id: "id_produto", label: "ID", minWidth: 50, sortable: true },
    { id: "nome", label: "Nome", minWidth: 180, sortable: true },
    {
      id: "category",
      label: "Categoria",
      minWidth: 120,
      sortable: true,
      format: (value: unknown) => {
        const category = value as Produto["category"];
        return (
          <Chip
            label={category?.name || "-"}
            size="small"
            color="primary"
            variant="outlined"
          />
        );
      },
    },
    {
      id: "quantidade",
      label: "Qtd. Vendida",
      minWidth: 100,
      align: "right" as const,
      sortable: true,
      format: (value: unknown) => value as number,
    },
    {
      id: "valor_total",
      label: "Valor Total",
      minWidth: 120,
      align: "right" as const,
      sortable: true,
      format: (value: unknown) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value as number),
    },
    {
      id: "preco_venda",
      label: "Preço de Venda",
      minWidth: 120,
      align: "right" as const,
      sortable: true,
      format: (value: unknown) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value as number),
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
      format: (value: unknown) => (
        <Chip
          label={value ? "Sim" : "Não"}
          color={value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      id: "unidade",
      label: "Unidade",
      minWidth: 120,
      sortable: true,
      format: (value: unknown) => {
        const unidade = value as Produto["unidade"];
        return unidade?.nome || "-";
      },
    },
  ];

  // Placeholder export handlers
  const handleExportCSV = () => {
    // To be implemented
  };
  const handleExportPDF = () => {
    // To be implemented
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, mb: 3 }} elevation={1}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Relatórios
        </Typography>
        <FiltersBar
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          events={events}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
        />
        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Procurar produto..."
            variant="outlined"
            size="small"
            sx={{ minWidth: 300 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DownloadIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <Button size="small" onClick={() => setSearchTerm("")}>Limpar</Button>
                </InputAdornment>
              ) : null,
            }}
          />
        </Box>
        {/* Step 4: RelatorioTable (DataTable) */}
        <DataTable
          columns={columns}
          data={filteredRows}
          keyExtractor={(row) => row.id_produto}
          isLoading={loading}
          title={undefined}
          searchable={false}
          pagination={true}
        />
      </Paper>
    </Container>
  );
};

export default RelatoriosPage; 