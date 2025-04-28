import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { FormikForm, Toast } from "../../components";
import * as Yup from "yup";
import {
  produtosService,
  Produto,
  CreateProdutoDto,
  UpdateProdutoDto,
} from "../../services/produtos.service";
import { FormikHelpers } from "formik";

const validationSchema = Yup.object({
  nome: Yup.string().required("Nome é obrigatório"),
  preco: Yup.number()
    .required("Preço é obrigatório")
    .positive("Preço deve ser positivo"),
  categoria: Yup.string().required("Categoria é obrigatória"),
  disponivel: Yup.boolean().required("Disponibilidade é obrigatória"),
  id_unidade: Yup.number().required("Unidade é obrigatória"),
});

const ProdutoFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [initialValues, setInitialValues] = useState<
    Produto | CreateProdutoDto
  >({
    nome: "",
    preco: 0,
    categoria: "",
    disponivel: true,
    id_unidade: 1, // Default value, should be replaced with actual data
  });

  const [loading, setLoading] = useState(isEditMode);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchProduto = async () => {
        try {
          const produto = await produtosService.getById(parseInt(id));
          setInitialValues(produto);
        } catch (error) {
          console.error("Error fetching product:", error);
          setToast({
            open: true,
            message: "Erro ao carregar dados do produto",
            severity: "error",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchProduto();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (
    values: CreateProdutoDto | UpdateProdutoDto,
    formikHelpers: FormikHelpers<any>
  ) => {
    try {
      if (isEditMode && id) {
        await produtosService.update(parseInt(id), values);
        setToast({
          open: true,
          message: "Produto atualizado com sucesso",
          severity: "success",
        });
      } else {
        await produtosService.create(values as CreateProdutoDto);
        setToast({
          open: true,
          message: "Produto criado com sucesso",
          severity: "success",
        });
      }

      setTimeout(() => {
        navigate("/produtos");
      }, 1500);
    } catch (error) {
      console.error("Error saving product:", error);
      setToast({
        open: true,
        message: `Erro ao ${isEditMode ? "atualizar" : "criar"} produto`,
        severity: "error",
      });
      formikHelpers.setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/produtos");
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const formFields = [
    {
      name: "nome",
      label: "Nome do Produto",
      type: "text",
      required: true,
      autoFocus: true,
    },
    {
      name: "preco",
      label: "Preço",
      type: "number",
      required: true,
    },
    {
      name: "categoria",
      label: "Categoria",
      type: "select",
      required: true,
      options: [
        { value: "Bebidas", label: "Bebidas" },
        { value: "Comidas", label: "Comidas" },
        { value: "Sobremesas", label: "Sobremesas" },
      ],
      xs: 12,
      sm: 6,
    },
    {
      name: "disponivel",
      label: "Disponível",
      type: "checkbox",
      xs: 12,
      sm: 6,
    },
    {
      name: "id_unidade",
      label: "Unidade",
      type: "select",
      required: true,
      options: [
        { value: 1, label: "Unidade 1" },
        { value: 2, label: "Unidade 2" },
      ],
      xs: 12,
      sm: 6,
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
        {isEditMode ? "Editar Produto" : "Novo Produto"}
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

export default ProdutoFormPage;
