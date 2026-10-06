export interface UsuarioItem {
  id: number;
  nome: string;
  email: string;
  papel: string;
  ativo: number | boolean;
  data_criacao: string;
}

export interface UsuariosResponse {
  success: boolean;
  data: UsuarioItem[];
  message?: string;
}
