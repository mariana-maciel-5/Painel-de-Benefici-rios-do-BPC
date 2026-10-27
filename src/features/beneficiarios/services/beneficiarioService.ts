import { apiClient } from '../../../lib/apiClient';
import type { BeneficiariosResponse, NovoBeneficiarioPayload, BeneficiarioFilterParams } from '../types/beneficiario.types';

export const beneficiarioService = {
  async getBeneficiarios(filters?: BeneficiarioFilterParams): Promise<BeneficiariosResponse> {
    const params = new URLSearchParams();
    if (filters?.bairro && filters.bairro !== 'todos') {
      params.append('bairro', filters.bairro);
    }
    if (filters?.data_inicio) {
      params.append('data_inicio', filters.data_inicio);
    }
    if (filters?.data_fim) {
      params.append('data_fim', filters.data_fim);
    }
    if (filters?.ativo && filters.ativo !== 'todos') {
      params.append('ativo', filters.ativo);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient<BeneficiariosResponse>(`/api/beneficiarios${query}`, { method: 'GET' });
  },

  async cadastrarBeneficiario(payload: NovoBeneficiarioPayload): Promise<{ success: boolean; message: string; id?: number }> {
    return apiClient('/api/beneficiarios', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async toggleStatus(id: number): Promise<{ success: boolean; message: string }> {
    return apiClient(`/api/beneficiarios/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },
};
