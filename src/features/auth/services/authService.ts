import { apiClient } from '../../../lib/apiClient';
import type { LoginCredentials, LoginResponse, MeResponse } from '../types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiClient<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async getMe(): Promise<MeResponse> {
    return apiClient<MeResponse>('/api/auth/me', {
      method: 'GET',
    });
  },
};
