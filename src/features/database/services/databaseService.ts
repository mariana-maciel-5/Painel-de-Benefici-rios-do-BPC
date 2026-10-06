import { apiClient } from '../../../lib/apiClient';
import type { HealthResponse, DatabaseStatus } from '../types/database.types';

export const databaseService = {
  async getHealth(): Promise<HealthResponse> {
    return apiClient<HealthResponse>('/api/health', { method: 'GET' });
  },

  async initDatabase(): Promise<DatabaseStatus> {
    return apiClient<DatabaseStatus>('/api/db/init', { method: 'POST' });
  },

  async runSeed(): Promise<DatabaseStatus> {
    return apiClient<DatabaseStatus>('/api/db/seed', { method: 'POST' });
  },
};
