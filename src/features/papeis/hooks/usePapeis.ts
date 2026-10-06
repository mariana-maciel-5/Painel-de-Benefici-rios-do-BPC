import { useState, useEffect, useCallback } from 'react';
import type { PapelItem } from '../types/papel.types';
import { papelService } from '../services/papelService';

export function usePapeis(enabled: boolean = true) {
  const [papeis, setPapeis] = useState<PapelItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPapeis = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await papelService.getPapeis();
      if (res.success && Array.isArray(res.data)) {
        setPapeis(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar papéis.');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchPapeis();
  }, [fetchPapeis]);

  return {
    papeis,
    loading,
    error,
    refetch: fetchPapeis,
  };
}
