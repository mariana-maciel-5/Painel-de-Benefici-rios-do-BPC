import { useState, useEffect, useCallback } from 'react';
import type { IndicadorItem, PainelItem, NovoIndicadorPayload } from '../types/indicador.types';
import { indicadorService } from '../services/indicadorService';

export function useIndicadores(enabled: boolean = true) {
  const [indicadores, setIndicadores] = useState<IndicadorItem[]>([]);
  const [paineis, setPaineis] = useState<PainelItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sincronizando, setSincronizando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const [indRes, panRes] = await Promise.all([
        indicadorService.getIndicadores().catch(() => ({ success: false, data: [] })),
        indicadorService.getPaineis().catch(() => ({ success: false, data: [] })),
      ]);

      if (indRes.success && Array.isArray(indRes.data)) {
        setIndicadores(indRes.data);
      }
      if (panRes.success && Array.isArray(panRes.data)) {
        setPaineis(panRes.data);
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

  const cadastrar = async (payload: NovoIndicadorPayload) => {
    const res = await indicadorService.cadastrar(payload);
    await fetchData();
    return res;
  };

  const excluir = async (id: number) => {
    const res = await indicadorService.excluir(id);
    await fetchData();
    return res;
  };

  const sincronizar = async () => {
    setSincronizando(true);
    setError(null);
    try {
      const res = await indicadorService.sincronizar();
      await fetchData();
      return res;
    } catch (err: any) {
      setError(err.message || 'Erro ao sincronizar indicadores.');
      throw err;
    } finally {
      setSincronizando(false);
    }
  };

  const filteredIndicadores = indicadores.filter((ind) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      ind.nome.toLowerCase().includes(term) ||
      ind.descricao?.toLowerCase().includes(term) ||
      ind.unidade.toLowerCase().includes(term) ||
      ind.fonte.toLowerCase().includes(term)
    );
  });

  return {
    indicadores: filteredIndicadores,
    totalCount: indicadores.length,
    paineis,
    loading,
    sincronizando,
    error,
    searchTerm,
    setSearchTerm,
    refetch: fetchData,
    cadastrar,
    excluir,
    sincronizar,
  };
}
