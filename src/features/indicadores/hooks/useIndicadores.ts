import { useState, useEffect, useCallback } from 'react';
import type { IndicadorItem } from '../types/indicador.types';
import { indicadorService } from '../services/indicadorService';

export function useIndicadores(enabled: boolean = true) {
  const [indicadores, setIndicadores] = useState<IndicadorItem[]>([]);
  const [indicadorAtual, setIndicadorAtual] = useState<IndicadorItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [recalculando, setRecalculando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const [listRes, currentRes] = await Promise.all([
        indicadorService.getIndicadores().catch(() => ({ success: false, data: [] })),
        indicadorService.getIndicadorAtual().catch(() => ({ success: false, data: null })),
      ]);

      if (listRes.success && Array.isArray(listRes.data)) {
        setIndicadores(listRes.data);
      }
      if (currentRes.success && currentRes.data) {
        setIndicadorAtual(currentRes.data);
      } else if (listRes.data && listRes.data.length > 0) {
        setIndicadorAtual(listRes.data[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar indicadores BPC.');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const recalcular = async () => {
    setRecalculando(true);
    setError(null);
    try {
      const res = await indicadorService.recalcular();
      if (res.success && res.indicador) {
        setIndicadorAtual(res.indicador);
        await fetchData();
      }
      return res;
    } catch (err: any) {
      setError(err.message || 'Erro ao recalcular indicadores.');
      throw err;
    } finally {
      setRecalculando(false);
    }
  };

  return {
    indicadores,
    indicadorAtual,
    loading,
    recalculando,
    error,
    refetch: fetchData,
    recalcular,
  };
}
