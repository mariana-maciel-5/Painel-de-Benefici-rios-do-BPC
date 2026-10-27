import { apiClient } from '../../../lib/apiClient';
import type { BeneficiariosResponse, NovoBeneficiarioPayload } from '../types/beneficiario.types';

export const beneficiarioService = {
  async getBeneficiarios(): Promise<BeneficiariosResponse> {
    return apiClient<BeneficiariosResponse>('/api/beneficiarios', { method: 'GET' });
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
