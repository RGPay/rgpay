import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import * as Yup from "yup";
import { FormikForm, Toast } from "../../components";
import CategoriesService, {
  CreateCategoryDto,
} from "../../services/categories.service";
import { FormikHelpers } from "formik";

const validationSchema = Yup.object({
  name: Yup.string().required("Nome é obrigatório"),
});

const CategoriesFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<CreateCategoryDto>({
    name: "",
  });
  const [loading, setLoading] = useState(isEdit);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      CategoriesService.getById(Number(id))
        .then((cat) => setInitialValues({ name: cat.name }))
        .catch(() => setError("Erro ao carregar categoria."))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (
    values: CreateCategoryDto,
    formikHelpers: FormikHelpers<CreateCategoryDto>
  ) => {
    try {
      if (isEdit && id) {
        await CategoriesService.update(Number(id), values);
        setToast({
          open: true,
          message: "Categoria atualizada com sucesso.",
          severity: "success",
        });
      } else {
        await CategoriesService.create(values);
        setToast({
          open: true,
          message: "Categoria criada com sucesso.",
          severity: "success",
        });
      }
      setTimeout(() => navigate("/categories"), 1500);
    } catch {
      setToast({
        open: true,
        message: `Erro ao ${isEdit ? "atualizar" : "criar"} categoria`,
        severity: "error",
      });
      formikHelpers.setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/categories");
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const formFields = [
    {
      name: "name",
      label: "Nome da Categoria",
      type: "text" as const,
      required: true,
      autoFocus: true,
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEdit ? "Editar Categoria" : "Nova Categoria"}
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <FormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          fields={formFields}
          submitButtonText={isEdit ? "Atualizar" : "Criar"}
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

export default CategoriesFormPage;
