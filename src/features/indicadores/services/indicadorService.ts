import { apiClient } from '../../../lib/apiClient';
import type { IndicadoresResponse, IndicadorAtualResponse, RecalcularResponse } from '../types/indicador.types';

export const indicadorService = {
  async getIndicadores(): Promise<IndicadoresResponse> {
    return apiClient<IndicadoresResponse>('/api/indicadores', { method: 'GET' });
  },

  async getIndicadorAtual(): Promise<IndicadorAtualResponse> {
    return apiClient<IndicadorAtualResponse>('/api/indicadores/atual', { method: 'GET' });
  },

  async recalcular(): Promise<RecalcularResponse> {
    return apiClient<RecalcularResponse>('/api/indicadores/recalcular', { method: 'POST' });
  },
};
