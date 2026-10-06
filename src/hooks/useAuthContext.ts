import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser utilizado dentro de um AuthProvider.');
  }
  return context;
}
