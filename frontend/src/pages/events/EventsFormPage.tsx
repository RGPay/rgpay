import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { FormikForm, Toast } from "../../components";
import * as Yup from "yup";
import eventosService, {
  Evento,
  CreateEventoDto,
  UpdateEventoDto,
} from "../../services/eventos.service";
import unidadesService, { Unidade } from "../../services/unidades.service";
import { FormikHelpers } from "formik";
import { FormikFieldConfig } from "../../components/Form/FormikForm";
import { format, isValid } from "date-fns";

const validationSchema = Yup.object({
  nome: Yup.string().required("Nome é obrigatório"),
  descricao: Yup.string().required("Descrição é obrigatória"),
  data_inicio: Yup.string()
    .required("Data de início é obrigatória")
    .test("valid-date", "Data de início inválida", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return isValid(date);
    }),
  data_fim: Yup.string()
    .required("Data de fim é obrigatória")
    .test("valid-date", "Data de fim inválida", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return isValid(date);
    })
    .test(
      "date-after-start",
      "Data de fim deve ser posterior à data de início",
      function (value) {
        const { data_inicio } = this.parent;
        if (!value || !data_inicio) return true;
        const startDate = new Date(data_inicio);
        const endDate = new Date(value);
        return endDate >= startDate;
      }
    ),
  id_unidade: Yup.number().required("Unidade é obrigatória"),
});

// Helper function to format date for input
const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isValid(date)) {
      return format(date, "yyyy-MM-dd");
    }
  } catch {
    console.warn("Error formatting date");
  }
  return "";
};

// Helper function to format date for API
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isValid(date)) {
      return date.toISOString();
    }
  } catch {
    console.warn("Error formatting date for API");
  }
  return dateString;
};

const EventsFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [initialValues, setInitialValues] = useState<
    Partial<Evento> | CreateEventoDto
  >({
    nome: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    id_unidade: 1,
  });
  const [loading, setLoading] = useState(isEditMode);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const data = await unidadesService.getAll();
        setUnidades(data);
      } catch (error) {
        setToast({
          open: true,
          message: "Erro ao carregar unidades",
          severity: "error",
        });
      }
    };
    fetchUnidades();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchEvento = async () => {
        try {
          const evento = await eventosService.getById(parseInt(id));
          // Format dates for form inputs
          const formattedEvento = {
            ...evento,
            data_inicio: formatDateForInput(evento.data_inicio || ""),
            data_fim: formatDateForInput(evento.data_fim || ""),
          };
          setInitialValues(formattedEvento);
        } catch {
          setToast({
            open: true,
            message: "Erro ao carregar dados do evento",
            severity: "error",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchEvento();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (
    values: CreateEventoDto | UpdateEventoDto,
    formikHelpers: FormikHelpers<any>
  ) => {
    try {
      // Format dates for API submission
      const formattedValues = {
        ...values,
        data_inicio: formatDateForAPI(values.data_inicio),
        data_fim: formatDateForAPI(values.data_fim),
      };

      if (isEditMode && id) {
        await eventosService.update(parseInt(id), formattedValues);
        setToast({
          open: true,
          message: "Evento atualizado com sucesso",
          severity: "success",
        });
      } else {
        await eventosService.create(formattedValues as CreateEventoDto);
        setToast({
          open: true,
          message: "Evento criado com sucesso",
          severity: "success",
        });
      }
      setTimeout(() => {
        navigate("/eventos");
      }, 1500);
    } catch {
      setToast({
        open: true,
        message: `Erro ao ${isEditMode ? "atualizar" : "criar"} evento`,
        severity: "error",
      });
      formikHelpers.setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/eventos");
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const unidadeOptions = unidades.map((u) => ({
    value: u.id_unidade,
    label: u.nome,
  }));

  const formFields: FormikFieldConfig[] = [
    {
      name: "nome",
      label: "Nome do Evento",
      type: "text",
      required: true,
      autoFocus: true,
    },
    { name: "descricao", label: "Descrição", type: "textarea", required: true },
    {
      name: "data_inicio",
      label: "Data de Início",
      type: "date",
      required: true,
    },
    { name: "data_fim", label: "Data de Fim", type: "date", required: true },
    {
      name: "id_unidade",
      label: "Unidade",
      type: "select",
      required: true,
      options: unidadeOptions,
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditMode ? "Editar Evento" : "Novo Evento"}
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <FormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          fields={formFields}
          submitButtonText={isEditMode ? "Atualizar" : "Criar"}
          loading={loading}
        />
      </Paper>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />
    </Box>
  );
};

export default EventsFormPage;
