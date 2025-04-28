import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../store';
import { useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
});

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={4} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2} align="center">Login</Typography>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          setError('');
          setLoading(true);
          try {
            const response = await fetch('http://localhost:3000/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: values.email, senha: values.password }),
            });
            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Erro ao fazer login');
            }
            const data = await response.json();
            dispatch(loginAction({ token: data.access_token, user: data.user }));
            navigate('/');
          } catch (err: any) {
            setError(err.message);
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
              <Typography color="error" mt={1} align="center">{error}</Typography>
            )}
            <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 2 }} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
} 