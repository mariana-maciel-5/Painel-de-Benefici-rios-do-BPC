import { apiClient } from '../../../lib/apiClient';
import type { PapeisResponse } from '../types/papel.types';

export const papelService = {
  async getPapeis(): Promise<PapeisResponse> {
    return apiClient<PapeisResponse>('/api/papeis', { method: 'GET' });
  },
};
