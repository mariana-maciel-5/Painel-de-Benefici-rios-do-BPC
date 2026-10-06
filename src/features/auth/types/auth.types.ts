export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  papeis?: string[];
  permissoes?: string[];
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  usuario: AuthUser;
}

export interface MeResponse {
  success: boolean;
  usuario: AuthUser;
}
