import { STORAGE_KEYS } from '../config/constants';
import { getStorageItem, removeStorageItem } from '../utils/storage';

export class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

let onUnauthorizedCallback: (() => void) | null = null;

export function setOnUnauthorizedHandler(handler: () => void) {
  onUnauthorizedCallback = handler;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStorageItem(STORAGE_KEYS.TOKEN);
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeStorageItem(STORAGE_KEYS.TOKEN);
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.message || 'Sessão expirada ou não autorizada', 401, errorData);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || `Erro ${response.status}`, response.status, data);
  }

  return data as T;
}
