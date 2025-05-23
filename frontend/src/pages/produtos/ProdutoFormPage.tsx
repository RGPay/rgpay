import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Alert,
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
import unidadesService, { Unidade } from "../../services/unidades.service";
import categoriesService, { Category } from "../../services/categories.service";
import { Formik, Form } from "formik";
import { PhotoCamera, Delete as DeleteIcon } from "@mui/icons-material";

const validationSchema = Yup.object({
  nome: Yup.string().required("Nome é obrigatório"),
  preco_compra: Yup.number()
    .required("Preço de compra é obrigatório")
    .positive("Preço de compra deve ser positivo"),
  preco_venda: Yup.number()
    .required("Preço de venda é obrigatório")
    .positive("Preço de venda deve ser positivo"),
  category_id: Yup.number()
    .typeError("Categoria é obrigatória")
    .required("Categoria é obrigatória"),
  disponivel: Yup.boolean().required("Disponibilidade é obrigatória"),
  id_unidade: Yup.number().required("Unidade é obrigatória"),
  estoque: Yup.number()
    .required("Estoque é obrigatório")
    .min(0, "Estoque não pode ser negativo")
    .integer("Estoque deve ser um número inteiro"),
});

const ProdutoFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [initialValues, setInitialValues] = useState<
    Produto | CreateProdutoDto
  >({
    nome: "",
    preco_compra: 0,
    preco_venda: 0,
    category_id: 0,
    disponivel: true,
    id_unidade: 1,
    estoque: 0,
  });

  const [loading, setLoading] = useState(isEditMode);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [unidadesLoading, setUnidadesLoading] = useState(true);
  const [unidadesError, setUnidadesError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const unidadesData = await unidadesService.getAll();
        setUnidades(unidadesData);
      } catch (error) {
        setUnidadesError("Erro ao carregar unidades");
      } finally {
        setUnidadesLoading(false);
      }
    };
    fetchUnidades();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesService.getAll();
        setCategories(categoriesData);
      } catch (error) {
        setCategoriesError("Erro ao carregar categorias");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchProduto = async () => {
        try {
          const produto = await produtosService.getById(parseInt(id));
          setInitialValues({
            ...produto,
            category_id: Number(
              produto.category_id ??
                (produto.category ? produto.category.id : 0)
            ),
          });
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

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setToast({
          open: true,
          message: "Imagem muito grande. Máximo 5MB.",
          severity: "error",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setToast({
          open: true,
          message: "Apenas arquivos de imagem são permitidos.",
          severity: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("imagem", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const unidadeOptions = unidades.map((u) => ({
    value: u.id_unidade,
    label: u.nome,
  }));

  const formFields = [
    {
      name: "nome",
      label: "Nome do Produto",
      type: "text" as const,
      required: true,
      autoFocus: true,
    },
    {
      name: "preco_compra",
      label: "Preço de Compra",
      type: "number" as const,
      required: true,
    },
    {
      name: "preco_venda",
      label: "Preço de Venda",
      type: "number" as const,
      required: true,
    },
    {
      name: "category_id",
      label: "Categoria",
      type: "select" as const,
      required: true,
      options: categories.map((cat) => ({ value: cat.id, label: cat.name })),
      xs: 12,
      sm: 6,
    },
    {
      name: "disponivel",
      label: "Disponível",
      type: "checkbox" as const,
      xs: 12,
      sm: 6,
    },
    {
      name: "id_unidade",
      label: "Unidade",
      type: "select" as const,
      required: true,
      options: unidadeOptions,
      xs: 12,
      sm: 6,
    },
    {
      name: "estoque",
      label: "Estoque",
      type: "number" as const,
      required: true,
      xs: 12,
      sm: 6,
      min: 0,
    },
  ];

  if (
    loading ||
    unidadesLoading ||
    categoriesLoading ||
    (isEditMode && (!initialValues || !categories.length))
  ) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (unidadesError || categoriesError) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography color="error">
          {unidadesError || categoriesError}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditMode ? "Editar Produto" : "Novo Produto"}
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Formik
          key={JSON.stringify(initialValues)}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Imagem do Produto
                  </Typography>

                  {values.imagem ? (
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      <img
                        src={values.imagem}
                        alt="Pré-visualização"
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
                        onClick={() => setFieldValue("imagem", "")}
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
                        document.getElementById("image-upload")?.click()
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
                        Clique para selecionar uma imagem
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
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e, setFieldValue)}
                  />

                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoCamera />}
                      size="small"
                    >
                      Selecionar Imagem
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleImageUpload(e, setFieldValue)}
                      />
                    </Button>
                    {values.imagem && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        size="small"
                        onClick={() => setFieldValue("imagem", "")}
                      >
                        Remover
                      </Button>
                    )}
                  </Box>

                  {errors.imagem && touched.imagem && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {String(errors.imagem)}
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <FormikForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                fields={formFields}
                submitButtonText={isEditMode ? "Atualizar" : "Criar"}
                loading={loading || isSubmitting}
              />
            </Form>
          )}
        </Formik>
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
