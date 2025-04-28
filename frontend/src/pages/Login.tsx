import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AxiosError } from "axios";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha é obrigatória"),
});

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={4} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2} align="center">
        Login
      </Typography>
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
            />
            <TextField
              fullWidth
              margin="normal"
              id="password"
              name="password"
              label="Senha"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={<ErrorMessage name="password" />}
            />
            {error && (
              <Typography color="error" mt={1} align="center">
                {error}
              </Typography>
            )}
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
