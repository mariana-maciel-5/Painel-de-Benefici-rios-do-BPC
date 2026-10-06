import { apiClient } from '../../../lib/apiClient';
import type { UsuariosResponse } from '../types/usuario.types';

export const usuarioService = {
  async getUsuarios(): Promise<UsuariosResponse> {
    return apiClient<UsuariosResponse>('/api/usuarios', { method: 'GET' });
  },
};
