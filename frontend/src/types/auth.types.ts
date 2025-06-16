export interface User {
  id_usuario: number;
  nome: string;
  email: string;
  tipo_usuario: 'master' | 'gerente';
  id_unidade: number;
  sub?: number; // JWT subject (typically same as id_usuario)
  name?: string; // alias for nome
  avatar?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
} 