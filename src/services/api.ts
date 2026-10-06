import { apiClient } from '../lib/apiClient';

export const baseApiService = {
  get: <T>(url: string) => apiClient<T>(url, { method: 'GET' }),
  post: <T>(url: string, body?: any) =>
    apiClient<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(url: string, body?: any) =>
    apiClient<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(url: string) => apiClient<T>(url, { method: 'DELETE' }),
};
