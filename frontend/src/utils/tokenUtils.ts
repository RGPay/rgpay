import { jwtDecode } from 'jwt-decode';

export interface TokenPayload {
  exp: number;
  sub: number;
  email: string;
  tipo_usuario: string;
  id_unidade: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export const shouldRefreshToken = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    // Refresh if token expires in the next 5 minutes
    return decoded.exp - currentTime < 300;
  } catch {
    return true;
  }
}; 