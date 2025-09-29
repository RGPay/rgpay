import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Divider } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import * as Yup from "yup";
import { FormikForm, Toast } from "../../components";
import unidadesService, {
  Unidade,
  CreateUnidadeDto,
  UpdateUnidadeDto,
} from "../../services/unidades.service";

// Form validation schema
const validationSchema = Yup.object({
  nome: Yup.string().required("O nome da unidade é obrigatório"),
  tipo: Yup.mixed<'casa_show' | 'bar' | 'restaurante'>()
    .oneOf(['casa_show', 'bar', 'restaurante'], 'Selecione um tipo válido')
    .required('O tipo da unidade é obrigatório'),
  cnpj: Yup.string().optional(),
  cidade: Yup.string().required("A cidade da unidade é obrigatória"),
  estado: Yup.string().required("O estado da unidade é obrigatório"),
  endereco: Yup.string().required("O endereço da unidade é obrigatório"),
});

const UnidadeFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [unidade, setUnidade] = useState<Unidade | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const isEditing = !!id;

  useEffect(() => {
    const fetchUnidade = async () => {
      if (!isEditing) return;

      setInitialLoading(true);
      try {
        const data = await unidadesService.getById(parseInt(id, 10));
        setUnidade(data);
      } catch (error) {
        console.error("Error loading unit:", error);
        setToast({
          open: true,
          message: "Erro ao carregar dados da unidade",
          severity: "error",
        });
        navigate("/unidades");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUnidade();
  }, [id, isEditing, navigate]);

  const handleSubmit = async (values: CreateUnidadeDto | UpdateUnidadeDto) => {
    setLoading(true);
    try {
      if (isEditing) {
        await unidadesService.update(parseInt(id, 10), values);
        setToast({
          open: true,
          message: "Unidade atualizada com sucesso",
          severity: "success",
        });
      } else {
        await unidadesService.create(values as CreateUnidadeDto);
        setToast({
          open: true,
          message: "Unidade criada com sucesso",
          severity: "success",
        });
      }
      navigate("/unidades");
    } catch (error) {
      console.error("Error saving unit:", error);
      setToast({
        open: true,
        message: `Erro ao ${isEditing ? "atualizar" : "criar"} unidade`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/unidades");
  };

  const initialValues = {
    nome: unidade?.nome || "",
    tipo: unidade?.tipo || "",
    cnpj: unidade?.cnpj || "",
    cidade: unidade?.cidade || "",
    estado: unidade?.estado || "",
    endereco: unidade?.endereco || "",
  };

  const formFields = [
    {
      name: "nome",
      label: "Nome da Unidade",
      type: "text" as const,
      required: true,
      fullWidth: true,
      xs: 12,
    },
    {
      name: "tipo",
      label: "Tipo",
      type: "select" as const,
      required: true,
      fullWidth: true,
      xs: 12,
      md: 6,
      options: [
        { value: 'casa_show', label: 'Casa de Show' },
        { value: 'bar', label: 'Bar' },
        { value: 'restaurante', label: 'Restaurante' },
      ],
    },
    {
      name: "cnpj",
      label: "CNPJ",
      type: "text" as const,
      required: false,
      fullWidth: true,
      xs: 12,
      md: 6,
    },
    {
      name: "endereco",
      label: "Endereço",
      type: "text" as const,
      required: true,
      fullWidth: true,
      xs: 12,
    },
    {
      name: "cidade",
      label: "Cidade",
      type: "text" as const,
      required: true,
      fullWidth: true,
      xs: 12,
      md: 6,
    },
    {
      name: "estado",
      label: "Estado",
      type: "text" as const,
      required: true,
      fullWidth: true,
      xs: 12,
      md: 6,
    },
  ];

  if (initialLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Carregando dados da unidade...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            sx={{ mr: 2 }}
          >
            Voltar
          </Button>
          <Typography variant="h5" component="h1">
            {isEditing ? "Editar Unidade" : "Nova Unidade"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <FormikForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        fields={formFields}
        submitButtonText={isEditing ? "Atualizar Unidade" : "Criar Unidade"}
        loading={loading}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
};

export default UnidadeFormPage;
