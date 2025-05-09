import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CategoriesService, { Category, CreateCategoryDto } from "../../services/categories.service";
import Toast from "../../components/Feedback/Toast";
import MainLayout from "../../components/Layout/MainLayout";

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
});

const CategoriesFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<CreateCategoryDto>({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      CategoriesService.getById(Number(id))
        .then((cat) => setInitialValues({ name: cat.name }))
        .catch(() => setError("Erro ao carregar categoria."))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (values: CreateCategoryDto) => {
    setLoading(true);
    try {
      if (isEdit && id) {
        await CategoriesService.update(Number(id), values);
        setSuccess("Categoria atualizada com sucesso.");
      } else {
        await CategoriesService.create(values);
        setSuccess("Categoria criada com sucesso.");
      }
      setTimeout(() => navigate("/categories"), 1000);
    } catch {
      setError("Erro ao salvar categoria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Box maxWidth={400} mx="auto" mt={4}>
        <Typography variant="h5" mb={2}>
          {isEdit ? "Editar Categoria" : "Nova Categoria"}
        </Typography>
        {loading && <CircularProgress />}
        {!loading && (
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={CategorySchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <Box mb={2}>
                  <Field
                    name="name"
                    as={"input"}
                    placeholder="Nome da categoria"
                    style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
                  />
                  {errors.name && touched.name && (
                    <Typography color="error" variant="caption">{errors.name}</Typography>
                  )}
                </Box>
                <Box display="flex" gap={2}>
                  <Button type="submit" variant="contained" color="primary">
                    Salvar
                  </Button>
                  <Button variant="outlined" onClick={() => navigate("/categories")}>Cancelar</Button>
                </Box>
              </Form>
            )}
          </Formik>
        )}
        <Toast open={!!error} severity="error" message={error || ""} onClose={() => setError(null)} />
        <Toast open={!!success} severity="success" message={success || ""} onClose={() => setSuccess(null)} />
      </Box>
    </MainLayout>
  );
};

export default CategoriesFormPage; 