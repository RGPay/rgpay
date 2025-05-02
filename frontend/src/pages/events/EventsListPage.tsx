import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataTable, Toast, ConfirmDialog } from "../../components";
import eventosService, { Evento } from "../../services/eventos.service";

const EventsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await eventosService.getAll();
      setEvents(response);
    } catch (error) {
      setToast({
        open: true,
        message: "Erro ao carregar eventos. Tente novamente.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateEvent = () => {
    navigate("/eventos/novo");
  };

  const handleEditEvent = (event: Evento) => {
    navigate(`/eventos/editar/${event.id_evento}`);
  };

  const handleDeleteConfirm = (event: Evento) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      await eventosService.delete(selectedEvent.id_evento);
      setToast({
        open: true,
        message: "Evento excluído com sucesso",
        severity: "success",
      });
      loadEvents();
    } catch (error) {
      setToast({
        open: true,
        message: "Erro ao excluir evento",
        severity: "error",
      });
    } finally {
      setDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const columns = [
    { id: "id_evento", label: "ID", minWidth: 50 },
    { id: "nome", label: "Nome", minWidth: 180 },
    { id: "descricao", label: "Descrição", minWidth: 200 },
    { id: "data_inicio", label: "Início", minWidth: 120 },
    { id: "data_fim", label: "Fim", minWidth: 120 },
    { id: "id_unidade", label: "Unidade", minWidth: 80 },
  ];

  const actions = [
    {
      icon: <EditIcon />,
      tooltip: "Editar",
      onClick: handleEditEvent,
    },
    {
      icon: <DeleteIcon />,
      tooltip: "Excluir",
      onClick: handleDeleteConfirm,
      color: "error" as const,
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" component="h1">
          Eventos
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateEvent}>
          Novo Evento
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <DataTable
        columns={columns}
        data={events}
        title="Lista de Eventos"
        keyExtractor={(item) => item.id_evento}
        actions={actions}
        onRowClick={handleEditEvent}
        isLoading={loading}
        onRefresh={loadEvents}
      />
      <ConfirmDialog
        open={dialogOpen}
        title="Excluir Evento"
        message={`Tem certeza que deseja excluir o evento "${selectedEvent?.nome}"? Esta ação não poderá ser desfeita.`}
        onConfirm={handleDeleteEvent}
        onCancel={() => setDialogOpen(false)}
      />
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />
    </Box>
  );
};

export default EventsListPage; 