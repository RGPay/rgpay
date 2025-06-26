import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Memory as MemoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import MaquinetasService, { Maquineta } from '../../services/maquinetas.service';

const MaquinetasListPage: React.FC = () => {
  const navigate = useNavigate();
  const selectedUnidade = useSelector((state: RootState) => state.unidade.selectedUnidade);
  
  const [maquinetas, setMaquinetas] = useState<Maquineta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [maquinetaToDelete, setMaquinetaToDelete] = useState<Maquineta | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadMaquinetas();
  }, [selectedUnidade]);

  // Reload when component mounts (useful when returning from form)
  useEffect(() => {
    loadMaquinetas();
  }, []);

  const loadMaquinetas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MaquinetasService.getAll(selectedUnidade || undefined);
      setMaquinetas(data);
    } catch (err) {
      console.error('Erro ao carregar maquinetas:', err);
      setError('Erro ao carregar maquinetas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!maquinetaToDelete) return;

    try {
      setDeleting(true);
      await MaquinetasService.delete(maquinetaToDelete.id_maquineta);
      setMaquinetas(prev => prev.filter(m => m.id_maquineta !== maquinetaToDelete.id_maquineta));
      setDeleteDialogOpen(false);
      setMaquinetaToDelete(null);
    } catch (err) {
      console.error('Erro ao excluir maquineta:', err);
      setError('Erro ao excluir maquineta. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteDialog = (maquineta: Maquineta) => {
    setMaquinetaToDelete(maquineta);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setMaquinetaToDelete(null);
  };

  const getStatusColor = (status: string) => {
    return status === 'ativa' ? 'success' : 'default';
  };

  const getStatusLabel = (status: string) => {
    return status === 'ativa' ? 'Ativa' : 'Inativa';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Maquinetas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie as máquinas de cartão da sua unidade
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/maquinetas/nova')}
          sx={{
            background: 'linear-gradient(45deg, #3070FF 30%, #00E5E0 90%)',
            boxShadow: '0 3px 5px 2px rgba(48, 112, 255, .3)',
          }}
        >
          Nova Maquineta
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Maquinetas Table */}
      <Card>
        <CardContent>
          {maquinetas.length === 0 ? (
            <Box textAlign="center" py={4}>
              <MemoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhuma maquineta encontrada
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Comece adicionando sua primeira maquineta
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/maquinetas/nova')}
              >
                Adicionar Maquineta
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Número de Série</TableCell>
                    <TableCell>Logo</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Unidade</TableCell>
                    <TableCell>Data de Criação</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maquinetas.map((maquineta) => (
                    <TableRow key={maquineta.id_maquineta} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {maquineta.numero_serie}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {maquineta.logo ? (
                          <img
                            src={maquineta.logo}
                            alt="Logo"
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid #eee'
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sem logo
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(maquineta.status)}
                          color={getStatusColor(maquineta.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {maquineta.unidade?.nome || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {maquineta.unidade?.cidade}, {maquineta.unidade?.estado}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(maquineta.createdAt).toLocaleDateString('pt-BR')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/maquinetas/editar/${maquineta.id_maquineta}`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openDeleteDialog(maquineta)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a maquineta{' '}
            <strong>{maquinetaToDelete?.numero_serie}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaquinetasListPage; 