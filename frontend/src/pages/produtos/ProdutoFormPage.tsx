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
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../components";
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
import { Formik, Form, Field, FieldProps } from "formik";
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
  imagem: Yup.string().optional(),
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
    imagem: "",
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
      } catch {
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
      } catch {
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
            imagem: produto.imagem || "",
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
    formikHelpers: FormikHelpers<Produto | CreateProdutoDto>
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
    setFieldValue: (field: string, value: string) => void
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
              {/* Image Upload Section */}
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

              {/* Form Fields */}
              <Grid container spacing={2}>
                {/* Nome */}
                <Grid item xs={12}>
                  <Field name="nome">
                    {({ field, meta }: FieldProps) => (
                      <TextField
                        {...field}
                        label="Nome do Produto"
                        fullWidth
                        required
                        autoFocus
                        size="small"
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                      />
                    )}
                  </Field>
                </Grid>

                {/* Preço de Compra */}
                <Grid item xs={12} sm={6}>
                  <Field name="preco_compra">
                    {({ field, meta }: FieldProps) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Preço de Compra"
                        fullWidth
                        required
                        size="small"
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                      />
                    )}
                  </Field>
                </Grid>

                {/* Preço de Venda */}
                <Grid item xs={12} sm={6}>
                  <Field name="preco_venda">
                    {({ field, meta }: FieldProps) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Preço de Venda"
                        fullWidth
                        required
                        size="small"
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                      />
                    )}
                  </Field>
                </Grid>

                {/* Categoria */}
                <Grid item xs={12} sm={6}>
                  <Field name="category_id">
                    {({ field, meta }: FieldProps) => (
                      <TextField
                        {...field}
                        select
                        label="Categoria"
                        fullWidth
                        required
                        size="small"
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Field>
                </Grid>

                {/* Unidade */}
                <Grid item xs={12} sm={6}>
                  <Field name="id_unidade">
                    {({ field, meta }: FieldProps) => (
                      <TextField
                        {...field}
                        select
                        label="Unidade"
                        fullWidth
                        required
                        size="small"
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                      >
                        {unidades.map((unidade) => (
                          <MenuItem
                            key={unidade.id_unidade}
                            value={unidade.id_unidade}
                          >
                            {unidade.nome}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Field>
                </Grid>

                {/* Estoque */}
                <Grid item xs={12} sm={6}>
                  <Field name="estoque">
                    {({ field, meta }: FieldProps) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Estoque"
                        fullWidth
                        required
                        size="small"
                        inputProps={{ min: 0 }}
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                      />
                    )}
                  </Field>
                </Grid>

                {/* Disponível */}
                <Grid item xs={12} sm={6}>
                  <Field name="disponivel">
                    {({ field }: FieldProps) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Disponível"
                      />
                    )}
                  </Field>
                </Grid>

                {/* Submit Buttons */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 2,
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : null
                      }
                    >
                      {isEditMode ? "Atualizar" : "Criar"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
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
