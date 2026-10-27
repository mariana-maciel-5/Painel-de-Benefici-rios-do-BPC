import { apiClient } from '../../../lib/apiClient';
import type { 
  IndicadoresResponse, 
  PaineisResponse, 
  NovoIndicadorPayload 
} from '../types/indicador.types';

export const indicadorService = {
  async getIndicadores(painelId?: number): Promise<IndicadoresResponse> {
    const query = painelId ? `?painelId=${painelId}` : '';
    return apiClient<IndicadoresResponse>(`/api/indicadores${query}`, { method: 'GET' });
  },

  async getPaineis(): Promise<PaineisResponse> {
    return apiClient<PaineisResponse>('/api/paineis', { method: 'GET' });
  },

  async cadastrar(payload: NovoIndicadorPayload): Promise<{ success: boolean; message: string; id?: number }> {
    return apiClient('/api/indicadores', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async excluir(id: number): Promise<{ success: boolean; message: string }> {
    return apiClient(`/api/indicadores/${id}`, {
      method: 'DELETE',
    });
  },

  async sincronizar(): Promise<{ success: boolean; message: string }> {
    return apiClient('/api/indicadores/sincronizar', {
      method: 'POST',
    });
  },
};
