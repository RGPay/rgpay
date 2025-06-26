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
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  PhotoCamera,
  Delete as DeleteIcon,
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
  logo: Yup.string().optional(),
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
    logo: '',
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
        logo: maquineta.logo || '',
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
      
      console.log('Submitting maquineta form with values:', {
        numero_serie: values.numero_serie,
        status: values.status,
        id_unidade: values.id_unidade,
        logo: values.logo ? 'Logo presente (base64 data)' : 'Sem logo',
      });

      if (isEditing && id) {
        const updateData: UpdateMaquinetaData = {
          numero_serie: values.numero_serie,
          status: values.status,
          id_unidade: values.id_unidade,
          logo: values.logo,
        };
        console.log('Updating maquineta with ID:', id);
        await MaquinetasService.update(parseInt(id, 10), updateData);
      } else {
        console.log('Creating new maquineta');
        await MaquinetasService.create(values);
      }

      console.log('Maquineta saved successfully, navigating to list');
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

  const handleLogoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo muito grande. Máximo 5MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError('Apenas arquivos de imagem são permitidos.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("logo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
            {({ isSubmitting, errors, touched, values, setFieldValue }) => (
              <Form>
                {/* Logo Upload Section */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Logo da Maquineta
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Este logo será impresso nos cupons emitidos por esta maquineta
                    </Typography>

                    {values.logo ? (
                      <Box sx={{ position: "relative", display: "inline-block" }}>
                        <img
                          src={values.logo}
                          alt="Logo da maquineta"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            width: "100%",
                            height: "auto",
                            borderRadius: 8,
                            border: "2px solid #eee",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 1)",
                            },
                          }}
                          onClick={() => setFieldValue("logo", "")}
                          size="small"
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          border: "2px dashed #ccc",
                          borderRadius: 2,
                          p: 4,
                          textAlign: "center",
                          backgroundColor: "#fafafa",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: "primary.50",
                          },
                        }}
                        onClick={() =>
                          document.getElementById("logo-upload")?.click()
                        }
                      >
                        <PhotoCamera
                          sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                        />
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          gutterBottom
                        >
                          Clique para selecionar um logo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ou arraste e solte aqui
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1, display: "block" }}
                        >
                          Máximo 5MB • JPG, PNG, GIF
                        </Typography>
                      </Box>
                    )}

                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleLogoUpload(e, setFieldValue)}
                    />

                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<PhotoCamera />}
                        size="small"
                      >
                        Selecionar Logo
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => handleLogoUpload(e, setFieldValue)}
                        />
                      </Button>
                      {values.logo && (
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          size="small"
                          onClick={() => setFieldValue("logo", "")}
                        >
                          Remover
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>

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