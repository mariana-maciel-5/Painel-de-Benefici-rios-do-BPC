import { createContext, useState, useEffect, ReactNode } from 'react';
import type { AuthUser, LoginCredentials } from '../features/auth/types/auth.types';
import { authService } from '../features/auth/services/authService';
import { STORAGE_KEYS } from '../config/constants';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import { setOnUnauthorizedHandler } from '../lib/apiClient';

export interface AuthContextType {
  token: string | null;
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStorageItem(STORAGE_KEYS.TOKEN));
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = () => {
    removeStorageItem(STORAGE_KEYS.TOKEN);
    setToken(null);
    setCurrentUser(null);
  };

  useEffect(() => {
    setOnUnauthorizedHandler(() => {
      logout();
    });
  }, []);

  useEffect(() => {
    async function loadUser() {
      const storedToken = getStorageItem(STORAGE_KEYS.TOKEN);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (res.success && res.usuario) {
          setCurrentUser(res.usuario);
          setToken(storedToken);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.token) {
      setStorageItem(STORAGE_KEYS.TOKEN, res.token);
      setToken(res.token);
      setCurrentUser(res.usuario);
    } else {
      throw new Error(res.message || 'Falha ao autenticar.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        isAuthenticated: !!token && !!currentUser,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
