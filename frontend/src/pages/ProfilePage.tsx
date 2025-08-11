import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Toast } from "../components";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Nome é obrigatório"),
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
});

interface ProfileFormValues {
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleSubmit = async (values: ProfileFormValues) => {
    try {
      // Here you would call an API to update user profile
      // await userService.updateProfile(values);
      console.log("Profile update values:", values);

      setToast({
        open: true,
        message: "Perfil atualizado com sucesso",
        severity: "success",
      });
      setIsEditing(false);
    } catch {
      setToast({
        open: true,
        message: "Erro ao atualizar perfil",
        severity: "error",
      });
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setToast({
          open: true,
          message: "Imagem muito grande. Máximo 2MB.",
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
        // Here you would update the user avatar
        // dispatch(updateUserAvatar(reader.result as string));
        setToast({
          open: true,
          message: "Avatar atualizado com sucesso",
          severity: "success",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const initialValues: ProfileFormValues = {
    name: user?.name || "",
    email: user?.email || "",
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Meu Perfil
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Box
                sx={{ position: "relative", display: "inline-block", mb: 2 }}
              >
                <Avatar
                  alt={user?.name || "User"}
                  src={user?.avatar || ""}
                  sx={{
                    width: 120,
                    height: 120,
                    background:
                      "linear-gradient(45deg, #3070FF 30%, #00E5E0 90%)",
                    fontSize: "3rem",
                    mx: "auto",
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                  component="label"
                  size="small"
                >
                  <PhotoCamera fontSize="small" />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarUpload}
                  />
                </IconButton>
              </Box>

              <Typography variant="h6" gutterBottom>
                {user?.name || "Usuário"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email || "usuario@exemplo.com"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                Membro desde: {new Date().toLocaleDateString("pt-BR")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6">Informações Pessoais</Typography>
                {!isEditing && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                )}
              </Box>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="name"
                          label="Nome Completo"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                          disabled={!isEditing}
                          variant={isEditing ? "outlined" : "filled"}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="email"
                          label="Email"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          disabled={!isEditing}
                          variant={isEditing ? "outlined" : "filled"}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="role"
                          label="Função"
                          value="Administrador"
                          disabled
                          variant="filled"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="lastLogin"
                          label="Último Acesso"
                          value={new Date().toLocaleString("pt-BR")}
                          disabled
                          variant="filled"
                        />
                      </Grid>
                    </Grid>

                    {isEditing && (
                      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<SaveIcon />}
                          disabled={isSubmitting}
                        >
                          Salvar
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => setIsEditing(false)}
                        >
                          Cancelar
                        </Button>
                      </Box>
                    )}
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Segurança
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button variant="outlined" fullWidth sx={{ py: 1.5 }}>
                    Alterar Senha
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Configurar 2FA
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />
    </Box>
  );
};

export default ProfilePage;
