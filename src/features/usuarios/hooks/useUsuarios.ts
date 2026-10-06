import { useState, useEffect, useCallback } from 'react';
import type { UsuarioItem } from '../types/usuario.types';
import { usuarioService } from '../services/usuarioService';

export function useUsuarios(enabled: boolean = true) {
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await usuarioService.getUsuarios();
      if (res.success && Array.isArray(res.data)) {
        setUsuarios(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return {
    usuarios,
    loading,
    error,
    refetch: fetchUsuarios,
  };
}
