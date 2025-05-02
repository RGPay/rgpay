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
import { useState } from "react";
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
} from "@mui/icons-material";

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
              initialValues={{ email: "", password: "" }}
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
                    loginAction({ token: data.access_token, user: data.user })
                  );
                  navigate("/");
                } catch (err: unknown) {
                  if (err instanceof AxiosError) {
                    setError(err.response?.data?.message || err.message);
                  } else if (err instanceof Error) {
                    setError(err.message);
                  } else {
                    setError("Erro desconhecido ao fazer login");
                  }
                } finally {
                  setLoading(false);
                }
              }}
            >
              {({ errors, touched, handleChange, handleBlur }) => (
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
                  {error && (
                    <Box
                      sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        borderLeft: `4px solid ${theme.palette.error.main}`,
                      }}
                    >
                      <Typography color="error.main" variant="body2">
                        {error}
                      </Typography>
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
