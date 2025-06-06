import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import MaquinetasService, { CreateMaquinetaData, UpdateMaquinetaData } from '../../services/maquinetas.service';
import UnidadesService, { Unidade } from '../../services/unidades.service';

const validationSchema = Yup.object({
  numero_serie: Yup.string().required('Número de série é obrigatório'),
  status: Yup.string().oneOf(['ativa', 'inativa']).required('Status é obrigatório'),
  id_unidade: Yup.number().required('Unidade é obrigatória').min(1, 'Selecione uma unidade válida'),
});

const MaquinetaFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const selectedUnidade = useSelector((state: RootState) => state.unidade.selectedUnidade);

  const [initialValues, setInitialValues] = useState<CreateMaquinetaData>({
    numero_serie: '',
    status: 'ativa',
    id_unidade: selectedUnidade || 0,
  });

  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unidadesLoading, setUnidadesLoading] = useState(true);

  useEffect(() => {
    loadUnidades();
    if (isEditing && id) {
      loadMaquineta(parseInt(id, 10));
    }
  }, [isEditing, id]);

  const loadUnidades = async () => {
    try {
      setUnidadesLoading(true);
      const data = await UnidadesService.getAll();
      setUnidades(data);
    } catch (err) {
      console.error('Erro ao carregar unidades:', err);
      setError('Erro ao carregar unidades. Tente novamente.');
    } finally {
      setUnidadesLoading(false);
    }
  };

  const loadMaquineta = async (maquinetaId: number) => {
    try {
      setLoading(true);
      const maquineta = await MaquinetasService.getById(maquinetaId);
      setInitialValues({
        numero_serie: maquineta.numero_serie,
        status: maquineta.status,
        id_unidade: maquineta.id_unidade,
      });
    } catch (err) {
      console.error('Erro ao carregar maquineta:', err);
      setError('Erro ao carregar maquineta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    values: CreateMaquinetaData,
    formikHelpers: FormikHelpers<CreateMaquinetaData>
  ) => {
    try {
      setError(null);

      if (isEditing && id) {
        const updateData: UpdateMaquinetaData = {
          numero_serie: values.numero_serie,
          status: values.status,
          id_unidade: values.id_unidade,
        };
        await MaquinetasService.update(parseInt(id, 10), updateData);
      } else {
        await MaquinetasService.create(values);
      }

      navigate('/maquinetas');
    } catch (err: any) {
      console.error('Erro ao salvar maquineta:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Erro ao salvar maquineta. Tente novamente.'
      );
      formikHelpers.setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/maquinetas');
  };

  if (loading || unidadesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {isEditing ? 'Editar Maquineta' : 'Nova Maquineta'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEditing ? 'Edite as informações da maquineta' : 'Adicione uma nova máquina de cartão'}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Field name="numero_serie">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Número de Série"
                          placeholder="Ex: 12345678"
                          helperText={
                            meta.touched && meta.error
                              ? meta.error
                              : "Número de série único da maquineta"
                          }
                          error={meta.touched && Boolean(meta.error)}
                        />
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field name="status">
                      {({ field, meta }: FieldProps) => (
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            {...field}
                            label="Status"
                            error={meta.touched && Boolean(meta.error)}
                          >
                            <MenuItem value="ativa">Ativa</MenuItem>
                            <MenuItem value="inativa">Inativa</MenuItem>
                          </Select>
                          {meta.touched && meta.error && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                              {meta.error}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field name="id_unidade">
                      {({ field, meta }: FieldProps) => (
                        <FormControl fullWidth>
                          <InputLabel>Unidade</InputLabel>
                          <Select
                            {...field}
                            label="Unidade"
                            error={meta.touched && Boolean(meta.error)}
                          >
                            {unidades.map((unidade) => (
                              <MenuItem key={unidade.id_unidade} value={unidade.id_unidade}>
                                {unidade.nome} - {unidade.cidade}, {unidade.estado}
                              </MenuItem>
                            ))}
                          </Select>
                          {meta.touched && meta.error && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                              {meta.error}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    </Field>
                  </Grid>
                </Grid>

                {/* Actions */}
                <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isSubmitting ? <CircularProgress size={16} /> : <SaveIcon />}
                    disabled={isSubmitting}
                    sx={{
                      background: 'linear-gradient(45deg, #3070FF 30%, #00E5E0 90%)',
                      boxShadow: '0 3px 5px 2px rgba(48, 112, 255, .3)',
                    }}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MaquinetaFormPage; 