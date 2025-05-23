import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  alpha,
  useTheme,
  CircularProgress,
  Card,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AxiosError } from "axios";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowForward as ArrowForwardIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { AutoLoginCheckbox } from "../components/Inputs";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha é obrigatória"),
});

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    // Auto-login if credentials are stored in localStorage or sessionStorage
    let token = localStorage.getItem("token");
    let refreshToken = localStorage.getItem("refresh_token");
    let user = localStorage.getItem("user");
    if (!(token && refreshToken && user)) {
      token = sessionStorage.getItem("token");
      refreshToken = sessionStorage.getItem("refresh_token");
      user = sessionStorage.getItem("user");
    }
    if (token && refreshToken && user) {
      dispatch(loginAction({ token, refreshToken, user: JSON.parse(user) }));
      navigate("/");
    }
  }, [dispatch, navigate]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        p: { xs: 2, sm: 3 },
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.dark,
          0.2
        )} 0%, ${alpha(theme.palette.secondary.dark, 0.2)} 100%)`,
      }}
    >
      {/* Light effects */}
      <Box
        sx={{
          position: "absolute",
          width: "30vh",
          height: "30vh",
          borderRadius: "50%",
          background: alpha(theme.palette.primary.main, 0.2),
          filter: "blur(80px)",
          top: "20%",
          left: "15%",
          transform: "translateX(-50%)",
          zIndex: 0,
          animation: "pulse 8s ease-in-out infinite alternate",
          "@keyframes pulse": {
            "0%": { opacity: 0.5, transform: "scale(1) translateX(-50%)" },
            "100%": { opacity: 0.8, transform: "scale(1.2) translateX(-50%)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "35vh",
          height: "35vh",
          borderRadius: "50%",
          background: alpha(theme.palette.secondary.main, 0.15),
          filter: "blur(80px)",
          bottom: "10%",
          right: "0%",
          zIndex: 0,
          animation: "pulse2 10s ease-in-out infinite alternate",
          "@keyframes pulse2": {
            "0%": { opacity: 0.5, transform: "scale(1)" },
            "100%": { opacity: 0.8, transform: "scale(1.3)" },
          },
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Card
          sx={{
            backdropFilter: "blur(10px)",
            background: alpha(theme.palette.background.paper, 0.8),
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            transition:
              "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 15px 50px rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 5 },
              pb: { xs: 4, md: 6 },
            }}
          >
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 0.5,
                  fontWeight: 700,
                  background:
                    "linear-gradient(45deg, #3070FF 30%, #00E5E0 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                RGPay
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Faça login para acessar o sistema
              </Typography>
            </Box>

            <Formik
              initialValues={{ email: "", password: "", autoLogin: false }}
              validationSchema={LoginSchema}
              onSubmit={async (values) => {
                setError("");
                setLoading(true);
                try {
                  const response = await api.post("/auth/login", {
                    email: values.email,
                    senha: values.password,
                  });
                  const data = response.data;
                  dispatch(
                    loginAction({
                      token: data.access_token,
                      refreshToken: data.refresh_token,
                      user: data.user,
                    })
                  );
                  if (values.autoLogin) {
                    localStorage.setItem("token", data.access_token);
                    localStorage.setItem("refresh_token", data.refresh_token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                  } else {
                    sessionStorage.setItem("token", data.access_token);
                    sessionStorage.setItem("refresh_token", data.refresh_token);
                    sessionStorage.setItem("user", JSON.stringify(data.user));
                  }
                  navigate("/");
                } catch (err: unknown) {
                  let errorMessage = "Erro desconhecido ao fazer login";

                  if (err instanceof AxiosError) {
                    const status = err.response?.status;
                    const serverMessage = err.response?.data?.message;

                    switch (status) {
                      case 401:
                        errorMessage =
                          "Email ou senha incorretos. Verifique suas credenciais e tente novamente.";
                        break;
                      case 403:
                        errorMessage =
                          "Acesso negado. Sua conta pode estar bloqueada ou inativa.";
                        break;
                      case 429:
                        errorMessage =
                          "Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.";
                        break;
                      case 500:
                        errorMessage =
                          "Erro interno do servidor. Tente novamente em alguns instantes.";
                        break;
                      case 503:
                        errorMessage =
                          "Serviço temporariamente indisponível. Tente novamente mais tarde.";
                        break;
                      default:
                        errorMessage =
                          serverMessage || err.message || errorMessage;
                    }
                  } else if (err instanceof Error) {
                    errorMessage = err.message;
                  }

                  setError(errorMessage);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form>
                  <TextField
                    fullWidth
                    margin="normal"
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={<ErrorMessage name="email" />}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: alpha(theme.palette.background.paper, 0.6),
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    id="password"
                    name="password"
                    label="Senha"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={<ErrorMessage name="password" />}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: alpha(theme.palette.background.paper, 0.6),
                      },
                    }}
                  />
                  <Box sx={{ mb: 2 }}>
                    <AutoLoginCheckbox name="autoLogin" label="Manter logado" />
                    <Typography
                      variant="caption"
                      color="warning.main"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      Não use a opção "Manter logado" em computadores públicos
                      ou compartilhados.
                    </Typography>
                  </Box>
                  {error && (
                    <Box
                      sx={{
                        p: 2.5,
                        mb: 3,
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.error.main, 0.08),
                        borderLeft: `4px solid ${theme.palette.error.main}`,
                        border: `1px solid ${alpha(
                          theme.palette.error.main,
                          0.2
                        )}`,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        animation: "slideIn 0.3s ease-out",
                        "@keyframes slideIn": {
                          "0%": {
                            opacity: 0,
                            transform: "translateY(-10px)",
                          },
                          "100%": {
                            opacity: 1,
                            transform: "translateY(0)",
                          },
                        },
                      }}
                    >
                      <ErrorIcon
                        sx={{
                          color: theme.palette.error.main,
                          fontSize: 20,
                          mt: 0.1,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          color="error.main"
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            lineHeight: 1.4,
                          }}
                        >
                          {error}
                        </Typography>
                        {error.includes("Email ou senha incorretos") && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.text.secondary,
                              mt: 0.5,
                              display: "block",
                            }}
                          >
                            Dica: Verifique se o Caps Lock está ativado
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={loading}
                    size="large"
                    endIcon={loading ? undefined : <ArrowForwardIcon />}
                    sx={{
                      mt: 1,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                      boxShadow: `0 4px 20px ${alpha(
                        theme.palette.primary.main,
                        0.4
                      )}`,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 8px 30px ${alpha(
                          theme.palette.primary.main,
                          0.6
                        )}`,
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
